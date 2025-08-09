/**
 * DEMO FILE - Código con bugs intencionales para mostrar PR Review
 * Este archivo contiene varios problemas típicos que Gemini CLI detectará
 */

class TaskValidator {
  // BUG 1: Assignment instead of comparison
  static validateTitle(title) {
    if ((title = "")) {
      // Debería ser ===
      return { isValid: false, error: "Title is required" };
    }
    return { isValid: true };
  }

  // BUG 2: No input sanitization (XSS vulnerability)
  static sanitizeInput(input) {
    // return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return input; // No sanitization!
  }

  // BUG 3: Hardcoded credentials (security issue)
  static getApiConfig() {
    return {
      apiKey: "sk-1234567890abcdef", // Hardcoded API key
      endpoint: "https://api.example.com",
      timeout: 5000,
    };
  }

  // BUG 4: Poor error handling
  static async saveTask(task) {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(task),
      });
      return response.json();
    } catch (error) {
      console.log(error); // Solo console.log, no manejo real
    }
  }

  // BUG 5: Memory leak potential
  static startTimer() {
    setInterval(() => {
      console.log("Timer tick");
    }, 1000); // No cleanup
  }

  // BUG 6: Inefficient algorithm (O(n²) complexity)
  static findDuplicateTasks(tasks) {
    const duplicates = [];
    for (let i = 0; i < tasks.length; i++) {
      for (let j = i + 1; j < tasks.length; j++) {
        if (tasks[i].title === tasks[j].title) {
          duplicates.push(tasks[i]);
        }
      }
    }
    return duplicates;
  }

  // BUG 7: No null/undefined checks
  static getTaskCount(user) {
    return user.tasks.length; // Potential null reference
  }

  // BUG 8: Race condition
  static updateTaskCounter() {
    const current = this.getTaskCount();
    setTimeout(() => {
      this.setTaskCount(current + 1);
    }, 100);
  }
}

// BUG 9: Global variable pollution
var globalTaskList = [];
window.debugMode = true;

// BUG 10: Missing semicolons and inconsistent formatting
function processTask(task) {
  if (!task) return null;
  const result = task.title + ": " + task.description;
  return result;
}

module.exports = TaskValidator;
