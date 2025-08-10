# 🤖 Workflows de Gemini CLI

Este repositorio implementa tres workflows simplificados basados en los ejemplos oficiales de [google-github-actions/run-gemini-cli](https://github.com/google-github-actions/run-gemini-cli).

## 📋 Workflows Disponibles

### 1. **Issue Triage** (`issue-triage.yml`)

- **Trigger**: Issues nuevos o modificados
- **Comando**: `@gemini-cli /clasificar`
- **Función**: Clasifica automáticamente issues con etiquetas apropiadas
- **Características**:
  - Análisis de contenido del issue
  - Asignación automática de labels
  - Determinación de prioridad
  - Respuestas en español

### 2. **PR Review** (`pr-review.yml`)

- **Trigger**: Pull Requests nuevos o actualizados
- **Comando**: `@gemini-cli /revisar`
- **Función**: Revisión automática de código con IA
- **Características**:
  - Análisis de seguridad
  - Evaluación de rendimiento
  - Sugerencias de mejora
  - Feedback constructivo en español

### 3. **Asistente General** (`gemini-assistant.yml`)

- **Trigger**: Menciones de `@gemini-cli` sin comandos específicos
- **Función**: Asistente de desarrollo general
- **Características**:
  - Ayuda con problemas técnicos
  - Explicaciones de código
  - Recomendaciones de mejores prácticas
  - Respuestas contextuales en español

## 🚀 Uso Rápido

### Clasificar un Issue

```
@gemini-cli /clasificar

Este issue parece ser sobre un bug en la función de login...
```

### Revisar un Pull Request

```
@gemini-cli /revisar

Por favor revisa este PR que añade autenticación OAuth...
```

### Consulta General

```
@gemini-cli ¿Cuál es la mejor manera de manejar errores en JavaScript?
```

## ⚙️ Configuración

### Prerrequisitos

1. **Secret requerido**: `GEMINI_API_KEY`
   - Obtén tu API key de [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Añádela en Settings → Secrets → Actions

### Permisos

Los workflows necesitan estos permisos:

- `contents: read`
- `issues: write`
- `pull-requests: write`

## 📁 Estructura de Archivos

```
.github/
└── workflows/
    ├── issue-triage.yml      # Clasificación de issues
    ├── pr-review.yml         # Revisión de PRs
    └── gemini-assistant.yml  # Asistente general
```

## 🛠️ Personalización

### Modificar Prompts

Cada workflow tiene prompts específicos en español que puedes personalizar:

1. **Issue Triage**: Modifica las categorías y etiquetas
2. **PR Review**: Ajusta los criterios de revisión
3. **Asistente**: Cambia el comportamiento y especialización

### Triggers Adicionales

Puedes añadir más triggers según tus necesidades:

- `schedule`: Para ejecuciones periódicas
- `workflow_dispatch`: Para ejecución manual
- Eventos específicos de GitHub

## 📚 Ejemplos de Uso

### Ejemplo 1: Issue de Bug

```
**Issue**: "La aplicación se cuelga al cargar datos"
**Comando**: @gemini-cli /clasificar
**Resultado**: Labels automáticos: `bug`, `priority-high`, `needs-investigation`
```

### Ejemplo 2: PR de Feature

```
**PR**: "Añadir sistema de notificaciones"
**Comando**: @gemini-cli /revisar
**Resultado**: Revisión detallada con sugerencias de seguridad y rendimiento
```

### Ejemplo 3: Consulta Técnica

```
**Pregunta**: @gemini-cli ¿Cómo optimizar consultas SQL en este proyecto?
**Resultado**: Recomendaciones específicas con ejemplos de código
```

## 🎯 Beneficios

- ✅ **Automatización**: Reduce trabajo manual en triage y reviews
- ✅ **Consistencia**: Aplicación uniforme de estándares
- ✅ **Eficiencia**: Respuestas rápidas 24/7
- ✅ **Aprendizaje**: Mejores prácticas sugeridas automáticamente
- ✅ **Español**: Completamente localizado

## 🔧 Solución de Problemas

### Error: "Gemini API Key not found"

- Verifica que `GEMINI_API_KEY` esté configurado en los secrets
- Confirma que la API key sea válida

### Workflow no se ejecuta

- Revisa que los triggers estén correctamente configurados
- Verifica los permisos del repositorio
- Confirma que el formato del comando sea exacto

### Respuestas en inglés

- Los prompts están configurados para responder en español
- Si obtienes respuestas en inglés, verifica la configuración del prompt

## 📖 Referencias

- [Documentación oficial de Gemini CLI](https://github.com/google-github-actions/run-gemini-cli)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Google AI Studio](https://aistudio.google.com/)
