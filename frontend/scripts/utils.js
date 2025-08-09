/**
 * TaskFlow Manager - Utility Functions
 * Common utility functions used across the application
 */

const Utils = {
  /**
   * Generate a unique ID for tasks
   * @returns {string} Unique identifier
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  /**
   * Format date for display
   * @param {Date|string} date - Date to format
   * @returns {string} Formatted date string
   */
  formatDate(date) {
    if (!date) return "";

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7)
      return `${Math.abs(diffDays)} days ago`;

    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  /**
   * Check if a date is overdue
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if overdue
   */
  isOverdue(date) {
    if (!date) return false;
    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dateObj < today;
  },

  /**
   * Check if a date is due soon (within 3 days)
   * @param {Date|string} date - Date to check
   * @returns {boolean} True if due soon
   */
  isDueSoon(date) {
    if (!date) return false;
    const dateObj = new Date(date);
    const today = new Date();
    const diffTime = dateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 3;
  },

  /**
   * Sanitize HTML to prevent XSS attacks
   * @param {string} str - String to sanitize
   * @returns {string} Sanitized string
   */
  sanitizeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Validate task input
   * @param {Object} task - Task object to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateTask(task) {
    const errors = [];

    // Title validation
    if (!task.title || task.title.trim().length === 0) {
      errors.push("Task title is required");
    } else if (task.title.length > 100) {
      errors.push("Task title must be under 100 characters");
    }

    // Description validation
    if (task.description && task.description.length > 500) {
      errors.push("Task description must be under 500 characters");
    }

    // Priority validation
    const validPriorities = ["low", "medium", "high", "critical"];
    if (task.priority && !validPriorities.includes(task.priority)) {
      errors.push("Invalid priority level");
    }

    // Due date validation
    if (task.dueDate) {
      const dateObj = new Date(task.dueDate);
      if (isNaN(dateObj.getTime())) {
        errors.push("Invalid due date");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Show a toast notification
   * @param {string} message - Message to display
   * @param {string} type - Type of notification (success, error, warning, info)
   * @param {number} duration - Duration in milliseconds
   */
  showNotification(message, type = "info", duration = 3000) {
    // Remove existing notifications
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
      <div class="toast-content">
        <i class="fas ${this.getNotificationIcon(type)}"></i>
        <span>${this.sanitizeHtml(message)}</span>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 14px;
      max-width: 350px;
      animation: slideInToast 0.3s ease-out;
    `;

    // Set colors based on type
    const colors = {
      success: { bg: "#10b981", color: "#fff" },
      error: { bg: "#ef4444", color: "#fff" },
      warning: { bg: "#f59e0b", color: "#fff" },
      info: { bg: "#3b82f6", color: "#fff" },
    };

    const color = colors[type] || colors.info;
    toast.style.backgroundColor = color.bg;
    toast.style.color = color.color;

    document.body.appendChild(toast);

    // Auto remove after duration
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "slideOutToast 0.3s ease-in forwards";
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  },

  /**
   * Get icon for notification type
   * @param {string} type - Notification type
   * @returns {string} Font Awesome icon class
   */
  getNotificationIcon(type) {
    const icons = {
      success: "fa-check-circle",
      error: "fa-exclamation-circle",
      warning: "fa-exclamation-triangle",
      info: "fa-info-circle",
    };
    return icons[type] || icons.info;
  },

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Format priority for display
   * @param {string} priority - Priority level
   * @returns {Object} Priority display info
   */
  formatPriority(priority) {
    const priorities = {
      low: { label: "Low", color: "#10b981", icon: "●" },
      medium: { label: "Medium", color: "#3b82f6", icon: "●" },
      high: { label: "High", color: "#f59e0b", icon: "●" },
      critical: { label: "Critical", color: "#ef4444", icon: "●" },
    };
    return priorities[priority] || priorities.medium;
  },

  /**
   * Export tasks to CSV format
   * @param {Array} tasks - Array of tasks to export
   * @returns {string} CSV content
   */
  exportToCSV(tasks) {
    const headers = [
      "Title",
      "Description",
      "Priority",
      "Due Date",
      "Status",
      "Created Date",
    ];
    const csvContent = [
      headers.join(","),
      ...tasks.map((task) =>
        [
          `"${task.title.replace(/"/g, '""')}"`,
          `"${(task.description || "").replace(/"/g, '""')}"`,
          task.priority,
          task.dueDate || "",
          task.completed ? "Completed" : "Pending",
          new Date(task.createdAt).toISOString().split("T")[0],
        ].join(",")
      ),
    ].join("\n");

    return csvContent;
  },

  /**
   * Download content as file
   * @param {string} content - File content
   * @param {string} filename - Filename
   * @param {string} mimeType - MIME type
   */
  downloadFile(content, filename, mimeType = "text/plain") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },

  /**
   * Get current theme
   * @returns {string} Current theme ('light' or 'dark')
   */
  getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  },

  /**
   * Toggle theme between light and dark
   */
  toggleTheme() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("taskflow-theme", newTheme);

    // Update theme toggle button icon
    const themeToggle = document.getElementById("darkModeToggle");
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    }
  },

  /**
   * Initialize theme from localStorage
   */
  initializeTheme() {
    const savedTheme = localStorage.getItem("taskflow-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Update theme toggle button icon
    const themeToggle = document.getElementById("darkModeToggle");
    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }
    }
  },
};

// Add CSS animations for toast notifications
if (!document.querySelector("#toast-animations")) {
  const style = document.createElement("style");
  style.id = "toast-animations";
  style.textContent = `
    @keyframes slideInToast {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutToast {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .toast-close {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      margin-left: auto;
      padding: 4px;
      border-radius: 4px;
      opacity: 0.8;
    }
    
    .toast-close:hover {
      opacity: 1;
      background-color: rgba(255, 255, 255, 0.2);
    }
  `;
  document.head.appendChild(style);
}

// Export Utils for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = Utils;
}
