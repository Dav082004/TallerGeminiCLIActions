/**
 * TaskFlow Manager - Task Management Class
 * Core task management functionality with CRUD operations
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
   * Load tasks from localStorage
   */
  loadTasks() {
    try {
      const savedTasks = localStorage.getItem("taskflow-tasks");
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
        // Ensure all tasks have required properties
        this.tasks = this.tasks.map((task) => ({
          id: task.id || Utils.generateId(),
          title: task.title || "",
          description: task.description || "",
          priority: task.priority || "medium",
          dueDate: task.dueDate || null,
          completed: task.completed || false,
          createdAt: task.createdAt || new Date().toISOString(),
          updatedAt: task.updatedAt || new Date().toISOString(),
        }));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
      this.tasks = [];
      Utils.showNotification("Error loading tasks", "error");
    }
  }

  /**
   * Save tasks to localStorage
   */
  saveTasks() {
    try {
      localStorage.setItem("taskflow-tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
      Utils.showNotification("Error saving tasks", "error");
    }
  }

  /**
   * Add a new task
   * @param {Object} taskData - Task data object
   * @returns {Object} Result object with success status and data/error
   */
  addTask(taskData) {
    try {
      // Validate task data
      const validation = Utils.validateTask(taskData);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        };
      }

      // Create new task object
      const newTask = {
        id: Utils.generateId(),
        title: taskData.title.trim(),
        description: taskData.description ? taskData.description.trim() : "",
        priority: taskData.priority || "medium",
        dueDate: taskData.dueDate || null,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add to tasks array
      this.tasks.unshift(newTask); // Add to beginning for newest first
      this.saveTasks();

      Utils.showNotification("Task added successfully!", "success");

      return {
        success: true,
        data: newTask,
      };
    } catch (error) {
      console.error("Error adding task:", error);
      return {
        success: false,
        error: "Failed to add task",
      };
    }
  }

  /**
   * Update an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updates - Object with updated properties
   * @returns {Object} Result object with success status and data/error
   */
  updateTask(taskId, updates) {
    try {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      // Validate updated data
      const updatedTask = { ...this.tasks[taskIndex], ...updates };
      const validation = Utils.validateTask(updatedTask);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        };
      }

      // Update the task
      this.tasks[taskIndex] = {
        ...this.tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.saveTasks();
      Utils.showNotification("Task updated successfully!", "success");

      return {
        success: true,
        data: this.tasks[taskIndex],
      };
    } catch (error) {
      console.error("Error updating task:", error);
      return {
        success: false,
        error: "Failed to update task",
      };
    }
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Object} Result object with success status
   */
  deleteTask(taskId) {
    try {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) {
        return {
          success: false,
          error: "Task not found",
        };
      }

      const deletedTask = this.tasks[taskIndex];
      this.tasks.splice(taskIndex, 1);
      this.saveTasks();

      Utils.showNotification("Task deleted successfully!", "success");

      return {
        success: true,
        data: deletedTask,
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        success: false,
        error: "Failed to delete task",
      };
    }
  }

  /**
   * Toggle task completion status
   * @param {string} taskId - Task ID
   * @returns {Object} Result object with success status and data/error
   */
  toggleTaskCompletion(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    return this.updateTask(taskId, { completed: !task.completed });
  }

  /**
   * Get a task by ID
   * @param {string} taskId - Task ID
   * @returns {Object|null} Task object or null if not found
   */
  getTask(taskId) {
    return this.tasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Get all tasks
   * @returns {Array} Array of all tasks
   */
  getAllTasks() {
    return [...this.tasks];
  }

  /**
   * Get filtered and sorted tasks
   * @returns {Array} Array of filtered and sorted tasks
   */
  getFilteredTasks() {
    let filteredTasks = [...this.tasks];

    // Apply status filter
    if (this.currentFilter.status !== "all") {
      if (this.currentFilter.status === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.completed);
      } else if (this.currentFilter.status === "pending") {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
      }
    }

    // Apply priority filter
    if (this.currentFilter.priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === this.currentFilter.priority
      );
    }

    // Apply search filter
    if (this.currentFilter.search) {
      const searchTerm = this.currentFilter.search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      switch (this.currentSort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "created":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "dueDate":
        default:
          // Sort by due date, with null dates at the end
          if (!a.dueDate && !b.dueDate)
            return new Date(b.createdAt) - new Date(a.createdAt);
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
      }
    });

    return filteredTasks;
  }

  /**
   * Set filter options
   * @param {Object} filters - Filter object
   */
  setFilter(filters) {
    this.currentFilter = { ...this.currentFilter, ...filters };
  }

  /**
   * Set sort option
   * @param {string} sortBy - Sort field
   */
  setSort(sortBy) {
    this.currentSort = sortBy;
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.currentFilter = {
      status: "all",
      priority: "all",
      search: "",
    };
  }

  /**
   * Get task statistics
   * @returns {Object} Statistics object
   */
  getStatistics() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    // Count overdue tasks
    const overdue = this.tasks.filter(
      (task) => !task.completed && task.dueDate && Utils.isOverdue(task.dueDate)
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
    };
  }

  /**
   * Get tasks by priority
   * @returns {Object} Tasks grouped by priority
   */
  getTasksByPriority() {
    const grouped = {
      critical: [],
      high: [],
      medium: [],
      low: [],
    };

    this.tasks.forEach((task) => {
      if (grouped[task.priority]) {
        grouped[task.priority].push(task);
      }
    });

    return grouped;
  }

  /**
   * Get overdue tasks
   * @returns {Array} Array of overdue tasks
   */
  getOverdueTasks() {
    return this.tasks.filter(
      (task) => !task.completed && task.dueDate && Utils.isOverdue(task.dueDate)
    );
  }

  /**
   * Get tasks due soon (within 3 days)
   * @returns {Array} Array of tasks due soon
   */
  getTasksDueSoon() {
    return this.tasks.filter(
      (task) => !task.completed && task.dueDate && Utils.isDueSoon(task.dueDate)
    );
  }

  /**
   * Export all tasks
   * @returns {string} CSV content
   */
  exportTasks() {
    return Utils.exportToCSV(this.tasks);
  }

  /**
   * Import tasks from JSON
   * @param {Array} tasksData - Array of task objects
   * @returns {Object} Result object with success status
   */
  importTasks(tasksData) {
    try {
      if (!Array.isArray(tasksData)) {
        return {
          success: false,
          error: "Invalid data format",
        };
      }

      let importedCount = 0;
      const errors = [];

      tasksData.forEach((taskData, index) => {
        const validation = Utils.validateTask(taskData);
        if (validation.isValid) {
          const newTask = {
            id: Utils.generateId(),
            title: taskData.title.trim(),
            description: taskData.description
              ? taskData.description.trim()
              : "",
            priority: taskData.priority || "medium",
            dueDate: taskData.dueDate || null,
            completed: taskData.completed || false,
            createdAt: taskData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          this.tasks.push(newTask);
          importedCount++;
        } else {
          errors.push(`Task ${index + 1}: ${validation.errors.join(", ")}`);
        }
      });

      this.saveTasks();

      return {
        success: true,
        data: {
          imported: importedCount,
          errors,
        },
      };
    } catch (error) {
      console.error("Error importing tasks:", error);
      return {
        success: false,
        error: "Failed to import tasks",
      };
    }
  }

  /**
   * Search tasks by text
   * @param {string} searchTerm - Search term
   * @returns {Array} Array of matching tasks
   */
  searchTasks(searchTerm) {
    if (!searchTerm) return this.tasks;

    const term = searchTerm.toLowerCase();
    return this.tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
    );
  }
}

// Export TaskManager for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = TaskManager;
}
