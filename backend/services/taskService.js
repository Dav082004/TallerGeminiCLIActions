/**
 * Servicio de gestión de tareas para TaskFlow Manager
 * Maneja la lógica de negocio y persistencia de datos
 */

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class TaskService {
  constructor() {
    this.dataFile = path.join(__dirname, "..", "data", "tasks.json");
    this.ensureDataDirectory();
  }

  /**
   * Asegurar que el directorio de datos existe
   */
  ensureDataDirectory() {
    const dataDir = path.dirname(this.dataFile);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Si el archivo no existe, crearlo con un array vacío
    if (!fs.existsSync(this.dataFile)) {
      this.saveTasks([]);
    }
  }

  /**
   * Cargar todas las tareas desde el archivo
   */
  loadTasks() {
    try {
      const data = fs.readFileSync(this.dataFile, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      return [];
    }
  }

  /**
   * Guardar tareas al archivo
   */
  saveTasks(tasks) {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(tasks, null, 2), "utf8");
      return true;
    } catch (error) {
      console.error("Error guardando tareas:", error);
      return false;
    }
  }

  /**
   * Obtener todas las tareas
   */
  getAllTasks() {
    return this.loadTasks();
  }

  /**
   * Obtener una tarea por ID
   */
  getTaskById(id) {
    const tasks = this.loadTasks();
    return tasks.find((task) => task.id === id);
  }

  /**
   * Crear una nueva tarea
   */
  createTask(taskData) {
    try {
      const tasks = this.loadTasks();

      const newTask = {
        id: uuidv4(),
        title: taskData.title,
        description: taskData.description || "",
        priority: taskData.priority || "medium",
        status: "pending",
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: taskData.tags || [],
      };

      tasks.push(newTask);

      if (this.saveTasks(tasks)) {
        return { success: true, data: newTask };
      } else {
        return { success: false, error: "Error guardando la tarea" };
      }
    } catch (error) {
      console.error("Error creando tarea:", error);
      return { success: false, error: "Error interno creando tarea" };
    }
  }

  /**
   * Actualizar una tarea existente
   */
  updateTask(id, updates) {
    try {
      const tasks = this.loadTasks();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return { success: false, error: "Tarea no encontrada" };
      }

      // Validar que solo se actualicen campos permitidos
      const allowedFields = [
        "title",
        "description",
        "priority",
        "status",
        "dueDate",
        "tags",
      ];
      const filteredUpdates = {};

      for (const field of allowedFields) {
        if (updates.hasOwnProperty(field)) {
          filteredUpdates[field] = updates[field];
        }
      }

      // Actualizar la tarea
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...filteredUpdates,
        updatedAt: new Date().toISOString(),
      };

      if (this.saveTasks(tasks)) {
        return { success: true, data: tasks[taskIndex] };
      } else {
        return { success: false, error: "Error guardando cambios" };
      }
    } catch (error) {
      console.error("Error actualizando tarea:", error);
      return { success: false, error: "Error interno actualizando tarea" };
    }
  }

  /**
   * Eliminar una tarea
   */
  deleteTask(id) {
    try {
      const tasks = this.loadTasks();
      const taskIndex = tasks.findIndex((task) => task.id === id);

      if (taskIndex === -1) {
        return { success: false, error: "Tarea no encontrada" };
      }

      const deletedTask = tasks.splice(taskIndex, 1)[0];

      if (this.saveTasks(tasks)) {
        return { success: true, data: deletedTask };
      } else {
        return { success: false, error: "Error eliminando la tarea" };
      }
    } catch (error) {
      console.error("Error eliminando tarea:", error);
      return { success: false, error: "Error interno eliminando tarea" };
    }
  }

  /**
   * Alternar estado de completado de una tarea
   */
  toggleTaskCompletion(id) {
    const task = this.getTaskById(id);
    if (!task) {
      return { success: false, error: "Tarea no encontrada" };
    }

    const newStatus = task.status === "completed" ? "pending" : "completed";
    return this.updateTask(id, { status: newStatus });
  }

  /**
   * Obtener estadísticas de tareas
   */
  getTaskStats() {
    const tasks = this.loadTasks();

    const stats = {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      overdue: 0,
      byPriority: {
        low: tasks.filter((t) => t.priority === "low").length,
        medium: tasks.filter((t) => t.priority === "medium").length,
        high: tasks.filter((t) => t.priority === "high").length,
        critical: tasks.filter((t) => t.priority === "critical").length,
      },
    };

    // Calcular tareas atrasadas
    const now = new Date();
    stats.overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === "completed") return false;
      return new Date(task.dueDate) < now;
    }).length;

    return { success: true, data: stats };
  }

  /**
   * Buscar tareas por criterios
   */
  searchTasks(criteria) {
    const tasks = this.loadTasks();
    let filteredTasks = [...tasks];

    // Filtrar por estado
    if (criteria.status && criteria.status !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.status === criteria.status
      );
    }

    // Filtrar por prioridad
    if (criteria.priority && criteria.priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === criteria.priority
      );
    }

    // Filtrar por texto de búsqueda
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    // Ordenar resultados
    if (criteria.sortBy) {
      filteredTasks.sort((a, b) => {
        switch (criteria.sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "priority":
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case "dueDate":
            if (!a.dueDate && !b.dueDate) return 0;
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate) - new Date(b.dueDate);
          case "created":
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      });
    }

    return { success: true, data: filteredTasks };
  }

  /**
   * Exportar tareas en formato JSON
   */
  exportTasks() {
    const tasks = this.loadTasks();
    const exportData = {
      exportDate: new Date().toISOString(),
      version: "1.0",
      taskCount: tasks.length,
      tasks: tasks,
    };

    return { success: true, data: exportData };
  }

  /**
   * Importar tareas desde datos JSON
   */
  importTasks(importData) {
    try {
      if (!importData || !Array.isArray(importData.tasks)) {
        return { success: false, error: "Formato de datos inválido" };
      }

      const currentTasks = this.loadTasks();
      const newTasks = importData.tasks.map((task) => ({
        ...task,
        id: uuidv4(), // Generar nuevos IDs para evitar conflictos
        importedAt: new Date().toISOString(),
      }));

      const allTasks = [...currentTasks, ...newTasks];

      if (this.saveTasks(allTasks)) {
        return {
          success: true,
          data: {
            imported: newTasks.length,
            total: allTasks.length,
          },
        };
      } else {
        return { success: false, error: "Error guardando tareas importadas" };
      }
    } catch (error) {
      console.error("Error importando tareas:", error);
      return { success: false, error: "Error procesando datos de importación" };
    }
  }
}

module.exports = TaskService;
