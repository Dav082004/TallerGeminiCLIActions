# 🔍 Workflow 2: PR Review

## 📋 Descripción General
El **PR Review Workflow** automatiza la revisión de código en Pull Requests utilizando Gemini CLI. Analiza los cambios propuestos y proporciona feedback detallado sobre seguridad, rendimiento, mantenibilidad y mejores prácticas.

## 🎯 Propósito
- **Automatizar** la revisión inicial de código
- **Identificar** problemas de seguridad y rendimiento
- **Mantener** estándares de calidad consistentes
- **Acelerar** el proceso de code review
- **Educar** a desarrolladores con feedback constructivo

## 🚀 Activación del Workflow

### **Triggers Automáticos:**
- ✅ **Nuevos PRs**: Se ejecuta al crear un Pull Request
- ✅ **PRs Actualizados**: Se activa con nuevos commits (`synchronize`)
- ✅ **PRs Reabiertos**: Se ejecuta al reabrir un PR cerrado

### **Triggers Manuales:**
- 🔧 **Comando Específico**: `@gemini-cli /review` en comentarios del PR
- 🔧 **Ejecución Manual**: Desde GitHub Actions UI

## 📊 Flujo de Datos Paso a Paso

### **Paso 1: Detección del Trigger**
```yaml
on:
  pull_request:
    types: [opened, reopened, synchronize]
  issue_comment:
    types: [created]
```

**¿Qué pasa?**
- GitHub detecta cambios en el PR o comentario con comando
- Evalúa las condiciones del workflow
- Inicia el proceso en un runner Ubuntu limpio

### **Paso 2: Checkout del Código**
```yaml
- name: Checkout del código
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

**Proceso:**
- 📥 **Descarga** el repositorio completo
- 🔄 **Obtiene** historial de commits
- 📂 **Prepara** ambiente para análisis de diferencias

### **Paso 3: Obtención del Diff del PR**
```yaml
- name: Obtener diff del PR
  id: get-diff
  uses: actions/github-script@v7
```

**Datos extraídos:**
```javascript
const { data: files } = await github.rest.pulls.listFiles({
  owner: context.repo.owner,
  repo: context.repo.repo,
  pull_number: prNumber
});
```

**Información capturada:**
- 📄 **Archivos modificados**: Lista completa con rutas
- ➕ **Líneas añadidas**: Código nuevo agregado
- ➖ **Líneas eliminadas**: Código removido
- 🔄 **Tipo de cambio**: `added`, `modified`, `deleted`, `renamed`
- 📊 **Estadísticas**: Número de cambios por archivo

### **Paso 4: Preparación del Contexto**
```yaml
- name: Ejecutar Gemini CLI para Revisión
  id: gemini-review
```

**Contexto enviado a Gemini:**
```
PULL REQUEST A REVISAR:
Título: [título del PR]
Descripción: [descripción del PR]

ARCHIVOS MODIFICADOS:

### 📄 src/components/TaskManager.js
**Estado**: modified
**Cambios**: +25 -10

```diff
@@ -15,8 +15,12 @@ function TaskManager() {
   const [tasks, setTasks] = useState([]);
+  const [filter, setFilter] = useState('all');
+  const [isLoading, setIsLoading] = useState(false);
   
   const addTask = (task) => {
+    setIsLoading(true);
     setTasks([...tasks, task]);
+    setIsLoading(false);
   };
```

### 📄 src/utils/api.js
**Estado**: added
**Cambios**: +45 -0
[... código completo del archivo ...]
```

### **Paso 5: Análisis por Gemini CLI**

**🤖 Gemini CLI evalúa:**

#### **🔒 Seguridad:**
- Vulnerabilidades conocidas (XSS, SQL injection, etc.)
- Validación de entrada de datos
- Manejo seguro de credenciales
- Exposición de información sensible

#### **⚡ Rendimiento:**
- Algoritmos ineficientes (O(n²), etc.)
- Memory leaks y gestión de memoria
- Operaciones síncronas bloqueantes
- Optimizaciones perdidas

#### **🛡️ Confiabilidad:**
- Manejo de errores y excepciones
- Casos edge no contemplados
- Tests y cobertura de código
- Validación de tipos y datos

#### **🧹 Mantenibilidad:**
- Código limpio y legible
- Documentación y comentarios
- Convenciones de nomenclatura
- Estructura y organización

### **Paso 6: Generación del Review**

**Formato estructurado:**
```markdown
## 🔍 Revisión de Código

### ✅ Aspectos Positivos
- Uso correcto de React hooks
- Manejo adecuado del estado
- Estructura de componentes clara

### 🔍 Análisis por Categoría

#### 🔒 Seguridad
✅ No se detectan vulnerabilidades evidentes
🟡 Considerar validación adicional en inputs

#### ⚡ Rendimiento  
🔴 **Crítico**: setState síncrono en addTask puede causar problemas
🟠 **Sugerencia**: Usar useCallback para optimizar renders

#### 🛡️ Confiabilidad
🟡 Falta manejo de errores en llamadas API
✅ Estado de loading implementado correctamente

#### 🧹 Mantenibilidad
✅ Nombres de variables descriptivos
🟡 Agregar JSDoc a funciones complejas

### 📋 Recomendaciones

#### 🔴 Críticas
1. **setState síncrono**: Cambiar a operación asíncrona
2. **Error handling**: Agregar try/catch en API calls

#### 🟠 Importantes  
1. **Performance**: Implementar memoización
2. **Testing**: Agregar tests para nuevas funciones

### 🎯 Veredicto
- [ ] ✅ Aprobado - Listo para merge
- [x] 🔄 Necesita cambios menores
- [ ] ⛔ Requiere cambios importantes
```

### **Paso 7: Comentario Automático**
```yaml
- name: Comentar revisión en el PR
  uses: actions/github-script@v7
```

**Proceso:**
1. **Captura** la respuesta completa de Gemini
2. **Formatea** el comentario con estructura markdown
3. **Publica** en el PR usando GitHub API
4. **Registra** la actividad en logs

## 🔧 Configuración Técnica

### **Permisos Requeridos:**
```yaml
permissions:
  contents: read        # Leer código del repositorio
  pull-requests: write  # Comentar en PRs
  issues: write        # Comentar si PR viene de issue
```

### **Secretos Necesarios:**
- `GEMINI_API_KEY`: API key de Google AI Studio

### **Limitaciones de Código:**
- **Máximo 10 archivos** por PR (para evitar timeouts)
- **Máximo 2000 caracteres** por diff (para optimizar tokens)
- **Timeout de 5 minutos** por análisis

## 🎭 Personalización

### **Modificar Criterios de Review:**
```yaml
prompt: |
  Enfócate especialmente en:
  - Seguridad en APIs REST
  - Performance en componentes React
  - Accesibilidad web (a11y)
  - Compatibilidad cross-browser
```

### **Ajustar Severidad:**
```yaml
🔴 Bloqueante: Vulnerabilidades críticas
🟠 Alto: Problems de rendimiento
🟡 Medio: Mejoras de código
🟢 Bajo: Sugerencias de estilo
```

## 🐛 Manejo de Errores

### **Errores Comunes:**

#### **1. PR muy grande:**
```
❌ Error: PR contiene demasiados cambios para analizar
💡 Solución: Dividir en PRs más pequeños
```

#### **2. Timeout de Gemini:**
```
❌ Error: Análisis tardó demasiado tiempo
💡 Solución: Revisar manualmente o simplificar cambios
```

#### **3. API Key inválida:**
```
❌ Error: No se pudo conectar con Gemini CLI
💡 Solución: Verificar GEMINI_API_KEY en secretos
```

### **Recuperación automática:**
- **Retry**: 3 intentos automáticos
- **Fallback**: Comentario explicando el error
- **Logs**: Información detallada para debugging

## 📈 Métricas y Monitoreo

### **KPIs del Workflow:**
- ✅ **Tasa de éxito**: >95% de PRs analizados
- ⚡ **Tiempo promedio**: <3 minutos por review
- 🎯 **Precisión**: >90% de issues identificados correctamente
- 🔄 **Adopción**: >80% de PRs usando el workflow

### **Métricas de Calidad:**
- 🐛 **Bugs detectados**: Antes vs después del merge
- 🔒 **Vulnerabilidades**: Prevención proactiva
- 📚 **Aprendizaje**: Mejora en código de desarrolladores

## 🚀 Ejemplo Completo de Ejecución

### **Escenario: PR de Nueva Feature**

#### **Input:**
```
Título: "feat: agregar filtros avanzados en TaskManager"
Archivos: 
- src/components/TaskManager.js (+45 -10)
- src/hooks/useFilters.js (+60 -0)
- src/utils/filterHelpers.js (+30 -0)
```

#### **Análisis Gemini:**
1. **Seguridad**: ✅ Sin vulnerabilidades
2. **Rendimiento**: 🟡 Filtros podrían optimizarse
3. **Confiabilidad**: 🟠 Falta manejo de errores
4. **Mantenibilidad**: ✅ Código bien estructurado

#### **Output:**
```
🤖 **Revisión Automática por Gemini CLI**

## 🔍 Revisión de Código

### ✅ Aspectos Positivos
- Excelente separación de responsabilidades con custom hook
- Implementación de filtros intuitiva y flexible
- Código limpio y bien documentado

[... análisis detallado ...]

### 🎯 Veredicto
- [x] 🔄 Necesita cambios menores

**Justificación**: Implementación sólida que requiere pequeñas 
mejoras en manejo de errores y optimización de performance.
```

¡El workflow transforma la revisión de código de proceso manual a análisis automático inteligente! 🎯
