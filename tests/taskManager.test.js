/**
 * TaskFlow Manager - Unit Tests
 * Test suite for task management functionality
 */

const TaskManager = require("../frontend/scripts/taskManager");
const Utils = require("../frontend/scripts/utils");

// Mock localStorage for Node.js environment
global.localStorage = {
  data: {},
  getItem: function (key) {
    return this.data[key] || null;
  },
  setItem: function (key, value) {
    this.data[key] = value;
  },
  removeItem: function (key) {
    delete this.data[key];
  },
  clear: function () {
    this.data = {};
  },
};

describe("TaskManager", () => {
  let taskManager;

  beforeEach(() => {
    localStorage.clear();
    taskManager = new TaskManager();
  });

  describe("addTask", () => {
    it("should add a valid task successfully", () => {
      const taskData = {
        title: "Test Task",
        description: "Test Description",
        priority: "medium",
        dueDate: "2025-12-31",
      };

      const result = taskManager.addTask(taskData);

      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
      expect(result.data.title).toBe("Test Task");
      expect(result.data.completed).toBe(false);
    });

    it("should reject task without title", () => {
      const taskData = {
        description: "Test Description",
      };

      const result = taskManager.addTask(taskData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("required");
    });

    it("should reject task with title too long", () => {
      const taskData = {
        title: "a".repeat(101), // 101 characters
      };

      const result = taskManager.addTask(taskData);

      expect(result.success).toBe(false);
      expect(result.error).toContain("100 characters");
    });

    it("should assign default priority if not provided", () => {
      const taskData = {
        title: "Test Task",
      };

      const result = taskManager.addTask(taskData);

      expect(result.success).toBe(true);
      expect(result.data.priority).toBe("medium");
    });
  });

  describe("updateTask", () => {
    it("should update an existing task", () => {
      // First add a task
      const addResult = taskManager.addTask({ title: "Original Title" });
      const taskId = addResult.data.id;

      // Then update it
      const updateResult = taskManager.updateTask(taskId, {
        title: "Updated Title",
        description: "New description",
      });

      expect(updateResult.success).toBe(true);
      expect(updateResult.data.title).toBe("Updated Title");
      expect(updateResult.data.description).toBe("New description");
    });

    it("should return error for non-existent task", () => {
      const result = taskManager.updateTask("non-existent-id", {
        title: "Test",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("Task not found");
    });
  });

  describe("deleteTask", () => {
    it("should delete an existing task", () => {
      // First add a task
      const addResult = taskManager.addTask({ title: "Task to Delete" });
      const taskId = addResult.data.id;

      // Then delete it
      const deleteResult = taskManager.deleteTask(taskId);

      expect(deleteResult.success).toBe(true);
      expect(taskManager.getTask(taskId)).toBeNull();
    });

    it("should return error for non-existent task", () => {
      const result = taskManager.deleteTask("non-existent-id");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Task not found");
    });
  });

  describe("toggleTaskCompletion", () => {
    it("should toggle task completion status", () => {
      // Add a task
      const addResult = taskManager.addTask({ title: "Toggle Test" });
      const taskId = addResult.data.id;

      // Toggle to completed
      const toggleResult1 = taskManager.toggleTaskCompletion(taskId);
      expect(toggleResult1.success).toBe(true);
      expect(toggleResult1.data.completed).toBe(true);

      // Toggle back to pending
      const toggleResult2 = taskManager.toggleTaskCompletion(taskId);
      expect(toggleResult2.success).toBe(true);
      expect(toggleResult2.data.completed).toBe(false);
    });
  });

  describe("getStatistics", () => {
    it("should return correct statistics", () => {
      // Add some test tasks
      taskManager.addTask({ title: "Task 1", priority: "high" });
      const task2 = taskManager.addTask({ title: "Task 2", priority: "low" });
      taskManager.addTask({
        title: "Task 3",
        priority: "critical",
        dueDate: "2025-01-01", // Past date
      });

      // Complete one task
      taskManager.toggleTaskCompletion(task2.data.id);

      const stats = taskManager.getStatistics();

      expect(stats.total).toBe(3);
      expect(stats.completed).toBe(1);
      expect(stats.pending).toBe(2);
      expect(stats.overdue).toBe(1);
    });
  });

  describe("filtering and sorting", () => {
    beforeEach(() => {
      // Add test data
      taskManager.addTask({
        title: "High Priority Task",
        priority: "high",
        dueDate: "2025-12-31",
      });
      taskManager.addTask({
        title: "Low Priority Task",
        priority: "low",
        dueDate: "2025-06-15",
      });
      const completed = taskManager.addTask({
        title: "Completed Task",
        priority: "medium",
      });
      taskManager.toggleTaskCompletion(completed.data.id);
    });

    it("should filter by status", () => {
      taskManager.setFilter({ status: "completed" });
      const filteredTasks = taskManager.getFilteredTasks();
      expect(filteredTasks).toHaveLength(1);
      expect(filteredTasks[0].completed).toBe(true);
    });

    it("should filter by priority", () => {
      taskManager.setFilter({ priority: "high" });
      const filteredTasks = taskManager.getFilteredTasks();
      expect(filteredTasks).toHaveLength(1);
      expect(filteredTasks[0].priority).toBe("high");
    });

    it("should search by text", () => {
      taskManager.setFilter({ search: "high" });
      const filteredTasks = taskManager.getFilteredTasks();
      expect(filteredTasks).toHaveLength(1);
      expect(filteredTasks[0].title.toLowerCase()).toContain("high");
    });

    it("should sort by priority", () => {
      taskManager.setSort("priority");
      const sortedTasks = taskManager.getFilteredTasks();
      // Should be sorted high -> medium -> low (by priority value)
      expect(sortedTasks[0].priority).toBe("high");
      expect(sortedTasks[1].priority).toBe("medium");
      expect(sortedTasks[2].priority).toBe("low");
    });
  });
});

describe("Utils", () => {
  describe("validateTask", () => {
    it("should validate a correct task", () => {
      const task = {
        title: "Valid Task",
        description: "Valid description",
        priority: "medium",
        dueDate: "2025-12-31",
      };

      const result = Utils.validateTask(task);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject task without title", () => {
      const task = {
        description: "No title task",
      };

      const result = Utils.validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Task title is required");
    });

    it("should reject invalid priority", () => {
      const task = {
        title: "Valid Title",
        priority: "invalid",
      };

      const result = Utils.validateTask(task);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Invalid priority level");
    });
  });

  describe("date utilities", () => {
    it("should detect overdue dates", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      expect(Utils.isOverdue(yesterday.toISOString())).toBe(true);
      expect(Utils.isOverdue("2025-12-31")).toBe(false);
    });

    it("should detect due soon dates", () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      expect(Utils.isDueSoon(tomorrow.toISOString())).toBe(true);
      expect(Utils.isDueSoon(nextWeek.toISOString())).toBe(false);
    });

    it("should format dates correctly", () => {
      const today = new Date();
      expect(Utils.formatDate(today)).toBe("Today");

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(Utils.formatDate(tomorrow)).toBe("Tomorrow");
    });
  });

  describe("sanitizeHtml", () => {
    it("should escape HTML characters", () => {
      const input = '<script>alert("xss")</script>';
      const output = Utils.sanitizeHtml(input);
      expect(output).not.toContain("<script>");
      expect(output).toContain("&lt;script&gt;");
    });

    it("should handle empty input", () => {
      expect(Utils.sanitizeHtml("")).toBe("");
      expect(Utils.sanitizeHtml(null)).toBe("");
      expect(Utils.sanitizeHtml(undefined)).toBe("");
    });
  });

  describe("exportToCSV", () => {
    it("should export tasks to CSV format", () => {
      const tasks = [
        {
          title: "Task 1",
          description: "Description 1",
          priority: "high",
          dueDate: "2025-12-31",
          completed: false,
          createdAt: "2025-08-09T10:00:00.000Z",
        },
        {
          title: "Task 2",
          description: "Description 2",
          priority: "low",
          dueDate: null,
          completed: true,
          createdAt: "2025-08-09T11:00:00.000Z",
        },
      ];

      const csv = Utils.exportToCSV(tasks);

      expect(csv).toContain(
        "Title,Description,Priority,Due Date,Status,Created Date"
      );
      expect(csv).toContain(
        '"Task 1","Description 1",high,2025-12-31,Pending,2025-08-09'
      );
      expect(csv).toContain(
        '"Task 2","Description 2",low,,Completed,2025-08-09'
      );
    });
  });
});
