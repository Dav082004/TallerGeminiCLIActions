/**
 * Servicio de utilidades y funciones auxiliares para TaskFlow Manager
 * Incluye validaciones, formateo y funciones de soporte
 */

/**
 * Validar formato de email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validar que una fecha sea válida y futura
 */
function isValidFutureDate(dateString) {
  if (!dateString) return true; // Las fechas son opcionales

  try {
    const date = new Date(dateString);
    const now = new Date();

    // Verificar que la fecha sea válida
    if (isNaN(date.getTime())) {
      return false;
    }

    // Verificar que la fecha sea futura (opcional para flexibilidad)
    return date >= now.setHours(0, 0, 0, 0);
  } catch (error) {
    return false;
  }
}

/**
 * Validar prioridad de tarea
 */
function isValidPriority(priority) {
  const validPriorities = ["low", "medium", "high", "critical"];
  return validPriorities.includes(priority);
}

/**
 * Validar estado de tarea
 */
function isValidStatus(status) {
  const validStatuses = ["pending", "in-progress", "completed", "cancelled"];
  return validStatuses.includes(status);
}

/**
 * Validar datos de tarea para creación
 */
function validateTaskData(taskData) {
  const errors = [];

  // Validar título (obligatorio)
  if (
    !taskData.title ||
    typeof taskData.title !== "string" ||
    taskData.title.trim().length === 0
  ) {
    errors.push("El título es obligatorio y debe ser un texto válido");
  } else if (taskData.title.length > 200) {
    errors.push("El título no puede exceder 200 caracteres");
  }

  // Validar descripción (opcional)
  if (taskData.description && typeof taskData.description !== "string") {
    errors.push("La descripción debe ser texto");
  } else if (taskData.description && taskData.description.length > 1000) {
    errors.push("La descripción no puede exceder 1000 caracteres");
  }

  // Validar prioridad
  if (taskData.priority && !isValidPriority(taskData.priority)) {
    errors.push("La prioridad debe ser: low, medium, high o critical");
  }

  // Validar estado
  if (taskData.status && !isValidStatus(taskData.status)) {
    errors.push(
      "El estado debe ser: pending, in-progress, completed o cancelled"
    );
  }

  // Validar fecha de vencimiento
  if (taskData.dueDate && !isValidFutureDate(taskData.dueDate)) {
    errors.push("La fecha de vencimiento debe ser una fecha válida");
  }

  // Validar tags
  if (taskData.tags) {
    if (!Array.isArray(taskData.tags)) {
      errors.push("Las etiquetas deben ser una lista");
    } else if (taskData.tags.length > 10) {
      errors.push("No se pueden tener más de 10 etiquetas");
    } else {
      for (const tag of taskData.tags) {
        if (typeof tag !== "string" || tag.length > 50) {
          errors.push("Cada etiqueta debe ser texto de máximo 50 caracteres");
          break;
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
}

/**
 * Limpiar y sanitizar datos de tarea
 */
function sanitizeTaskData(taskData) {
  const sanitized = {};

  // Limpiar título
  if (taskData.title) {
    sanitized.title = taskData.title.trim();
  }

  // Limpiar descripción
  if (taskData.description) {
    sanitized.description = taskData.description.trim();
  }

  // Validar y asignar prioridad
  if (taskData.priority && isValidPriority(taskData.priority)) {
    sanitized.priority = taskData.priority;
  }

  // Validar y asignar estado
  if (taskData.status && isValidStatus(taskData.status)) {
    sanitized.status = taskData.status;
  }

  // Procesar fecha de vencimiento
  if (taskData.dueDate) {
    try {
      const date = new Date(taskData.dueDate);
      if (!isNaN(date.getTime())) {
        sanitized.dueDate = date.toISOString();
      }
    } catch (error) {
      // Ignorar fecha inválida
    }
  }

  // Procesar etiquetas
  if (taskData.tags && Array.isArray(taskData.tags)) {
    sanitized.tags = taskData.tags
      .filter((tag) => typeof tag === "string" && tag.trim().length > 0)
      .map((tag) => tag.trim())
      .slice(0, 10); // Limitar a 10 etiquetas
  }

  return sanitized;
}

/**
 * Formatear fecha para mostrar en español
 */
function formatDateSpanish(dateString) {
  if (!dateString) return "Sin fecha";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Fecha inválida";

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Mexico_City",
    };

    return date.toLocaleDateString("es-ES", options);
  } catch (error) {
    return "Error en fecha";
  }
}

/**
 * Calcular días restantes hasta una fecha
 */
function getDaysUntilDue(dueDate) {
  if (!dueDate) return null;

  try {
    const due = new Date(dueDate);
    const now = new Date();

    // Normalizar a medianoche para comparación de días
    due.setHours(23, 59, 59, 999);
    now.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (error) {
    return null;
  }
}

/**
 * Obtener etiqueta de urgencia para una tarea
 */
function getUrgencyLabel(task) {
  const daysLeft = getDaysUntilDue(task.dueDate);

  if (daysLeft === null) return "sin-fecha";
  if (daysLeft < 0) return "atrasada";
  if (daysLeft === 0) return "hoy";
  if (daysLeft === 1) return "mañana";
  if (daysLeft <= 3) return "urgente";
  if (daysLeft <= 7) return "proxima";
  return "futura";
}

/**
 * Generar color basado en prioridad y urgencia
 */
function getTaskColor(task) {
  const urgency = getUrgencyLabel(task);

  // Colores por urgencia (más importantes que prioridad)
  if (urgency === "atrasada") return "#ff4444";
  if (urgency === "hoy") return "#ff6b35";
  if (urgency === "mañana") return "#ff9500";
  if (urgency === "urgente") return "#ffb800";

  // Colores por prioridad si no hay urgencia especial
  switch (task.priority) {
    case "critical":
      return "#e74c3c";
    case "high":
      return "#f39c12";
    case "medium":
      return "#3498db";
    case "low":
      return "#95a5a6";
    default:
      return "#bdc3c7";
  }
}

/**
 * Generar ID único simple
 */
function generateSimpleId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Escapar caracteres especiales para HTML
 */
function escapeHtml(text) {
  if (typeof text !== "string") return text;

  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Calcular estadísticas avanzadas de productividad
 */
function calculateProductivityStats(tasks) {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const stats = {
    completion: {
      week: 0,
      month: 0,
      total: 0,
    },
    creation: {
      week: 0,
      month: 0,
      total: tasks.length,
    },
    overdue: {
      count: 0,
      percentage: 0,
    },
    averageCompletion: 0,
    trends: {
      productivity: "stable",
      completion: "stable",
    },
  };

  // Calcular completadas por período
  tasks.forEach((task) => {
    const createdDate = new Date(task.createdAt);
    const updatedDate = new Date(task.updatedAt);

    // Tareas creadas
    if (createdDate >= weekAgo) stats.creation.week++;
    if (createdDate >= monthAgo) stats.creation.month++;

    // Tareas completadas
    if (task.status === "completed") {
      stats.completion.total++;
      if (updatedDate >= weekAgo) stats.completion.week++;
      if (updatedDate >= monthAgo) stats.completion.month++;
    }

    // Tareas atrasadas
    if (task.dueDate && task.status !== "completed") {
      const dueDate = new Date(task.dueDate);
      if (dueDate < now) {
        stats.overdue.count++;
      }
    }
  });

  // Calcular porcentajes
  if (tasks.length > 0) {
    stats.overdue.percentage = Math.round(
      (stats.overdue.count / tasks.length) * 100
    );
    stats.averageCompletion = Math.round(
      (stats.completion.total / tasks.length) * 100
    );
  }

  // Determinar tendencias
  const weekProductivity =
    stats.creation.week > 0 ? stats.completion.week / stats.creation.week : 0;
  const monthProductivity =
    stats.creation.month > 0
      ? stats.completion.month / stats.creation.month
      : 0;

  if (weekProductivity > monthProductivity * 1.2) {
    stats.trends.productivity = "mejorando";
  } else if (weekProductivity < monthProductivity * 0.8) {
    stats.trends.productivity = "declinando";
  }

  return stats;
}

/**
 * Exportar todas las funciones
 */
module.exports = {
  // Validaciones
  isValidEmail,
  isValidFutureDate,
  isValidPriority,
  isValidStatus,
  validateTaskData,
  sanitizeTaskData,

  // Formateo y utilidades de fecha
  formatDateSpanish,
  getDaysUntilDue,
  getUrgencyLabel,
  getTaskColor,

  // Utilidades generales
  generateSimpleId,
  escapeHtml,
  calculateProductivityStats,
};
