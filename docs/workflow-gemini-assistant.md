# 🤖 Workflow 3: Gemini Assistant

## 📋 Descripción General
El **Gemini Assistant Workflow** proporciona un asistente técnico inteligente disponible 24/7 para el equipo de desarrollo. Responde consultas técnicas, explica código, sugiere mejoras y ayuda con documentación directamente desde issues y comentarios de GitHub.

## 🎯 Propósito
- **Asistir** al equipo con consultas técnicas instantáneas
- **Explicar** código complejo y arquitecturas
- **Sugerir** mejores prácticas y optimizaciones  
- **Generar** documentación técnica automática
- **Resolver** dudas sobre implementación

## 🚀 Activación del Workflow

### **Comandos Disponibles:**
- 🤖 **`@gemini-cli /explicar`**: Explica código o conceptos técnicos
- 💡 **`@gemini-cli /sugerir`**: Proporciona sugerencias y mejoras
- 📚 **`@gemini-cli /documentar`**: Genera documentación técnica
- 🔧 **`@gemini-cli /implementar`**: Ayuda con implementación de features
- 🐛 **`@gemini-cli /debug`**: Asiste en debugging y resolución de problemas
- 💬 **`@gemini-cli [cualquier consulta]`**: Responde preguntas generales

### **Locations de Activación:**
- 📝 **Issues**: Comentarios en cualquier issue
- 🔀 **Pull Requests**: Comentarios en PRs (excepto /triage y /review)
- 💬 **Discussions**: Comentarios en discusiones del repositorio

## 📊 Flujo de Datos Paso a Paso

### **Paso 1: Detección del Comando**
```yaml
on:
  issue_comment:
    types: [created]
```

**Proceso de filtrado:**
```yaml
if: >
  contains(github.event.comment.body, '@gemini-cli') &&
  !contains(github.event.comment.body, '/triage') &&
  !contains(github.event.comment.body, '/review')
```

**¿Qué pasa?**
- 👂 **Escucha** todos los comentarios en el repositorio
- 🔍 **Filtra** menciones a `@gemini-cli`
- ✅ **Excluye** comandos específicos (/triage, /review)
- 🚀 **Activa** el workflow en runner Ubuntu

### **Paso 2: Extracción del Contexto**
```yaml
- name: Extraer contexto del comentario
  id: extract-context
  uses: actions/github-script@v7
```

**Información capturada:**

#### **📍 Contexto del Comentario:**
```javascript
const comment = context.payload.comment;
const contextData = {
  body: comment.body,                    // Texto del comentario
  author: comment.user.login,            // Usuario que comentó
  created_at: comment.created_at,        // Timestamp
  html_url: comment.html_url            // URL del comentario
};
```

#### **📄 Contexto del Issue/PR:**
```javascript
const issue = context.payload.issue;
const issueContext = {
  title: issue.title,                    // Título del issue/PR
  body: issue.body,                      // Descripción original
  labels: issue.labels,                  // Labels aplicadas
  assignees: issue.assignees,            // Asignados
  state: issue.state,                    // Estado (open/closed)
  number: issue.number                   // Número del issue/PR
};
```

#### **🗂️ Contexto del Repositorio:**
```javascript
const repoContext = {
  name: context.repo.repo,              // Nombre del repositorio
  owner: context.repo.owner,            // Propietario
  default_branch: 'main',               // Branch principal
  language: 'JavaScript'               // Lenguaje principal
};
```

### **Paso 3: Análisis del Comando**

**🎯 Detección de comando específico:**
```javascript
const commandPattern = /@gemini-cli\s+(\/\w+)?\s*(.*)/;
const match = comment.body.match(commandPattern);

const command = match[1] || 'general';    // Comando específico o general
const query = match[2] || comment.body;   // Consulta del usuario
```

**📋 Tipos de comando identificados:**

#### **1. `/explicar` - Explicación Técnica**
```
Entrada: @gemini-cli /explicar ¿Cómo funciona React useState?
Contexto: Pregunta sobre hooks de React
Tipo: Explicación didáctica
```

#### **2. `/sugerir` - Sugerencias y Mejoras**
```
Entrada: @gemini-cli /sugerir optimizar esta función de búsqueda
Contexto: Solicitud de optimización
Tipo: Asesoramiento técnico
```

#### **3. `/documentar` - Generación de Docs**
```
Entrada: @gemini-cli /documentar API endpoints del proyecto
Contexto: Necesidad de documentación
Tipo: Generación automática
```

#### **4. `/implementar` - Ayuda con Implementación**
```
Entrada: @gemini-cli /implementar autenticación JWT
Contexto: Solicitud de implementación
Tipo: Guía paso a paso
```

#### **5. `/debug` - Resolución de Problemas**
```
Entrada: @gemini-cli /debug error en validación de formulario
Contexto: Problema técnico específico
Tipo: Análisis y solución
```

### **Paso 4: Enriquecimiento del Contexto**

**📂 Obtención de archivos relevantes:**
```yaml
- name: Obtener archivos del repositorio
  id: get-files
  run: |
    # Listar archivos importantes del proyecto
    find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \
           -o -name "*.json" -o -name "*.md" | head -20 > relevant_files.txt
```

**📄 Lectura de archivos relevantes:**
```javascript
const relevantFiles = [];
if (query.includes('TaskManager') || query.includes('componente')) {
  const taskManagerContent = await fs.readFile('frontend/scripts/taskManager.js', 'utf8');
  relevantFiles.push({
    path: 'frontend/scripts/taskManager.js',
    content: taskManagerContent
  });
}
```

### **Paso 5: Construcción del Prompt**

**🎯 Prompt personalizado por comando:**

#### **Para `/explicar`:**
```markdown
Rol: Eres un experto desarrollador y mentor técnico.

Contexto del Repositorio:
- Proyecto: TaskFlow Manager (Gestor de tareas en JavaScript)
- Archivos principales: [lista de archivos]
- Tecnologías: HTML5, CSS3, JavaScript vanilla

Consulta del Usuario:
@usuario pregunta: "¿Cómo funciona React useState?"

Instrucciones:
1. Proporciona una explicación clara y didáctica
2. Incluye ejemplos prácticos con código
3. Relaciona con el contexto del proyecto actual
4. Sugiere implementación específica para este repo
5. Mantén un tono educativo y amigable

Formato de respuesta:
- Usa emojis para claridad visual
- Estructura con headers markdown
- Incluye ejemplos de código con syntax highlighting
- Proporciona recursos adicionales si es útil
```

#### **Para `/sugerir`:**
```markdown
Rol: Eres un arquitecto de software senior especialista en optimización.

Contexto del Proyecto:
[... información del repositorio ...]

Solicitud de Sugerencia:
"optimizar esta función de búsqueda"

Análisis Requerido:
1. 🔍 Analizar implementación actual
2. ⚡ Identificar cuellos de botella
3. 💡 Proponer mejoras específicas
4. 📊 Estimar impacto en performance
5. 🛠️ Dar plan de implementación paso a paso
```

### **Paso 6: Procesamiento por Gemini CLI**

**🤖 Gemini CLI analiza:**

#### **📚 Base de Conocimiento:**
- Mejores prácticas de desarrollo
- Patrones de diseño actuales
- Frameworks y librerías populares
- Estándares de la industria
- Tendencias tecnológicas

#### **🔍 Análisis Contextual:**
- Código existente en el proyecto
- Arquitectura y estructura actual
- Tecnologías utilizadas
- Nivel de complejidad apropiado
- Restricciones del proyecto

#### **🎯 Generación de Respuesta:**
- Adaptada al nivel técnico detectado
- Específica para el proyecto actual
- Con ejemplos prácticos aplicables
- Siguiendo mejores prácticas
- Con tono profesional pero amigable

### **Paso 7: Formateo de la Respuesta**

**📝 Estructura estándar:**
```markdown
🤖 **Asistente Gemini CLI**

## [Tipo de Consulta] 

### 📋 Resumen
[Respuesta concisa y directa]

### 🔍 Análisis Detallado
[Explicación técnica profunda]

### 💡 Implementación Sugerida
```javascript
// Código de ejemplo específico para el proyecto
function ejemploOptimizado() {
  // Implementación mejorada
}
```

### 🎯 Próximos Pasos
1. [Paso 1 específico]
2. [Paso 2 específico]
3. [Paso 3 específico]

### 📚 Recursos Adicionales
- [Enlaces a documentación]
- [Tutoriales recomendados]
- [Herramientas útiles]

---
*¿Necesitas más información específica? Menciona @gemini-cli con tu consulta adicional.*
```

### **Paso 8: Publicación del Comentario**

```yaml
- name: Responder con Gemini CLI
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: geminiResponse
      });
```

## 🔧 Configuración Técnica

### **Permisos Necesarios:**
```yaml
permissions:
  contents: read      # Leer archivos del proyecto
  issues: write       # Comentar en issues
  pull-requests: write # Comentar en PRs
```

### **Variables de Entorno:**
```yaml
env:
  GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
  PROJECT_CONTEXT: "TaskFlow Manager - JavaScript Task Management App"
  RESPONSE_LANGUAGE: "es"
```

### **Limitaciones Configuradas:**
- **Máximo 5000 caracteres** por respuesta
- **Timeout de 3 minutos** por consulta
- **Máximo 10 archivos** analizados por contexto
- **Rate limit**: 50 consultas por hora

## 🎭 Personalización por Tipo de Proyecto

### **Para Proyectos Frontend:**
```yaml
project_type: "frontend"
focus_areas:
  - "UI/UX best practices"
  - "Performance optimization"
  - "Accessibility (a11y)"
  - "Cross-browser compatibility"
  - "Modern JavaScript/CSS"
```

### **Para Proyectos Backend:**
```yaml
project_type: "backend"
focus_areas:
  - "API design patterns"
  - "Security best practices"
  - "Database optimization"
  - "Scalability patterns"
  - "Testing strategies"
```

## 🎯 Ejemplos de Uso Real

### **Ejemplo 1: Explicación de Concepto**

#### **Input:**
```
@gemini-cli /explicar ¿Qué es el patrón Observer y cómo implementarlo en JavaScript?
```

#### **Proceso:**
1. **Detección**: Comando `/explicar` identificado
2. **Contexto**: Proyecto JavaScript vanilla detectado
3. **Análisis**: Gemini identifica necesidad de explicación didáctica
4. **Generación**: Respuesta adaptada al nivel del proyecto

#### **Output:**
```markdown
🤖 **Asistente Gemini CLI**

## 📚 Explicación: Patrón Observer

### 📋 Resumen
El patrón Observer es un patrón de diseño que define una dependencia 
uno-a-muchos entre objetos, donde cuando un objeto cambia su estado, 
todos los dependientes son notificados automáticamente.

### 🔍 ¿Cómo funciona?
En tu proyecto TaskFlow Manager, podrías usar Observer para:
- 🔔 Notificar cambios en la lista de tareas
- 📊 Actualizar estadísticas automáticamente
- 🎨 Sincronizar múltiples vistas

### 💡 Implementación para TaskFlow
```javascript
class TaskObserver {
  constructor() {
    this.observers = [];
  }
  
  subscribe(fn) {
    this.observers.push(fn);
  }
  
  notify(data) {
    this.observers.forEach(fn => fn(data));
  }
}

// En tu TaskManager
const taskNotifier = new TaskObserver();

// Suscribir componentes
taskNotifier.subscribe(updateTaskCount);
taskNotifier.subscribe(updateProgress);

// Notificar cambios
function addTask(task) {
  tasks.push(task);
  taskNotifier.notify({ type: 'added', task });
}
```

### 🎯 Beneficios en tu proyecto
- ✅ Desacoplamiento de componentes
- ✅ Actualizaciones automáticas de UI
- ✅ Fácil mantenimiento y extensión

¿Te gustaría que implemente este patrón en algún archivo específico?
```

### **Ejemplo 2: Sugerencia de Optimización**

#### **Input:**
```
@gemini-cli /sugerir La función de filtrado de tareas se vuelve lenta 
con muchas tareas. ¿Cómo optimizarla?
```

#### **Output:**
```markdown
🤖 **Asistente Gemini CLI**

## ⚡ Optimización: Filtrado de Tareas

### 🔍 Análisis del Problema
Revisé tu implementación en `taskManager.js` y identifiqué:
- 🐌 Filtrado en cada render/cambio
- 🔄 Sin memoización de resultados
- 📊 Búsqueda lineal O(n) en cada filtro

### 💡 Soluciones Sugeridas

#### 1. **Implementar Debouncing**
```javascript
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedFilter = debounce(filterTasks, 300);
```

#### 2. **Caché de Resultados**
```javascript
class TaskFilter {
  constructor() {
    this.cache = new Map();
  }
  
  filter(tasks, criteria) {
    const key = JSON.stringify(criteria);
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    const filtered = this.performFilter(tasks, criteria);
    this.cache.set(key, filtered);
    return filtered;
  }
}
```

### 📊 Impacto Esperado
- ⚡ **50-80%** mejora en velocidad
- 💾 **Reducción** de CPU usage
- 🎯 **Mejor UX** sin lag perceptible

¿Implemento alguna de estas optimizaciones?
```

## 🐛 Manejo de Errores

### **Errores Comunes y Soluciones:**

#### **1. Consulta Ambigua:**
```
Usuario: @gemini-cli esto no funciona
Gemini: 🤔 Necesito más contexto específico. ¿Podrías detallar:
- ¿Qué archivo o función específica?
- ¿Qué error o comportamiento observas?
- ¿Qué esperabas que sucediera?
```

#### **2. Código Demasiado Complejo:**
```
Gemini: 📋 Tu consulta requiere análisis extenso. Te proporciono:
1. ✅ Solución inmediata (quick fix)
2. 📚 Análisis detallado en issue separado
3. 🔗 Recursos para profundizar
```

#### **3. Tecnología No Reconocida:**
```
Gemini: 🔍 No tengo información específica sobre [tecnología].
Pero puedo ayudarte con:
- 💡 Principios generales aplicables
- 🔗 Recursos confiables para consultar
- 🤝 Conectarte con expertos de la comunidad
```

## 📈 Métricas y Evolución

### **KPIs del Asistente:**
- 📊 **Consultas resueltas**: >90% satisfacción
- ⚡ **Tiempo de respuesta**: <2 minutos promedio
- 🎯 **Precisión técnica**: >95% información correcta
- 🔄 **Adopción**: Aumento en uso mes a mes

### **Aprendizaje Continuo:**
- 📝 **Feedback tracking**: Reacciones a respuestas
- 🔄 **Mejora iterativa**: Ajustes basados en uso
- 📚 **Base de conocimiento**: Expansion con casos reales
- 🤖 **Fine-tuning**: Optimización para el proyecto específico

## 🚀 Roadmap de Funcionalidades

### **Próximas Mejoras:**
- 🔗 **Integración con PRs**: Análisis de código en tiempo real
- 📊 **Dashboard de métricas**: Estadísticas de uso y efectividad
- 🤖 **Learning mode**: Adaptación al estilo del equipo
- 🔔 **Notificaciones proactivas**: Sugerencias automáticas

¡El Gemini Assistant transforma la colaboración técnica en tu repositorio! 🎯
