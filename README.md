# 🎯 TaskFlow Manager - Smart Code Review System Demo

## 📋 Overview

Una aplicación web de gestión de tareas que demuestra los **3 workflows principales** de Gemini CLI en una charla de 1 hora:

1. **Issue Triage** - Clasificación automática de issues
2. **PR Review** - Revisión automática de pull requests
3. **Gemini Assistant** - Asistente conversacional bajo demanda

## 🚀 Demo Live Setup

### Quick Start para la Charla

1. **Fork este repositorio**
2. **Agregar Secret**: `GEMINI_API_KEY` en Settings > Secrets
3. **Activar workflows** en Actions tab
4. **¡Listo para la demo!**

## 🎬 Guión de Charla (60 minutos)

### ⏰ 0-10 min: Introducción y Setup

- Mostrar proyecto funcionando
- Explicar el problema que resolvemos
- Overview de Gemini CLI

### ⏰ 10-20 min: Workflow 1 - Issue Triage

**Demo**: Crear issues y ver clasificación automática

- Bug report → Auto-label "bug", prioridad "high"
- Feature request → Auto-label "enhancement"
- Question → Auto-label "question", assign to docs team

### ⏰ 20-35 min: Workflow 2 - PR Review

**Demo**: Crear PR con bugs y ver review automático

- Code con bugs intencionales
- Gemini detecta problemas
- Sugiere mejoras y optimizaciones

### ⏰ 35-50 min: Workflow 3 - Assistant Conversacional

**Demo**: Usar `@gemini-cli` para colaboración en tiempo real

- `@gemini-cli fix this bug`
- `@gemini-cli write unit tests`
- `@gemini-cli optimize this code`

### ⏰ 50-60 min: Q&A y Próximos Pasos

## 🛠 Stack Tecnológico

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js + Express
- **AI**: Google Gemini CLI
- **CI/CD**: GitHub Actions

## 📁 Estructura del Proyecto

```
TaskFlow-Manager/
├── .github/workflows/     # Los 3 workflows de Gemini
├── frontend/             # App web simple
├── backend/              # API Node.js
├── tests/               # Unit tests
├── GEMINI.md           # Configuración AI
└── docs/              # Documentación
```

## 🎯 Issues de Demo Preparados

### 🐛 Bug Issues (para demo de triage)

1. "App crashes when adding 10+ tasks"
2. "Delete button doesn't work on mobile"
3. "Tasks disappear after refresh"

### ✨ Feature Issues

1. "Add task filtering by date"
2. "Implement dark mode toggle"
3. "Export tasks to CSV"

### ❓ Question Issues

1. "How to deploy this app?"
2. "What's the recommended browser?"
3. "Can I customize the UI theme?"

## 🔧 PR Demo Scripts

### PR con Bugs Intencionales

```javascript
// Este código tiene bugs que Gemini detectará:
function addTask(title, description) {
  // ❌ No validation
  // ❌ Assignment instead of comparison
  // ❌ No error handling
  if ((title = "")) return;
  tasks.push({ title, description });
}
```

### Comandos @gemini-cli de Demo

```
@gemini-cli fix the assignment bug in line 4
@gemini-cli add input validation to this function
@gemini-cli write unit tests for addTask function
@gemini-cli optimize this code for better performance
@gemini-cli explain what this function does
@gemini-cli suggest error handling improvements
```

## 📊 Métricas de Éxito de la Demo

- ✅ Issues auto-clasificados en <30 segundos
- ✅ PR review completo en <60 segundos
- ✅ Respuestas conversacionales relevantes
- ✅ Bugs detectados automáticamente
- ✅ Sugerencias de mejora útiles

## 🔗 Links Útiles

- [Gemini CLI Documentation](https://github.com/google-gemini/gemini-cli)
- [GitHub Actions con Gemini](https://github.com/google-github-actions/run-gemini-cli)
- [Google AI Studio](https://aistudio.google.com/apikey) - Para obtener API key

## 👥 Para la Audiencia

Al final de la charla, cada participante puede:

1. **Clonar este repositorio**
2. **Seguir la guía de setup**
3. **Experimentar con los workflows**
4. **Adaptar a sus propios proyectos**

---

**🎤 Preparado para charla de 1 hora | 🤖 Powered by Google Gemini AI**
