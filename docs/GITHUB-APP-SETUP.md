# 🤖 Configurar GitHub App para Gemini CLI

Para que los comentarios aparezcan como bot `gemini-cli` en lugar de `github-actions`, necesitas configurar un GitHub App.

## 📱 **Pasos para Crear GitHub App**

### 1. **Crear la App**

1. Ve a: https://github.com/settings/apps/new
2. **GitHub App name**: `gemini-cli-bot-[tu-usuario]` (debe ser único)
3. **Homepage URL**: `https://github.com/Dav082004/TallerGeminiCLIActions`
4. **Description**: `Bot de Gemini CLI para clasificación automática`
5. **Webhook**: ❌ **Desactivar** "Active"

### 2. **Configurar Permisos**

En **Repository permissions**:

- ✅ **Issues**: `Write`
- ✅ **Pull requests**: `Write`
- ✅ **Contents**: `Read`
- ✅ **Metadata**: `Read`

### 3. **Después de Crear**

1. **Anotar App ID**: Aparece en la página (ej: 123456)
2. **Generate private key**: Descargar archivo `.pem`
3. **Install App**: Instalar en tu repositorio

### 4. **Configurar Secrets en GitHub**

Ve a tu repositorio → Settings → Secrets and variables → Actions:

#### **Variables (Repository variables)**:

- **Name**: `APP_ID`
- **Value**: Tu App ID (ej: 123456)

#### **Secrets (Repository secrets)**:

- **Name**: `APP_PRIVATE_KEY`
- **Value**: Contenido completo del archivo `.pem` (incluyendo `-----BEGIN RSA PRIVATE KEY-----` y `-----END RSA PRIVATE KEY-----`)

## 🎯 **Resultado**

Después de configurar:

- ✅ Los comentarios aparecerán como **bot personalizado**
- ✅ Tendrás control total sobre el perfil del bot
- ✅ Mayor seguridad y permisos específicos

## 📋 **Para tu Taller**

### **Opción A: Demo Rápida**

- Mantén `github-actions` para tu presentación de 1 hora
- Funciona perfectamente para demostrar las capacidades

### **Opción B: Setup Completo**

- Configura el GitHub App para la versión final
- Ideal para implementación en producción

## 🚀 **Comandos que Funcionan**

```bash
# Issue Triage
@gemini-cli /clasificar

# PR Review
@gemini-cli /revisar

# Asistente General
@gemini-cli ¿Cómo optimizar esta función?
```

## 🔧 **Troubleshooting**

### Error: "Bad credentials"

- Verifica que `APP_PRIVATE_KEY` tenga el contenido completo del `.pem`
- Confirma que `APP_ID` sea correcto

### Error: "Not installed"

- Asegúrate de instalar el App en tu repositorio
- Ve a la página del App → Install App

### Error: "Insufficient permissions"

- Verifica que los permisos estén configurados correctamente
- Issues: Write, Pull requests: Write, Contents: Read
