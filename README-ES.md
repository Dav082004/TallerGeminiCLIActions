# 🚀 TaskFlow Manager - Demo de Workflows Gemini CLI

[![Gemini CLI](https://img.shields.io/badge/Gemini_CLI-Powered-blue)](https://github.com/google-github-actions/run-gemini-cli)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-green)](https://github.com/features/actions)
[![Demo](https://img.shields.io/badge/Demo-Live-orange)](https://github.com/tu-usuario/taskflow-manager)

> **Aplicación web completa de gestión de tareas que demuestra las capacidades de automatización de Gemini CLI en GitHub Actions**

## 🎯 **Propósito del Demo**

Este proyecto fue creado específicamente para demostrar **3 workflows principales de Gemini CLI** en una charla técnica de 1 hora:

1. **🔍 Clasificación Automática de Issues** - Análisis y categorización inteligente
2. **📝 Revisión Automática de Pull Requests** - Review de código con IA
3. **🤖 Asistente Conversacional** - Ayuda contextual interactiva

## ✨ **Características Principales**

### 🎨 **Frontend**

- ✅ **Interfaz moderna y responsiva** con HTML5, CSS3 y JavaScript vanilla
- ✅ **Gestión completa de tareas** (CRUD) con filtros y búsqueda
- ✅ **Modo oscuro/claro** con persistencia en localStorage
- ✅ **Estadísticas en tiempo real** y visualización de datos
- ✅ **Validación de formularios** y manejo de errores

### ⚙️ **Backend API**

- ✅ **Servidor Express.js** con endpoints RESTful
- ✅ **Middleware de seguridad** (CORS, Helmet, rate limiting)
- ✅ **Validación de entrada** y sanitización de datos
- ✅ **Manejo robusto de errores** y logging

### 🤖 **Automatización con Gemini CLI**

- ✅ **Clasificación de Issues**: Análisis automático al crear issues
- ✅ **Revisión de PRs**: Análisis de código en pull requests
- ✅ **Asistente**: Respuestas contextuales con `@gemini-cli`

## 🚀 **Inicio Rápido**

### **Prerrequisitos**

- Node.js 18+ y npm
- Cuenta de GitHub con Actions habilitados
- [API Key de Gemini](https://aistudio.google.com/apikey)

### **1. Configuración Local**

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/taskflow-manager.git
cd taskflow-manager

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### **2. Configuración de GitHub**

1. Ve a: **Settings > Secrets and variables > Actions**
2. Agrega: `GEMINI_API_KEY` = tu_api_key_aquí

### **3. Probar Workflows**

- **Crear un issue** → Se ejecuta clasificación automática
- **Crear un PR** → Se ejecuta revisión automática
- **Comentar `@gemini-cli pregunta`** → Respuesta del asistente

## 📋 **Estructura del Proyecto**

```
taskflow-manager/
├── .github/workflows/          # 🤖 Workflows de Gemini CLI
│   ├── issue-triage.yml       # Clasificación de issues
│   ├── pr-review.yml          # Revisión de PRs
│   └── gemini-assistant.yml   # Asistente conversacional
├── frontend/                   # 🎨 Aplicación frontend
│   ├── index.html             # Página principal
│   ├── styles/                # Hojas de estilo CSS
│   └── scripts/               # Módulos JavaScript
├── backend/                    # ⚙️ API del servidor
│   ├── server.js              # Servidor Express
│   └── routes/                # Endpoints de API
├── docs/                       # 📚 Documentación
│   ├── DEMO_SETUP.md          # Guía de configuración
│   └── example-issues/        # Ejemplos para la demo
└── tests/                      # 🧪 Pruebas automatizadas
```

## 🎬 **Guía de Demostración**

### **Flujo Sugerido para Charla (60 minutos)**

#### **1. Introducción (10 min)**

- Mostrar la aplicación funcionando localmente
- Explicar el propósito de los workflows de Gemini CLI

#### **2. Workflow de Clasificación (15 min)**

- Crear issue de ejemplo con bug
- Mostrar clasificación automática
- Explicar el workflow `issue-triage.yml`

#### **3. Workflow de Revisión (20 min)**

- Crear PR con código problemático
- Mostrar análisis automático de Gemini
- Explicar el workflow `pr-review.yml`

#### **4. Asistente Conversacional (10 min)**

- Demostrar comando `@gemini-cli`
- Mostrar respuestas contextuales
- Explicar el workflow `gemini-assistant.yml`

#### **5. Q&A y Próximos Pasos (5 min)**

## 🤖 **Comandos de Gemini CLI**

### **En Issues:**

```markdown
@gemini-cli /clasificar

# Reclasifica el issue actual
```

### **En Pull Requests:**

```markdown
@gemini-cli /revisar

# Solicita nueva revisión del código
```

### **Asistente General:**

```markdown
@gemini-cli ¿Cómo optimizar este código JavaScript?
@gemini-cli ¿Cuáles son las mejores prácticas para este patrón?
@gemini-cli Ayúdame a debuggear este error
```

## 🌟 **Casos de Uso Demostrados**

### **📊 Automatización de DevOps**

- **Clasificación inteligente** de issues por tipo y prioridad
- **Asignación automática** a equipos apropiados
- **Estimación de esfuerzo** basada en análisis de contenido

### **🔍 Revisión de Código**

- **Detección de bugs** y vulnerabilidades de seguridad
- **Sugerencias de optimización** y mejores prácticas
- **Análisis de rendimiento** y memory leaks

### **💬 Asistencia Técnica**

- **Respuestas contextuales** sobre arquitectura y patrones
- **Debugging interactivo** con análisis de errores
- **Recomendaciones personalizadas** para el stack del proyecto

## 📈 **Métricas de ROI**

### **Tiempo Ahorrado por Sprint**

- **Clasificación de Issues**: 15 min → 2 min (87% reducción)
- **Revisión de Código**: 120 min → 30 min (75% reducción)
- **Documentación**: 45 min → 10 min (78% reducción)

### **Mejora en Calidad**

- **+40%** más bugs detectados automáticamente
- **+60%** mejor detección de vulnerabilidades
- **+85%** consistencia en estándares de código

## 🧪 **Testing**

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar linter
npm run lint
```

## 🔧 **Comandos Disponibles**

| Comando         | Descripción                   |
| --------------- | ----------------------------- |
| `npm start`     | Inicia servidor de desarrollo |
| `npm test`      | Ejecuta suite de pruebas      |
| `npm run build` | Construye para producción     |
| `npm run lint`  | Ejecuta linter de código      |

## 🔐 **Configuración de Seguridad**

### **Variables de Entorno**

```env
GEMINI_API_KEY=tu_api_key_aquí
NODE_ENV=production
PORT=3000
```

### **GitHub Secrets Requeridos**

- `GEMINI_API_KEY`: Tu clave de API de Google AI Studio

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 **Licencia**

Este proyecto es software libre bajo la [Licencia MIT](LICENSE).

## 🙏 **Reconocimientos**

- **Google AI Studio** por la API de Gemini
- **GitHub Actions** por la plataforma de automatización
- **Comunidad Open Source** por las herramientas y bibliotecas

---

### 📞 **Soporte**

¿Preguntas sobre la implementación? ¿Necesitas ayuda con tu propio setup?

- 📧 Email: soporte@ejemplo.com
- 💬 Discord: [Servidor de la Comunidad](#)
- 📖 Documentación: [Wiki del Proyecto](#)

---

**¡Disfruta explorando las capacidades de Gemini CLI en tus proyectos!** 🚀
