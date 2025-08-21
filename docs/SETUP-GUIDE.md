# ⚙️ Guía de Configuración - Gemini CLI GitHub Actions

## 🎯 Configuración Inicial (Paso a Paso)

### **🔑 Paso 1: Obtener API Key de Gemini**

#### **Opción A: Google AI Studio (Recomendado para desarrollo)**
1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Get API Key" o "Crear clave API"
4. Copia la clave generada (formato: `AIza...`)

#### **Opción B: Google Cloud Console (Para producción)**
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Gemini
4. Crea credenciales de tipo "API Key"
5. Configura restricciones si es necesario

### **📁 Paso 2: Fork y Configuración del Repositorio**

#### **2.1 Fork del Repositorio**
```bash
# Opción 1: Via web
# Ir a https://github.com/Dav082004/TallerGeminiCLIActions
# Hacer clic en "Fork"

# Opción 2: Via GitHub CLI
gh repo fork Dav082004/TallerGeminiCLIActions --clone
```

#### **2.2 Configurar Secrets**
1. Ve a tu repositorio forkeado
2. Navega a `Settings > Secrets and variables > Actions`
3. Haz clic en "New repository secret"
4. Configura:
   - **Name**: `GEMINI_API_KEY`
   - **Secret**: Tu API key de Gemini

### **🔧 Paso 3: Habilitar GitHub Actions**

#### **3.1 Verificar Actions**
1. Ve a la pestaña "Actions" en tu repositorio
2. Si aparece deshabilitado, haz clic en "Enable GitHub Actions"
3. Confirma la habilitación

#### **3.2 Configurar Permisos**
1. Ve a `Settings > Actions > General`
2. En "Workflow permissions", selecciona:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"

## 🛠️ Configuración Avanzada

### **🔒 Configuración de Seguridad**

#### **Variables de Entorno Adicionales (Opcional)**
```yaml
# En Settings > Secrets and variables > Actions
secrets:
  GEMINI_API_KEY: "tu-api-key-aqui"
  SLACK_WEBHOOK: "webhook-para-notificaciones"  # Opcional
  TEAMS_WEBHOOK: "webhook-para-teams"           # Opcional

variables:
  GEMINI_MODEL: "gemini-1.5-flash"             # Modelo por defecto
  MAX_FILES_REVIEW: "10"                       # Límite de archivos en review
  TIMEOUT_MINUTES: "15"                        # Timeout de workflows
```

#### **Configuración de Permisos Granulares**
```yaml
# En cada workflow, ajustar permisos según necesidades
permissions:
  contents: read
  issues: write
  pull-requests: write
  id-token: write      # Solo si usas OIDC
  statuses: write      # Solo para PR status checks
  actions: read        # Solo si necesitas leer otros workflows
```

### **⚙️ Personalización de Workflows**

#### **Modificar Triggers**
```yaml
# Ejemplo: Solo ejecutar en horarios laborales
on:
  issues:
    types: [opened]
  schedule:
    - cron: '0 9-17 * * 1-5'  # Lunes a viernes, 9-17 UTC
```

#### **Configurar Ambientes**
```yaml
# En Settings > Environments, crear:
environments:
  - name: "production"
    protection_rules:
      - required_reviewers: ["admin-user"]
  - name: "staging"
    protection_rules: []
```

### **📊 Configuración de Monitoreo**

#### **Logging Avanzado**
```yaml
- name: Enhanced Logging
  run: |
    echo "::group::Workflow Information"
    echo "Workflow: ${{ github.workflow }}"
    echo "Event: ${{ github.event_name }}"
    echo "Actor: ${{ github.actor }}"
    echo "Repository: ${{ github.repository }}"
    echo "Ref: ${{ github.ref }}"
    echo "SHA: ${{ github.sha }}"
    echo "::endgroup::"
```

#### **Notificaciones Externas**
```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎨 Personalización de Respuestas

### **🏷️ Configurar Labels Personalizados**

#### **Labels para Issues**
```yaml
# En .github/workflows/gemini-issue-automated-triage.yml
labels:
  priority:
    - "🚨 critical"
    - "🔥 high"
    - "📋 medium"
    - "🕐 low"
  type:
    - "🐛 bug"
    - "✨ feature"
    - "📚 documentation"
    - "🔧 maintenance"
  area:
    - "🎨 frontend"
    - "⚙️ backend"
    - "🗄️ database"
    - "🔒 security"
```

### **💬 Personalizar Prompts**

#### **Prompt de Triage Personalizado**
```yaml
prompt: |
  Eres un experto en [TU_TECNOLOGIA] y gestión de proyectos.
  
  Contexto del proyecto:
  - Tecnología principal: [TU_STACK]
  - Equipo: [TAMAÑO_EQUIPO] desarrolladores
  - Metodología: [SCRUM/KANBAN/OTROS]
  
  Analiza el siguiente issue y proporciona:
  1. Categoría ([TUS_CATEGORIAS])
  2. Prioridad (crítica/alta/media/baja)
  3. Estimación de tiempo ([TUS_ESTIMACIONES])
  4. Equipo sugerido ([TUS_EQUIPOS])
  5. Labels recomendados
```

### **🔧 Configuración por Tipo de Proyecto**

#### **Proyecto Frontend (React/Vue/Angular)**
```yaml
# Configuración específica para frontend
environment:
  FOCUS_AREAS: "UI/UX, Performance, Accessibility, SEO"
  REVIEW_CHECKLIST: "Component structure, State management, Bundle size"
  COMMON_ISSUES: "React hooks, CSS optimization, Mobile responsiveness"
```

#### **Proyecto Backend (Node.js/Python/Java)**
```yaml
# Configuración específica para backend
environment:
  FOCUS_AREAS: "Security, Performance, Scalability, API Design"
  REVIEW_CHECKLIST: "Error handling, Database queries, Authentication"
  COMMON_ISSUES: "SQL injection, Memory leaks, Rate limiting"
```

#### **Proyecto Full-Stack**
```yaml
# Configuración para proyectos completos
environment:
  FOCUS_AREAS: "Integration, Security, Performance, Architecture"
  REVIEW_CHECKLIST: "API contracts, Data flow, Error propagation"
  COMMON_ISSUES: "CORS, State sync, Performance bottlenecks"
```

## 🔄 Configuración de Integración Continua

### **🧪 Testing Integration**
```yaml
# Agregar tests antes de review
- name: Run Tests
  run: |
    npm test
    npm run lint
    npm run type-check

- name: Review with Test Results
  if: success()
  uses: google-github-actions/run-gemini-cli@v0.1.10
  with:
    prompt: |
      Revisa este código considerando que todos los tests pasaron:
      [TEST_RESULTS]
      [CODE_DIFF]
```

### **📈 Métricas y Analytics**
```yaml
# Configurar métricas personalizadas
- name: Track Metrics
  run: |
    echo "::set-output name=issues_triaged::$(git log --oneline --grep='Triage:' | wc -l)"
    echo "::set-output name=prs_reviewed::$(git log --oneline --grep='Review:' | wc -l)"
```

## 🚀 Configuración de Producción

### **⚡ Optimización de Performance**

#### **Configuración de Caché**
```yaml
- name: Cache Dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

#### **Configuración de Concurrencia**
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### **🛡️ Configuración de Seguridad**

#### **Verificación de Secretos**
```yaml
- name: Verify Secrets
  run: |
    if [ -z "${{ secrets.GEMINI_API_KEY }}" ]; then
      echo "❌ GEMINI_API_KEY not configured"
      exit 1
    fi
    echo "✅ Secrets configured correctly"
```

#### **Sanitización de Entrada**
```yaml
- name: Sanitize Input
  run: |
    # Remover caracteres peligrosos de comentarios
    CLEAN_COMMENT=$(echo "${{ github.event.comment.body }}" | sed 's/[<>&]//g')
    echo "CLEAN_COMMENT=$CLEAN_COMMENT" >> $GITHUB_ENV
```

## 📋 Checklist de Configuración

### **✅ Configuración Básica**
- [ ] API Key de Gemini configurada
- [ ] Repository forkeado
- [ ] GitHub Actions habilitado
- [ ] Permisos configurados correctamente
- [ ] Workflows ejecutándose sin errores

### **✅ Configuración Avanzada**
- [ ] Labels personalizados creados
- [ ] Prompts adaptados al proyecto
- [ ] Notificaciones configuradas
- [ ] Métricas implementadas
- [ ] Seguridad validada

### **✅ Testing**
- [ ] Triage funciona en issues
- [ ] Review funciona en PRs
- [ ] Assistant responde correctamente
- [ ] Comandos cruzados funcionan
- [ ] Performance es aceptable

## 🆘 Solución de Problemas Comunes

### **❌ "API Key Invalid"**
```bash
# Verificar formato de API key
echo $GEMINI_API_KEY | grep -E '^AIza[A-Za-z0-9_-]{35}$'

# Regenerar si es necesario
# Ir a Google AI Studio > API Keys > Regenerate
```

### **❌ "Workflow Not Triggering"**
```yaml
# Verificar sintaxis YAML
yamllint .github/workflows/*.yml

# Verificar permisos
# Settings > Actions > General > Workflow permissions
```

### **❌ "Permission Denied"**
```yaml
# Verificar permisos en workflow
permissions:
  contents: read
  issues: write        # Necesario para comentar en issues
  pull-requests: write # Necesario para comentar en PRs
```

---

🔧 **Próximo paso**: Una vez configurado, consulta la [Guía de Demos](./DEMOS-WORKFLOWS.md) para probar los workflows.
