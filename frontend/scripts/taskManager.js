/**
 * TaskFlow Manager - Gestión de Tareas
 * Funcionalidad completa CRUD con operaciones de localStorage
 */

class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentFilter = {
      status: "all",
      priority: "all",
      search: "",
    };
    this.currentSort = "dueDate";
    this.loadTasks();
  }

  /**
   * Cargar tareas desde localStorage
   */
  loadTasks() {
    try {
      const stored = localStorage.getItem("taskflow_tasks");
      if (stored) {
        this.tasks = JSON.parse(stored);
      } else {
        this.tasks = this.getDefaultTasks();
        this.saveTasks();
      }
    } catch (error) {
      console.error("Error cargando tareas:", error);
      this.tasks = this.getDefaultTasks();
    }
  }

  /**
   * Guardar tareas en localStorage
   */
  saveTasks() {
    try {
      localStorage.setItem("taskflow_tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error guardando tareas:", error);
    }
  }

  /**
   * Obtener tareas por defecto para demo
   */
  getDefaultTasks() {
    return [
      {
        id: this.generateId(),
        title: "Configurar workflow de Gemini CLI",
        description: "Configurar los 3 workflows principales para la demo",
        priority: "high",
        status: "completed",
        dueDate: "2025-08-08",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: this.generateId(),
        title: "Preparar ejemplos de issues",
        description:
          "Crear issues de ejemplo para demostrar clasificación automática",
        priority: "medium",
        status: "completed",
        dueDate: "2025-08-09",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: this.generateId(),
        title: "Practicar charla técnica",
        description:
          "Ensayar presentación de 1 hora sobre Gemini CLI workflows",
        priority: "high",
        status: "pending",
        dueDate: "2025-08-12",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Agregar nueva tarea
   */
  addTask(taskData) {
    try {
      const validation = this.validateTask(taskData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        };
      }

      const task = {
        id: this.generateId(),
        title: this.sanitizeInput(taskData.title),
        description: this.sanitizeInput(taskData.description || ""),
        priority: taskData.priority || "medium",
        status: "pending",
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.tasks.push(task);
      this.saveTasks();

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      console.error("Error agregando tarea:", error);
      return {
        success: false,
        error: "Error interno al agregar tarea",
      };
    }
  }

  /**
   * Actualizar tarea existente
   */
  updateTask(taskId, updates) {
    try {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) {
        return {
          success: false,
          error: "Tarea no encontrada",
        };
      }

      if (updates.title !== undefined) {
        const validation = this.validateTask({ title: updates.title });
        if (!validation.isValid) {
          return {
            success: false,
            error: validation.errors.join(", "),
          };
        }
      }

      const task = this.tasks[taskIndex];
      Object.keys(updates).forEach((key) => {
        if (key !== "id" && key !== "createdAt") {
          if (typeof updates[key] === "string") {
            task[key] = this.sanitizeInput(updates[key]);
          } else {
            task[key] = updates[key];
          }
        }
      });

      task.updatedAt = new Date().toISOString();
      this.saveTasks();

      return {
        success: true,
        data: task,
      };
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      return {
        success: false,
        error: "Error interno al actualizar tarea",
      };
    }
  }

  /**
   * Eliminar tarea
   */
  deleteTask(taskId) {
    try {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);

      if (taskIndex === -1) {
        return {
          success: false,
          error: "Tarea no encontrada",
        };
      }

      const deletedTask = this.tasks.splice(taskIndex, 1)[0];
      this.saveTasks();

      return {
        success: true,
        data: deletedTask,
      };
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      return {
        success: false,
        error: "Error interno al eliminar tarea",
      };
    }
  }

  /**
   * Cambiar estado de completado
   */
  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      return {
        success: false,
        error: "Tarea no encontrada",
      };
    }

    const newStatus = task.status === "completed" ? "pending" : "completed";
    return this.updateTask(taskId, { status: newStatus });
  }

  /**
   * Obtener tarea por ID
   */
  getTask(taskId) {
    return this.tasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Obtener todas las tareas
   */
  getAllTasks() {
    return [...this.tasks];
  }

  /**
   * Obtener tareas filtradas
   */
  getFilteredTasks() {
    let filtered = [...this.tasks];

    if (this.currentFilter.status !== "all") {
      filtered = filtered.filter(
        (task) => task.status === this.currentFilter.status
      );
    }

    if (this.currentFilter.priority !== "all") {
      filtered = filtered.filter(
        (task) => task.priority === this.currentFilter.priority
      );
    }

    if (this.currentFilter.search) {
      const searchLower = this.currentFilter.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          (task.description &&
            task.description.toLowerCase().includes(searchLower))
      );
    }

    return this.sortTasks(filtered, this.currentSort);
  }

  /**
   * Ordenar tareas
   */
  sortTasks(tasks, sortBy) {
    return tasks.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "dueDate":
        default:
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });
  }

  /**
   * Establecer filtros
   */
  setFilter(filters) {
    this.currentFilter = { ...this.currentFilter, ...filters };
  }

  /**
   * Establecer ordenamiento
   */
  setSort(sortBy) {
    this.currentSort = sortBy;
  }

  /**
   * Limpiar filtros
   */
  clearFilters() {
    this.currentFilter = {
      status: "all",
      priority: "all",
      search: "",
    };
  }

  /**
   * Obtener estadísticas
   */
  getStatistics() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((t) => t.status === "completed").length;
    const pending = this.tasks.filter((t) => t.status === "pending").length;

    const now = new Date();
    const overdue = this.tasks.filter(
      (t) => t.status === "pending" && t.dueDate && new Date(t.dueDate) < now
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }

  /**
   * Obtener tareas por prioridad
   */
  getTasksByPriority() {
    return {
      critical: this.tasks.filter((t) => t.priority === "critical"),
      high: this.tasks.filter((t) => t.priority === "high"),
      medium: this.tasks.filter((t) => t.priority === "medium"),
      low: this.tasks.filter((t) => t.priority === "low"),
    };
  }

  /**
   * Generar ID único
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Limpiar entrada de texto
   */
  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.replace(/[<>]/g, "").trim();
  }

  /**
   * Validar datos de tarea
   */
  validateTask(taskData) {
    const errors = [];

    if (!taskData.title || taskData.title.trim() === "") {
      errors.push("El título es requerido");
    }

    if (taskData.title && taskData.title.length > 100) {
      errors.push("El título debe tener menos de 100 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
  }

  /**
   * Exportar tareas a CSV
   */
  exportTasks() {
    const headers = [
      "Título",
      "Descripción",
      "Prioridad",
      "Estado",
      "Fecha Vencimiento",
      "Fecha Creación",
    ];
    const csvContent = [headers.join(",")];

    this.tasks.forEach((task) => {
      const row = [
        `"${task.title.replace(/"/g, '""')}"`,
        `"${(task.description || "").replace(/"/g, '""')}"`,
        task.priority,
        task.status === "completed" ? "Completada" : "Pendiente",
        task.dueDate || "",
        new Date(task.createdAt).toLocaleDateString("es-ES"),
      ];
      csvContent.push(row.join(","));
    });

    return csvContent.join("\n");
  }
}
