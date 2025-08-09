# 🎯 TaskFlow Manager - Demo Setup Guide

Este documento te guía paso a paso para configurar la demo completa de **TaskFlow Manager** con los 3 workflows de Gemini CLI.

## 📋 Preparación Rápida (5 minutos)

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea una nueva API key
3. Copia la key (la necesitarás en el paso 3)

### 2. Fork/Clonar este Repositorio

```bash
# Si ya tienes el código localmente, continúa al paso 3
git clone https://github.com/tu-usuario/taskflow-manager.git
cd taskflow-manager
```

### 3. Configurar GitHub Secrets

1. Ve a tu repositorio en GitHub
2. **Settings > Secrets and variables > Actions**
3. Click **"New repository secret"**
4. **Name**: `GEMINI_API_KEY`
5. **Value**: Tu API key de Gemini
6. Click **"Add secret"**

### 4. Activar GitHub Actions

1. Ve a la pestaña **"Actions"** en tu repositorio
2. Click **"I understand my workflows, go ahead and enable them"**
3. Los 3 workflows ahora están listos:
   - 🔍 Issue Triage
   - 📝 PR Review
   - 🤖 Gemini Assistant

## 🎬 Script de Demo (1 hora)

### ⏰ Minutos 0-10: Introducción

**Mostrar el proyecto funcionando:**

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

**Abrir http://localhost:3000 y mostrar:**

- ✅ Interfaz de gestión de tareas funcionando
- ✅ Estadísticas en tiempo real
- ✅ Filtros y búsqueda
- ✅ Tema oscuro/claro

### ⏰ Minutos 10-20: Demo Workflow 1 - Issue Triage

**Crear estos issues en vivo:**

1. **Bug Issue:**

```markdown
**Título:** App crashes when adding more than 10 tasks

**Descripción:**
Steps to reproduce:

1. Add 10 tasks to the task list
2. Try to add an 11th task
3. Application freezes and becomes unresponsive

Expected: Should add the task normally
Actual: App crashes with JavaScript error

Browser: Chrome 118
OS: Windows 11
```

2. **Feature Request:**

```markdown
**Título:** Add task filtering by date range

**Descripción:**
As a user, I want to filter my tasks by date range so I can focus on tasks due in specific time periods.

Acceptance Criteria:

- [ ] Date range picker in filter section
- [ ] Filter applies immediately on selection
- [ ] Persists filter when page reloads
- [ ] Shows count of filtered results
```

3. **Question Issue:**

```markdown
**Título:** How to deploy this application to production?

**Descripción:**
I've been testing TaskFlow Manager locally and it works great!

What's the recommended way to deploy this to production? Are there any specific requirements or configurations I should be aware of?
```

**Mostrar cómo Gemini CLI:**

- 🏷️ Clasifica automáticamente (bug, enhancement, question)
- 🎯 Asigna prioridades apropiadas
- 📊 Sugiere labels correctos
- 👥 Recomienda asignaciones de equipo

### ⏰ Minutos 20-35: Demo Workflow 2 - PR Review

**Crear un PR con código con bugs intencionales:**

1. **Crear nueva rama:**

```bash
git checkout -b demo/fix-task-validation
```

2. **Agregar código con errores en `frontend/scripts/taskManager.js`:**

```javascript
// Bug intencional 1: Assignment instead of comparison
addTask(taskData) {
  if (taskData.title = '') {  // ❌ Debería ser ===
    return { success: false, error: 'Title required' };
  }

  // Bug intencional 2: No input validation
  this.tasks.push(taskData);  // ❌ No validation

  // Bug intencional 3: No error handling
  localStorage.setItem('tasks', JSON.stringify(this.tasks));  // ❌ No try/catch

  return { success: true };
}
```

3. **Hacer commit y push:**

```bash
git add .
git commit -m "Fix task validation issues"
git push origin demo/fix-task-validation
```

4. **Abrir PR en GitHub** con descripción:

```markdown
## 🐛 Fix Task Validation Issues

This PR addresses several validation issues in the task management system:

- Add proper input validation for task creation
- Fix comparison operator in title check
- Improve error handling for localStorage operations

### Changes Made

- Updated `addTask` method in `taskManager.js`
- Added validation for required fields
- Improved error messaging

### Testing

- [x] Manual testing with invalid inputs
- [x] Verified error messages display correctly
- [ ] Unit tests for validation logic (TODO)
```

**Mostrar cómo Gemini CLI:**

- 🔍 Detecta los bugs automáticamente
- 🛡️ Identifica problemas de seguridad
- 📈 Sugiere optimizaciones
- 🧪 Recomienda tests faltantes
- 📝 Da feedback constructivo

### ⏰ Minutos 35-50: Demo Workflow 3 - Asistente Conversacional

**En el PR o Issues, usar estos comandos:**

1. **Pedir explicación de código:**

```
@gemini-cli explain what this addTask function does and identify any potential issues
```

2. **Solicitar corrección de bugs:**

```
@gemini-cli fix the assignment bug in line 3 of the addTask function
```

3. **Pedir tests unitarios:**

```
@gemini-cli write unit tests for the addTask function with validation scenarios
```

4. **Optimización de código:**

```
@gemini-cli optimize this function for better performance and error handling
```

5. **Documentación:**

```
@gemini-cli add JSDoc documentation to this function with proper parameter types
```

6. **Estimación de esfuerzo:**

```
@gemini-cli estimate the development effort needed to implement task filtering by date range
```

**Mostrar cómo Gemini CLI:**

- 💬 Responde de forma conversacional
- 🎯 Mantiene contexto de la conversación
- 🔧 Proporciona código funcional
- 📚 Explica decisiones técnicas
- ⏱️ Da estimaciones realistas

### ⏰ Minutos 50-60: Q&A y Recursos

**Cubrir temas como:**

- 🔧 Personalización con `GEMINI.md`
- 🚀 Integración en proyectos existentes
- 💰 Costos y límites de API
- 🔒 Consideraciones de seguridad
- 📈 Métricas y observabilidad

## 🎁 Recursos para la Audiencia

**Links importantes:**

- 📖 [Documentación Gemini CLI](https://github.com/google-gemini/gemini-cli)
- 🚀 [GitHub Actions con Gemini](https://github.com/google-github-actions/run-gemini-cli)
- 🔑 [Google AI Studio](https://aistudio.google.com/apikey)
- 💬 [Comunidad Gemini](https://github.com/google-gemini/gemini-cli/discussions)

**Archivos para descargar:**

- ✅ Repositorio completo cloneable
- ✅ Workflows templates listos para usar
- ✅ Ejemplos de `GEMINI.md`
- ✅ Guía de mejores prácticas

## 🚨 Troubleshooting Rápido

### Problema: "Gemini API key not found"

**Solución:** Verificar que el secret `GEMINI_API_KEY` esté configurado correctamente en GitHub.

### Problema: "Workflows not triggering"

**Solución:**

1. Verificar que GitHub Actions esté habilitado
2. Comprobar que los archivos de workflow estén en `.github/workflows/`
3. Revisar permisos del repositorio

### Problema: "Rate limit exceeded"

**Solución:** Gemini API tiene límites. Esperar unos minutos o usar otra API key.

### Problema: "No response from Gemini CLI"

**Solución:**

1. Verificar sintaxis del comando `@gemini-cli`
2. Comprobar logs en GitHub Actions
3. Asegurar que el contexto sea claro

## 📊 Métricas de Éxito de la Demo

- ✅ **Issues clasificados:** <30 segundos
- ✅ **PR revisado:** <60 segundos
- ✅ **Respuesta conversacional:** <45 segundos
- ✅ **Bugs detectados:** 90%+ de precisión
- ✅ **Audiencia comprende:** Conceptos clave claros

---

**🎯 ¡Demo lista para impresionar en 1 hora! 🚀**
