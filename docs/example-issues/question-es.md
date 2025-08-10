# ❓ Pregunta Técnica - Ejemplo para Demo

**Título del Issue:** ¿Cómo implementar notificaciones push para recordatorios de tareas?

## **Contexto**

Estoy trabajando en una mejora para TaskFlow Manager donde los usuarios puedan recibir notificaciones push del navegador cuando se acerque la fecha de vencimiento de sus tareas. Tengo algunas dudas sobre la mejor implementación.

## **Pregunta Principal**

¿Cuál sería la mejor estrategia para implementar notificaciones push en una aplicación web vanilla JavaScript como TaskFlow Manager?

## **Escenario Específico**

### **Funcionalidad Deseada**

- Notificar al usuario 1 hora antes del vencimiento de una tarea
- Notificar cuando una tarea se vence
- Permitir al usuario configurar horarios de "no molestar"
- Funcionar incluso cuando la pestaña no está activa

### **Arquitectura Actual**

- **Frontend**: Vanilla JavaScript con localStorage
- **Backend**: Node.js + Express (API REST)
- **Persistencia**: JSON files (para el demo)
- **Hosting**: GitHub Pages (frontend) + Heroku (backend)

## **Opciones que Estoy Considerando**

### **Opción 1: Web Push API + Service Worker**

```javascript
// Registro del service worker
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker.register("/sw.js").then((registration) => {
    console.log("SW registered: ", registration);
  });
}

// Solicitar permisos
function requestNotificationPermission() {
  return Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      subscribeUserToPush();
    }
  });
}
```

**Pros:**

- Funciona incluso con la pestaña cerrada
- Soporte nativo del navegador
- No requiere servicios externos

**Contras:**

- Curva de aprendizaje empinada
- Configuración compleja del service worker
- Requiere HTTPS en producción

### **Opción 2: Web Notifications API + setInterval**

```javascript
function scheduleNotification(task) {
  const now = new Date();
  const dueDate = new Date(task.dueDate);
  const oneHourBefore = new Date(dueDate.getTime() - 60 * 60 * 1000);

  if (oneHourBefore > now) {
    const timeout = oneHourBefore.getTime() - now.getTime();
    setTimeout(() => {
      new Notification("Recordatorio de Tarea", {
        body: `La tarea "${task.title}" vence en 1 hora`,
        icon: "/assets/task-icon.png",
      });
    }, timeout);
  }
}
```

**Pros:**

- Implementación más simple
- Mejor control del timing
- Fácil debugging

**Contras:**

- Solo funciona mientras la pestaña esté abierta
- Se pierde al recargar la página
- No es escalable para múltiples tareas

### **Opción 3: Servicio Externo (Firebase Cloud Messaging)**

```javascript
import { getMessaging, getToken } from "firebase/messaging";

const messaging = getMessaging();
getToken(messaging, { vapidKey: "VAPID_KEY" }).then((currentToken) => {
  if (currentToken) {
    console.log("Registration token available.");
    sendTokenToServer(currentToken);
  }
});
```

**Pros:**

- Muy confiable y escalable
- Soporte multiplataforma
- Analytics y métricas incluidas

**Contras:**

- Dependencia externa
- Costos potenciales
- Complejidad adicional

## **Preguntas Específicas**

1. **¿Cuál de estas opciones recomendarían para un proyecto demo como TaskFlow Manager?**

2. **¿Cómo manejar las zonas horarias** cuando los usuarios están en diferentes ubicaciones?

3. **¿Qué estrategia usar para las notificaciones recurrentes** (por ejemplo, tareas que se repiten semanalmente)?

4. **¿Cómo implementar el "snooze"** para que los usuarios puedan posponer notificaciones?

5. **¿Existe alguna biblioteca/framework** que simplifique esta implementación?

## **Constraints del Proyecto**

- **Simplicidad**: Debe ser fácil de entender para propósitos de demo
- **Navegadores**: Soporte para Chrome 90+, Firefox 88+, Safari 14+
- **Performance**: No debe impactar la velocidad de la aplicación
- **UX**: Debe respetar las preferencias del usuario sobre notificaciones

## **Research Realizado**

He revisado la documentación de:

- [MDN Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [Google Web Push Protocol](https://web.dev/push-notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging/js/client)

También he visto estos ejemplos:

- [Web Push Codelab](https://web.dev/push-notifications-web-push-protocol/)
- [ServiceWorker Cookbook](https://serviceworke.rs/push-payload.html)

## **Código de Ejemplo Actual**

Actualmente tengo esta estructura básica:

```javascript
// taskManager.js
class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
    this.initializeNotifications();
  }

  initializeNotifications() {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        this.requestNotificationPermission();
      }
    }
  }

  requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notifications enabled");
        this.scheduleExistingTaskNotifications();
      }
    });
  }

  // ¿Cómo implementar esta función eficientemente?
  scheduleExistingTaskNotifications() {
    // TODO: Implementar lógica de scheduling
  }
}
```

## **Entorno de Testing**

- **Local Development**: `localhost:3000`
- **Staging**: Netlify deploy preview
- **Production**: GitHub Pages + Heroku

## **Timeline**

Me gustaría tener una implementación básica funcionando en las próximas 2 semanas para incluirla en una demo/presentación.

## **Agradecimiento**

Cualquier orientación, ejemplos de código, o recursos adicionales serían muy apreciados. ¡Gracias por su tiempo!

---

**Tags relacionados**: `notifications`, `web-api`, `service-worker`, `javascript`, `ux`, `browser-apis`

**Nivel de urgencia**: Media - No es crítico pero agregaría mucho valor al demo

**Audiencia**: Desarrolladores frontend con experiencia en JavaScript vanilla y APIs del navegador

---

**Nota para la demo**: Esta pregunta técnica está diseñada para demostrar cómo Gemini CLI puede proporcionar asistencia contextual detallada sobre decisiones de arquitectura y implementación técnica específica del proyecto.
