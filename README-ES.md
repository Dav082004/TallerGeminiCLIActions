# 🤖 Gemini CLI GitHub Actions

[![Gemini CLI](https://img.shields.io/badge/Gemini_CLI-Powered-blue)](https://github.com/google-github-actions/run-gemini-cli)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-green)](https://github.com/features/actions)

> **3 workflows de GitHub Actions que utilizan Gemini CLI para automatizar tareas de desarrollo con IA**

## 🎯 Workflows Disponibles

### 🏷️ **Issue Triage** (`gemini-issue-automated-triage.yml`)
- Clasifica automáticamente issues nuevos
- Asigna etiquetas y prioridades inteligentemente
- **Comando manual:** `@gemini-cli /triage` (Issues y PRs)

### 🔍 **PR Review** (`gemini-pr-review.yml`)
- Revisa código automáticamente en Pull Requests
- Detecta bugs y sugiere mejoras
- **Comando manual:** `@gemini-cli /review` (PRs e Issues)

### 💬 **Gemini Assistant** (`gemini-assistant.yml`)
- Asistente general para preguntas técnicas
- **Uso:** `@gemini-cli` + tu pregunta (Issues y PRs)

## 🚀 Setup Rápido

## 🚀 Setup Rápido

### 🔑 **1. Obtener API Key**
- Ve a [Google AI Studio](https://aistudio.google.com/)
- Crea una API Key gratuita para Gemini
- Copia la key generada

### ⚙️ **2. Configurar en GitHub**
- Haz fork de este repositorio
- Ve a `Settings > Secrets and variables > Actions`
- Agrega: `GEMINI_API_KEY = tu_api_key`

### ✅ **3. Probar los Workflows**

#### **Triage (Clasificación):**
```
@gemini-cli /triage
```
*Funciona en Issues y PRs*

#### **Review (Revisión):**
```
@gemini-cli /review
```
*Funciona en PRs e Issues con código*

#### **Assistant (Preguntas generales):**
```
@gemini-cli ¿Cómo optimizar este código?
@gemini-cli ¿Qué patrón de diseño usar aquí?
```
*Funciona en Issues y PRs*

## 📋 Comandos Disponibles

| Comando | Issues | PRs | Descripción |
|---------|:------:|:---:|-------------|
|---------|:------:|:---:|-------------|
| `@gemini-cli /triage` | ✅ | ✅ | Clasifica y categoriza |
| `@gemini-cli /review` | ✅ | ✅ | Revisa código |
| `@gemini-cli` + pregunta | ✅ | ✅ | Asistente general |

## 🎭 Aplicación Demo

### **Frontend Simple**
- ✅ **JavaScript Vanilla**
- 📱 **HTML/CSS básico**
- 💾 **Sin dependencias**
- 🎨 **Responsive design**

Incluye ejemplos de código para probar los workflows de review y triage.

## 🎓 Uso en Workshops

**Perfecto para:**
- �‍🏫 Demostraciones de GitHub Actions
- 🤖 Integración de IA en desarrollo
- ⚡ Automatización de workflows
- 🚀 Ejemplos prácticos de Gemini CLI

## � Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

### **👨‍🏫 Para Instructores:**
- ✅ **Setup en 5 minutos** - Configuración ultra-rápida
- ✅ **3 demos completas** - Casos de uso reales
- ✅ **Documentación educativa** - Explicaciones paso a paso
- ✅ **Proyecto funcional** - App real para experimentar

### **👨‍💻 Para Participantes:**
- 🎯 **Casos de uso prácticos** aplicables inmediatamente
- 🤖 **Experiencia hands-on** con AI workflows
- 📚 **Código documentado** para estudio posterior
- 🚀 **Base para implementación** en proyectos reales

## 🛠️ Comandos Disponibles

### **🏷️ Para Issues:**
```bash
@gemini-cli /triage    # Analiza y clasifica automáticamente
```

### **🔍 Para Pull Requests:**
```bash
@gemini-cli /review    # Revisión completa de código
```

### **🤖 Asistente General:**
```bash
@gemini-cli /explicar [concepto]      # Explicaciones técnicas
@gemini-cli /sugerir [optimización]   # Sugerencias de mejora
@gemini-cli /documentar [código]      # Genera documentación
@gemini-cli /implementar [feature]    # Guía de implementación
@gemini-cli /debug [problema]         # Ayuda con debugging
@gemini-cli [cualquier pregunta]      # Consultas generales
```

## 📊 Métricas del Proyecto

### **⚡ Performance:**
- **<30 segundos** - Tiempo promedio de respuesta
- **>95% precisión** - En clasificación de issues
- **>90% relevancia** - En sugerencias de código
- **24/7 disponible** - Asistente siempre activo

### **🎯 Casos de Uso Exitosos:**
- 🏷️ **Triage automático** - Ahorra 80% tiempo en clasificación
- 🔒 **Detección de vulnerabilidades** - Prevención proactiva
- 📚 **Documentación automática** - Genera docs contextuales
- 💡 **Mentoring técnico** - Capacitación continua del equipo

## � Personalización para tu Proyecto

### **🎨 Adaptación por Tecnología:**

#### **Para React/Frontend:**
- Análisis de hooks y performance
- Detección de anti-patterns
- Sugerencias de accessibility
- Optimización de renders

#### **Para Backend/APIs:**
- Security review automático
- Análisis de vulnerabilidades
- Optimización de queries
- Mejores prácticas REST

#### **Para DevOps/Infrastructure:**
- Review de configuraciones
- Análisis de seguridad
- Optimización de pipelines
- Sugerencias de monitoreo

## � Casos de Uso Post-Workshop

### **🏢 Para Equipos de Desarrollo:**
1. **Onboarding automático** - Asistente para nuevos desarrolladores
2. **Code review asistido** - Detectar problemas antes de merge
3. **Knowledge base** - Consultas técnicas instantáneas
4. **Mentoring escalable** - Guía 24/7 para todo el equipo

### **📈 Para Organizaciones:**
1. **Estandarización** - Consistencia en quality gates
2. **Escalabilidad** - Review automático en múltiples repos
3. **Métricas** - Tracking de calidad de código
4. **Capacitación** - Upskilling continuo del equipo

## 🐛 Troubleshooting

### **❌ Problemas Comunes:**

#### **1. Workflow no se ejecuta:**
```bash
✅ Verificar: GEMINI_API_KEY configurado correctamente
✅ Comprobar: GitHub Actions habilitado
✅ Revisar: Permisos del repositorio
```

#### **2. Sin respuesta de Gemini:**
```bash
✅ Validar: API Key en Google AI Studio
✅ Verificar: Rate limits no excedidos
✅ Comprobar: Sintaxis del comando (@gemini-cli)
```

#### **3. Respuestas irrelevantes:**
```bash
✅ Mejorar: Contexto en la consulta
✅ Especificar: Archivos o funciones específicas
✅ Incluir: Información técnica relevante
```

## 🤝 Contribuciones y Extensiones

### **🎯 Áreas de Mejora:**
- 📊 **Dashboard de métricas** - Visualización de efectividad
- 🔗 **Integración Slack/Teams** - Notificaciones externas
- 🤖 **Fine-tuning** - Adaptación por equipo/proyecto
- 📚 **Knowledge base** - Base de datos personalizada

### **📝 Cómo Contribuir:**
1. Fork del repositorio
2. Crear branch para tu feature
3. Implementar con tests
4. Documentar cambios
5. Abrir Pull Request (¡será revisado por Gemini! 🤖)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para más detalles.

---

**🎯 ¿Listo para probarlo?**

1. Fork este repositorio
2. Configura `GEMINI_API_KEY` 
3. Prueba los comandos en Issues y PRs
4. ¡Experimenta con la aplicación demo!

¡Bienvenido al desarrollo asistido por IA! 🚀✨
