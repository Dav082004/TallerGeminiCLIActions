/**
 * TaskFlow Manager - Task Routes
 * API routes for task management operations
 */

const express = require("express");
const router = express.Router();
const Joi = require("joi");

// In-memory storage for demo purposes
// In production, this would be replaced with a proper database
let tasks = [
  {
    id: "demo-1",
    title: "Review pull request #42",
    description: "Check the new authentication feature implementation",
    priority: "high",
    dueDate: "2025-08-15",
    completed: false,
    createdAt: "2025-08-09T10:00:00.000Z",
    updatedAt: "2025-08-09T10:00:00.000Z",
  },
  {
    id: "demo-2",
    title: "Fix bug in task filtering",
    description: "Users report that priority filters are not working correctly",
    priority: "medium",
    dueDate: "2025-08-12",
    completed: false,
    createdAt: "2025-08-09T09:30:00.000Z",
    updatedAt: "2025-08-09T09:30:00.000Z",
  },
  {
    id: "demo-3",
    title: "Update documentation",
    description: "Add examples for Gemini CLI usage in README",
    priority: "low",
    dueDate: null,
    completed: true,
    createdAt: "2025-08-08T14:15:00.000Z",
    updatedAt: "2025-08-09T08:45:00.000Z",
  },
];

// Validation schemas
const taskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).allow(""),
  priority: Joi.string()
    .valid("low", "medium", "high", "critical")
    .default("medium"),
  dueDate: Joi.date().iso().allow(null),
  completed: Joi.boolean().default(false),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().max(500).allow(""),
  priority: Joi.string().valid("low", "medium", "high", "critical"),
  dueDate: Joi.date().iso().allow(null),
  completed: Joi.boolean(),
});

// Utility functions
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

const findTaskById = (id) => tasks.find((task) => task.id === id);

const createTaskResponse = (task) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  priority: task.priority,
  dueDate: task.dueDate,
  completed: task.completed,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});

// GET /api/tasks - Get all tasks
router.get("/", (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = "dueDate",
      order = "asc",
      limit = 50,
      offset = 0,
    } = req.query;

    let filteredTasks = [...tasks];

    // Apply filters
    if (status && status !== "all") {
      if (status === "completed") {
        filteredTasks = filteredTasks.filter((task) => task.completed);
      } else if (status === "pending") {
        filteredTasks = filteredTasks.filter((task) => !task.completed);
      }
    }

    if (priority && priority !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.priority === priority
      );
    }

    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "created":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "dueDate":
        default:
          aValue = a.dueDate ? new Date(a.dueDate) : new Date("9999-12-31");
          bValue = b.dueDate ? new Date(b.dueDate) : new Date("9999-12-31");
          break;
      }

      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

    // Apply pagination
    const total = filteredTasks.length;
    const paginatedTasks = filteredTasks.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      success: true,
      data: paginatedTasks.map(createTaskResponse),
      meta: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        count: paginatedTasks.length,
      },
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tasks",
    });
  }
});

// GET /api/tasks/stats - Get task statistics
router.get("/stats", (req, res) => {
  try {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    // Count overdue tasks
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const overdue = tasks.filter(
      (task) => !task.completed && task.dueDate && new Date(task.dueDate) < now
    ).length;

    // Count by priority
    const byPriority = {
      critical: tasks.filter((task) => task.priority === "critical").length,
      high: tasks.filter((task) => task.priority === "high").length,
      medium: tasks.filter((task) => task.priority === "medium").length,
      low: tasks.filter((task) => task.priority === "low").length,
    };

    res.json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        byPriority,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching task statistics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch task statistics",
    });
  }
});

// GET /api/tasks/:id - Get task by ID
router.get("/:id", (req, res) => {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    res.json({
      success: true,
      data: createTaskResponse(task),
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch task",
    });
  }
});

// POST /api/tasks - Create a new task
router.post("/", (req, res) => {
  try {
    const { error, value } = taskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    const newTask = {
      id: generateId(),
      ...value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.unshift(newTask); // Add to beginning for newest first

    res.status(201).json({
      success: true,
      data: createTaskResponse(newTask),
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create task",
    });
  }
});

// PUT /api/tasks/:id - Update task by ID
router.put("/:id", (req, res) => {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const { error, value } = updateTaskSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message,
      });
    }

    // Update task properties
    Object.assign(task, value, {
      updatedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      data: createTaskResponse(task),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update task",
    });
  }
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
router.patch("/:id/toggle", (req, res) => {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    task.completed = !task.completed;
    task.updatedAt = new Date().toISOString();

    res.json({
      success: true,
      data: createTaskResponse(task),
    });
  } catch (error) {
    console.error("Error toggling task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle task",
    });
  }
});

// DELETE /api/tasks/:id - Delete task by ID
router.delete("/:id", (req, res) => {
  try {
    const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Task not found",
      });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];

    res.json({
      success: true,
      data: createTaskResponse(deletedTask),
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete task",
    });
  }
});

// POST /api/tasks/bulk - Bulk operations
router.post("/bulk", (req, res) => {
  try {
    const { operation, taskIds } = req.body;

    if (!operation || !Array.isArray(taskIds)) {
      return res.status(400).json({
        success: false,
        error: "Invalid bulk operation request",
      });
    }

    let updatedTasks = [];

    switch (operation) {
      case "complete":
        taskIds.forEach((id) => {
          const task = findTaskById(id);
          if (task) {
            task.completed = true;
            task.updatedAt = new Date().toISOString();
            updatedTasks.push(task);
          }
        });
        break;

      case "delete":
        taskIds.forEach((id) => {
          const taskIndex = tasks.findIndex((task) => task.id === id);
          if (taskIndex !== -1) {
            updatedTasks.push(tasks.splice(taskIndex, 1)[0]);
          }
        });
        break;

      default:
        return res.status(400).json({
          success: false,
          error: "Unsupported bulk operation",
        });
    }

    res.json({
      success: true,
      data: {
        operation,
        count: updatedTasks.length,
        tasks: updatedTasks.map(createTaskResponse),
      },
    });
  } catch (error) {
    console.error("Error performing bulk operation:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform bulk operation",
    });
  }
});

module.exports = router;
