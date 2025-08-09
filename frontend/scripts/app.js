/**
 * TaskFlow Manager - Main Application
 * Main application logic and DOM manipulation
 */

class TaskFlowApp {
  constructor() {
    this.taskManager = new TaskManager();
    this.currentEditingTask = null;
    this.initialize();
  }

  /**
   * Initialize the application
   */
  initialize() {
    // Initialize theme
    Utils.initializeTheme();

    // Wait for DOM to be fully loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupEventListeners()
      );
    } else {
      this.setupEventListeners();
    }
  }

  /**
   * Set up all event listeners
   */
  setupEventListeners() {
    // Task form submission
    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => this.handleTaskSubmit(e));
    }

    // Edit task form submission
    const editTaskForm = document.getElementById("editTaskForm");
    if (editTaskForm) {
      editTaskForm.addEventListener("submit", (e) =>
        this.handleEditTaskSubmit(e)
      );
    }

    // Character counters
    this.setupCharacterCounters();

    // Filter controls
    this.setupFilterControls();

    // Export button
    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportTasks());
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
      darkModeToggle.addEventListener("click", () => Utils.toggleTheme());
    }

    // Modal controls
    this.setupModalControls();

    // About button
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", () => this.showAboutModal());
    }

    // Initial render
    this.renderTasks();
    this.updateStatistics();
  }

  /**
   * Set up character counters for input fields
   */
  setupCharacterCounters() {
    const titleInput = document.getElementById("taskTitle");
    const descriptionInput = document.getElementById("taskDescription");
    const editTitleInput = document.getElementById("editTaskTitle");
    const editDescriptionInput = document.getElementById("editTaskDescription");

    if (titleInput) {
      titleInput.addEventListener("input", (e) =>
        this.updateCharCounter(e.target, 100)
      );
    }
    if (descriptionInput) {
      descriptionInput.addEventListener("input", (e) =>
        this.updateCharCounter(e.target, 500)
      );
    }
    if (editTitleInput) {
      editTitleInput.addEventListener("input", (e) =>
        this.updateCharCounter(e.target, 100)
      );
    }
    if (editDescriptionInput) {
      editDescriptionInput.addEventListener("input", (e) =>
        this.updateCharCounter(e.target, 500)
      );
    }
  }

  /**
   * Update character counter for an input field
   * @param {HTMLElement} input - Input element
   * @param {number} maxLength - Maximum length
   */
  updateCharCounter(input, maxLength) {
    const counter = input.parentNode.querySelector(".char-counter");
    if (counter) {
      const currentLength = input.value.length;
      counter.textContent = `${currentLength}/${maxLength}`;

      if (currentLength > maxLength * 0.9) {
        counter.style.color = "#ef4444";
      } else if (currentLength > maxLength * 0.7) {
        counter.style.color = "#f59e0b";
      } else {
        counter.style.color = "#9ca3af";
      }
    }
  }

  /**
   * Set up filter and sort controls
   */
  setupFilterControls() {
    const filterStatus = document.getElementById("filterStatus");
    const filterPriority = document.getElementById("filterPriority");
    const searchInput = document.getElementById("searchTasks");
    const sortSelect = document.getElementById("sortBy");
    const clearFiltersBtn = document.getElementById("clearFilters");

    if (filterStatus) {
      filterStatus.addEventListener("change", () => this.applyFilters());
    }
    if (filterPriority) {
      filterPriority.addEventListener("change", () => this.applyFilters());
    }
    if (searchInput) {
      searchInput.addEventListener(
        "input",
        Utils.debounce(() => this.applyFilters(), 300)
      );
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", () => this.applySorting());
    }
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener("click", () => this.clearFilters());
    }
  }

  /**
   * Set up modal controls
   */
  setupModalControls() {
    const taskModal = document.getElementById("taskModal");
    const closeModalBtn = document.getElementById("closeModal");
    const cancelEditBtn = document.getElementById("cancelEdit");

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => this.closeModal());
    }
    if (cancelEditBtn) {
      cancelEditBtn.addEventListener("click", () => this.closeModal());
    }
    if (taskModal) {
      taskModal.addEventListener("click", (e) => {
        if (e.target === taskModal) {
          this.closeModal();
        }
      });
    }
  }

  /**
   * Handle task form submission
   * @param {Event} e - Form submit event
   */
  handleTaskSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
    };

    const result = this.taskManager.addTask(taskData);

    if (result.success) {
      e.target.reset();
      this.renderTasks();
      this.updateStatistics();
      this.resetCharCounters();
    } else {
      Utils.showNotification(result.error, "error");
    }
  }

  /**
   * Handle edit task form submission
   * @param {Event} e - Form submit event
   */
  handleEditTaskSubmit(e) {
    e.preventDefault();

    if (!this.currentEditingTask) return;

    const formData = new FormData(e.target);
    const updates = {
      title: formData.get("title"),
      description: formData.get("description"),
      priority: formData.get("priority"),
      dueDate: formData.get("dueDate"),
    };

    const result = this.taskManager.updateTask(
      this.currentEditingTask.id,
      updates
    );

    if (result.success) {
      this.closeModal();
      this.renderTasks();
      this.updateStatistics();
    } else {
      Utils.showNotification(result.error, "error");
    }
  }

  /**
   * Apply filters to task list
   */
  applyFilters() {
    const filterStatus = document.getElementById("filterStatus");
    const filterPriority = document.getElementById("filterPriority");
    const searchInput = document.getElementById("searchTasks");

    const filters = {
      status: filterStatus ? filterStatus.value : "all",
      priority: filterPriority ? filterPriority.value : "all",
      search: searchInput ? searchInput.value : "",
    };

    this.taskManager.setFilter(filters);
    this.renderTasks();
  }

  /**
   * Apply sorting to task list
   */
  applySorting() {
    const sortSelect = document.getElementById("sortBy");
    if (sortSelect) {
      this.taskManager.setSort(sortSelect.value);
      this.renderTasks();
    }
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    const filterStatus = document.getElementById("filterStatus");
    const filterPriority = document.getElementById("filterPriority");
    const searchInput = document.getElementById("searchTasks");

    if (filterStatus) filterStatus.value = "all";
    if (filterPriority) filterPriority.value = "all";
    if (searchInput) searchInput.value = "";

    this.taskManager.clearFilters();
    this.renderTasks();
  }

  /**
   * Reset character counters
   */
  resetCharCounters() {
    const counters = document.querySelectorAll(".char-counter");
    counters.forEach((counter) => {
      counter.textContent =
        "0/" + (counter.textContent.includes("100") ? "100" : "500");
      counter.style.color = "#9ca3af";
    });
  }

  /**
   * Render all tasks
   */
  renderTasks() {
    const taskList = document.getElementById("taskList");
    const emptyState = document.getElementById("emptyState");

    if (!taskList) return;

    const tasks = this.taskManager.getFilteredTasks();

    if (tasks.length === 0) {
      taskList.style.display = "none";
      if (emptyState) emptyState.style.display = "block";
      return;
    }

    taskList.style.display = "block";
    if (emptyState) emptyState.style.display = "none";

    taskList.innerHTML = tasks
      .map((task) => this.createTaskHTML(task))
      .join("");

    // Add event listeners to task items
    this.attachTaskEventListeners();
  }

  /**
   * Create HTML for a single task
   * @param {Object} task - Task object
   * @returns {string} HTML string
   */
  createTaskHTML(task) {
    const priorityInfo = Utils.formatPriority(task.priority);
    const isOverdue = task.dueDate && Utils.isOverdue(task.dueDate);
    const isDueSoon = task.dueDate && Utils.isDueSoon(task.dueDate);

    let taskClasses = "task-item";
    if (task.completed) taskClasses += " completed";
    if (isOverdue) taskClasses += " overdue";
    if (task.priority === "high") taskClasses += " high-priority";
    if (task.priority === "critical") taskClasses += " critical-priority";

    return `
      <div class="${taskClasses}" data-task-id="${task.id}">
        <div class="task-header">
          <h3 class="task-title">${Utils.sanitizeHtml(task.title)}</h3>
          <div class="task-actions">
            <button class="task-action-btn complete-btn tooltip" onclick="app.toggleTaskCompletion('${
              task.id
            }')" title="${
      task.completed ? "Mark as pending" : "Mark as completed"
    }">
              <i class="fas ${task.completed ? "fa-undo" : "fa-check"}"></i>
            </button>
            <button class="task-action-btn edit-btn tooltip" onclick="app.editTask('${
              task.id
            }')" title="Edit task">
              <i class="fas fa-edit"></i>
            </button>
            <button class="task-action-btn delete-btn tooltip" onclick="app.deleteTask('${
              task.id
            }')" title="Delete task">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
        
        ${
          task.description
            ? `<div class="task-description">${Utils.sanitizeHtml(
                task.description
              )}</div>`
            : ""
        }
        
        <div class="task-meta">
          ${
            task.dueDate
              ? `
            <div class="task-due-date ${
              isOverdue ? "overdue" : isDueSoon ? "due-soon" : ""
            }">
              <i class="fas fa-calendar-alt"></i>
              <span>Due ${Utils.formatDate(task.dueDate)}</span>
            </div>
          `
              : ""
          }
          
          <div class="task-priority ${task.priority}">
            <span class="priority-icon ${task.priority}">${
      priorityInfo.icon
    }</span>
            <span>${priorityInfo.label}</span>
          </div>
          
          <div class="task-created-date">
            Created ${Utils.formatDate(task.createdAt)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to task items
   */
  attachTaskEventListeners() {
    // Event delegation is handled by onclick attributes in the HTML
    // This method can be used for more complex interactions if needed
  }

  /**
   * Toggle task completion status
   * @param {string} taskId - Task ID
   */
  toggleTaskCompletion(taskId) {
    const result = this.taskManager.toggleTaskCompletion(taskId);
    if (result.success) {
      this.renderTasks();
      this.updateStatistics();
    } else {
      Utils.showNotification(result.error, "error");
    }
  }

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   */
  deleteTask(taskId) {
    const task = this.taskManager.getTask(taskId);
    if (!task) return;

    const confirmed = confirm(
      `Are you sure you want to delete "${task.title}"?`
    );
    if (confirmed) {
      const result = this.taskManager.deleteTask(taskId);
      if (result.success) {
        this.renderTasks();
        this.updateStatistics();
      } else {
        Utils.showNotification(result.error, "error");
      }
    }
  }

  /**
   * Edit a task
   * @param {string} taskId - Task ID
   */
  editTask(taskId) {
    const task = this.taskManager.getTask(taskId);
    if (!task) return;

    this.currentEditingTask = task;

    // Populate edit form
    document.getElementById("editTaskId").value = task.id;
    document.getElementById("editTaskTitle").value = task.title;
    document.getElementById("editTaskDescription").value =
      task.description || "";
    document.getElementById("editTaskPriority").value = task.priority;
    document.getElementById("editTaskDueDate").value = task.dueDate || "";

    // Update character counters
    this.updateCharCounter(document.getElementById("editTaskTitle"), 100);
    this.updateCharCounter(document.getElementById("editTaskDescription"), 500);

    // Show modal
    this.showModal();
  }

  /**
   * Show the edit modal
   */
  showModal() {
    const modal = document.getElementById("taskModal");
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";

      // Focus on title input
      setTimeout(() => {
        const titleInput = document.getElementById("editTaskTitle");
        if (titleInput) titleInput.focus();
      }, 100);
    }
  }

  /**
   * Close the edit modal
   */
  closeModal() {
    const modal = document.getElementById("taskModal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "";
      this.currentEditingTask = null;
    }
  }

  /**
   * Update task statistics
   */
  updateStatistics() {
    const stats = this.taskManager.getStatistics();

    const totalElement = document.getElementById("totalTasks");
    const pendingElement = document.getElementById("pendingTasks");
    const completedElement = document.getElementById("completedTasks");
    const overdueElement = document.getElementById("overdueTasks");

    if (totalElement) totalElement.textContent = stats.total;
    if (pendingElement) pendingElement.textContent = stats.pending;
    if (completedElement) completedElement.textContent = stats.completed;
    if (overdueElement) overdueElement.textContent = stats.overdue;
  }

  /**
   * Export tasks to CSV
   */
  exportTasks() {
    try {
      const csvContent = this.taskManager.exportTasks();
      const filename = `taskflow-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      Utils.downloadFile(csvContent, filename, "text/csv");
      Utils.showNotification("Tasks exported successfully!", "success");
    } catch (error) {
      console.error("Export error:", error);
      Utils.showNotification("Failed to export tasks", "error");
    }
  }

  /**
   * Show about modal
   */
  showAboutModal() {
    const aboutContent = `
      <div style="text-align: center; padding: 20px;">
        <h2>🎯 TaskFlow Manager</h2>
        <p style="margin: 16px 0; color: #6b7280;">
          A smart task management system powered by <strong>Gemini CLI</strong>
        </p>
        <div style="margin: 20px 0; padding: 16px; background: #f3f4f6; border-radius: 8px;">
          <h3>Demo Features:</h3>
          <ul style="text-align: left; margin: 8px 0;">
            <li>🔍 Intelligent Issue Triage</li>
            <li>📝 Automated Code Review</li>
            <li>🤖 Conversational AI Assistant</li>
            <li>📊 Task Analytics</li>
          </ul>
        </div>
        <p style="font-size: 14px; color: #9ca3af;">
          Built for demonstrating Gemini CLI workflows in GitHub Actions
        </p>
        <div style="margin-top: 20px;">
          <button onclick="this.closest('.modal').style.display='none'; document.body.style.overflow='';" 
                  style="padding: 8px 16px; background: #4f46e5; color: white; border: none; border-radius: 6px; cursor: pointer;">
            Close
          </button>
        </div>
      </div>
    `;

    // Create and show modal
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 400px;">
        ${aboutContent}
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";

    // Close on outside click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
        document.body.style.overflow = "";
      }
    });
  }
}

// Initialize the application
let app;

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    app = new TaskFlowApp();
  });
} else {
  app = new TaskFlowApp();
}

// Make app globally available for onclick handlers
window.app = app;
