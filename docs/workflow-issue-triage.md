# 🔄 Workflow 1: Issue Triage

## 📋 Descripción General
El **Issue Triage Workflow** automatiza la clasificación y etiquetado de issues utilizando la inteligencia artificial de Gemini CLI. Analiza el contenido de los issues y aplica etiquetas relevantes basadas en el tipo, prioridad y área de funcionalidad.

## 🎯 Propósito
- **Automatizar** la clasificación de issues nuevos
- **Estandarizar** el etiquetado del repositorio  
- **Acelerar** el proceso de triage manual
- **Mantener** consistencia en la organización del proyecto

## 🚀 Activación del Workflow

### **Triggers Automáticos:**
- ✅ **Nuevos Issues**: Se ejecuta automáticamente cuando se crea un issue
- ✅ **Issues Reabiertos**: Se activa cuando se reabre un issue existente

### **Triggers Manuales:**
- 🔧 **Comando Específico**: `@gemini-cli /triage` en comentarios del issue
- 🔧 **Ejecución Manual**: Desde GitHub Actions UI

## 📊 Flujo de Datos Paso a Paso

### **Paso 1: Detección del Trigger**
```yaml
on:
  issues:
    types: [opened, reopened]
  issue_comment:
    types: [created]
```

**¿Qué pasa?**
- GitHub detecta un evento (nuevo issue o comentario)
- Evalúa las condiciones `if` del workflow
- Si coincide, inicia el workflow en un runner Ubuntu

### **Paso 2: Recolección de Contexto**
```yaml
- name: Obtener contexto del issue
  id: get-context
```

**Datos que se capturan:**
- 📝 **Título del issue**: `${{ github.event.issue.title }}`
- 📄 **Cuerpo del issue**: `${{ github.event.issue.body }}`
- 👤 **Autor**: `${{ github.event.issue.user.login }}`
- 🏷️ **Etiquetas existentes**: `${{ github.event.issue.labels }}`
- 🔗 **URL del issue**: Para referencia

### **Paso 3: Preparación del Prompt**
```yaml
- name: Ejecutar Gemini CLI para Clasificación
  uses: google-github-actions/run-gemini-cli@v0.1.10
```

**Contexto enviado a Gemini:**
```
ISSUE A CLASIFICAR:
Título: [título del issue]
Descripción: [cuerpo del issue]
Autor: [usuario que creó el issue]

INSTRUCCIONES:
Analiza este issue y determina:
- Tipo (bug, feature, question, documentation)
- Prioridad (priority-low, priority-medium, priority-high)
- Área (area-frontend, area-backend, area-docs)
- Complejidad (complexity-simple, complexity-medium, complexity-complex)
```

### **Paso 4: Procesamiento por Gemini CLI**

**🤖 Gemini CLI realiza:**
1. **Análisis semántico** del título y descripción
2. **Identificación de patrones** (errores, solicitudes, preguntas)
3. **Clasificación automática** según criterios predefinidos
4. **Generación de etiquetas** apropiadas
5. **Creación de resumen** con justificación

**🔍 Ejemplos de análisis:**
- *"La aplicación se crashea al hacer login"* → `bug`, `priority-high`, `area-backend`
- *"Agregar un botón de compartir"* → `feature`, `priority-medium`, `area-frontend`
- *"¿Cómo instalar la aplicación?"* → `question`, `priority-low`, `area-docs`

### **Paso 5: Aplicación de Etiquetas**
```yaml
- name: Aplicar etiquetas automáticamente
  uses: actions/github-script@v7
```

**Proceso:**
1. **Extrae etiquetas** de la respuesta de Gemini
2. **Valida etiquetas** contra las disponibles en el repositorio
3. **Aplica etiquetas** al issue usando GitHub API
4. **Registra actividad** en los logs

### **Paso 6: Comentario de Resultado**
```yaml
- name: Comentar resultado de clasificación
```

**Comentario generado:**
```markdown
🤖 **Clasificación Automática por Gemini CLI**

📊 **Análisis**
Tipo: question
Prioridad: priority-low
Complejidad: complexity-simple
Área: area-frontend

🏷️ **Etiquetas aplicadas**
- question
- priority-low
- complexity-simple
- area-frontend

📝 **Análisis**
El issue es una consulta general sobre optimización...

💡 **Recomendaciones**
- Revisar documentación de performance
- Considerar crear una guía específica
```

## 🔧 Configuración Técnica

### **Permisos Requeridos:**
```yaml
permissions:
  contents: read    # Leer archivos del repositorio
  issues: write     # Comentar y etiquetar issues
```

### **Secretos Necesarios:**
- `GEMINI_API_KEY`: API key de Google AI Studio

### **Variables de Entorno:**
- `GITHUB_TOKEN`: Token automático de GitHub Actions

## 🎭 Personalización

### **Modificar Criterios de Clasificación:**
Edita el prompt en el workflow para cambiar:
- Tipos de etiquetas a aplicar
- Criterios de priorización
- Áreas de funcionalidad específicas

### **Agregar Nuevas Etiquetas:**
1. Crear etiquetas en el repositorio
2. Actualizar el prompt con las nuevas opciones
3. Probar con issues de ejemplo

## 🐛 Manejo de Errores

### **Si falla la clasificación:**
- Se genera un comentario con enlace a los logs
- El issue mantiene su estado original
- Se puede volver a ejecutar manualmente

### **Logs de Debugging:**
- Accesibles en GitHub Actions
- Incluyen respuesta completa de Gemini
- Detallan proceso de aplicación de etiquetas

## 📈 Métricas y Monitoreo

### **Indicadores de éxito:**
- Issues clasificados automáticamente: >90%
- Precisión en etiquetado: >85%
- Tiempo de clasificación: <2 minutos

### **Revisar periodicamente:**
- Exactitud de las clasificaciones
- Nuevos tipos de issues no contemplados
- Feedback de la comunidad sobre el etiquetado

---

## 🚀 Ejemplo Completo de Ejecución

### **Input:**
```
Título: "La aplicación se vuelve lenta después de añadir muchas tareas"
Descripción: "Cuando agrego más de 100 tareas en TaskFlow Manager, 
la interfaz se vuelve muy lenta al hacer scroll y al filtrar. 
¿Hay alguna forma de optimizar esto?"
```

### **Procesamiento Gemini:**
1. Analiza que menciona "lenta" y "optimizar" → problema de rendimiento
2. Identifica componente afectado → frontend (interfaz, scroll)
3. Evalúa impacto → medio (no crashea, pero afecta UX)
4. Determina complejidad → media (requiere optimización)

### **Output:**
```
Etiquetas aplicadas: performance, area-frontend, priority-medium, complexity-medium
Comentario: Análisis detallado de optimización con recomendaciones
```

¡El workflow convierte automáticamente issues sin clasificar en issues bien organizados y accionables! 🎯
