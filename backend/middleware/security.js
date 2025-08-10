/**
 * Middleware de seguridad para TaskFlow Manager
 * Incluye validación, sanitización y protección básica
 */

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const cors = require("cors");

/**
 * Configuración de CORS
 */
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    "https://dav082004.github.io",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400, // 24 horas
};

/**
 * Configuración de rate limiting
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana de tiempo
  message: {
    error:
      "Demasiadas solicitudes desde esta IP, intenta de nuevo en 15 minutos.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiting específico para crear tareas
 */
const createTaskLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 tareas por minuto
  message: {
    error: "Demasiadas tareas creadas, intenta de nuevo en un minuto.",
    code: "CREATE_TASK_LIMIT_EXCEEDED",
  },
});

/**
 * Middleware de validación de entrada
 */
const validateTaskInput = (req, res, next) => {
  const { title, description, priority, dueDate } = req.body;

  // Validaciones básicas
  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "El título es requerido y debe ser una cadena válida",
    });
  }

  if (title.length > 100) {
    return res.status(400).json({
      success: false,
      error: "El título no puede exceder 100 caracteres",
    });
  }

  if (description && description.length > 500) {
    return res.status(400).json({
      success: false,
      error: "La descripción no puede exceder 500 caracteres",
    });
  }

  if (priority && !["low", "medium", "high", "critical"].includes(priority)) {
    return res.status(400).json({
      success: false,
      error: "La prioridad debe ser: low, medium, high o critical",
    });
  }

  if (dueDate && isNaN(Date.parse(dueDate))) {
    return res.status(400).json({
      success: false,
      error: "La fecha de vencimiento debe ser una fecha válida",
    });
  }

  // Sanitización básica
  req.body.title = title.trim();
  if (description) {
    req.body.description = description.trim();
  }

  next();
};

/**
 * Middleware de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Error de validación de JSON
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "JSON inválido en la solicitud",
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
};

/**
 * Middleware de logging
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  next();
};

/**
 * Middleware de validación de ID
 */
const validateTaskId = (req, res, next) => {
  const { id } = req.params;

  if (!id || typeof id !== "string" || id.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "ID de tarea inválido",
    });
  }

  next();
};

module.exports = {
  corsOptions,
  apiLimiter,
  createTaskLimiter,
  validateTaskInput,
  validateTaskId,
  errorHandler,
  requestLogger,
  helmet,
  cors,
};
