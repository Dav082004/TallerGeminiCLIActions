# 🎯 TaskFlow Manager - Gemini CLI Configuration

## 📋 Project Overview

TaskFlow Manager is a modern task management web application designed to demonstrate the capabilities of Gemini CLI integration with GitHub workflows.

### Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **Database**: JSON file storage (for simplicity)
- **AI Integration**: Google Gemini CLI
- **CI/CD**: GitHub Actions

## 🎯 Project Goals

1. **Demonstrate Gemini CLI workflows** in a real application
2. **Showcase automated code review** capabilities
3. **Illustrate intelligent issue triage**
4. **Provide conversational AI assistance**

## 🔧 Coding Standards

### JavaScript/Node.js Guidelines

```javascript
// ✅ Good: Use camelCase for variables and functions
const taskManager = new TaskManager();
const addNewTask = (title, description) => {
  /* ... */
};

// ❌ Bad: snake_case or PascalCase for variables
const task_manager = new TaskManager();
const AddNewTask = (title, description) => {
  /* ... */
};
```

### Function Documentation

```javascript
/**
 * Adds a new task to the task list
 * @param {string} title - The task title (required)
 * @param {string} description - The task description (optional)
 * @param {Date} dueDate - The due date (optional)
 * @returns {Object} The created task object
 * @throws {Error} When title is empty or invalid
 */
function addTask(title, description = "", dueDate = null) {
  // Implementation here
}
```

### Error Handling Patterns

```javascript
// ✅ Good: Proper async error handling
async function saveTask(task) {
  try {
    validateTask(task);
    const result = await taskService.save(task);
    return { success: true, data: result };
  } catch (error) {
    logger.error("Failed to save task:", error);
    return { success: false, error: error.message };
  }
}

// ❌ Bad: No error handling
async function saveTask(task) {
  const result = await taskService.save(task);
  return result;
}
```

### Input Validation

```javascript
// ✅ Good: Always validate inputs
function validateTask(task) {
  if (!task || typeof task !== "object") {
    throw new Error("Task must be an object");
  }
  if (!task.title || task.title.trim().length === 0) {
    throw new Error("Task title is required");
  }
  if (task.title.length > 100) {
    throw new Error("Task title must be under 100 characters");
  }
}
```

## 🏗 Architecture Patterns

### Frontend Structure

```
frontend/
├── index.html          # Main application page
├── styles/
│   ├── main.css       # Core styles
│   └── components.css # Component-specific styles
├── scripts/
│   ├── app.js         # Main application logic
│   ├── taskManager.js # Task management module
│   └── utils.js       # Utility functions
└── assets/            # Images, icons, etc.
```

### Backend Structure

```
backend/
├── server.js          # Express server setup
├── routes/
│   ├── tasks.js       # Task-related endpoints
│   └── users.js       # User-related endpoints
├── services/
│   ├── taskService.js # Business logic
│   └── dataService.js # Data persistence
├── middleware/
│   ├── auth.js        # Authentication
│   └── validation.js  # Request validation
└── utils/
    └── logger.js      # Logging utilities
```

### API Design

```javascript
// ✅ Good: RESTful API design
GET    /api/tasks           # Get all tasks
GET    /api/tasks/:id       # Get specific task
POST   /api/tasks           # Create new task
PUT    /api/tasks/:id       # Update task
DELETE /api/tasks/:id       # Delete task

// Response format
{
    "success": true,
    "data": { /* task object */ },
    "error": null,
    "timestamp": "2025-01-15T10:30:00Z"
}
```

## 🔒 Security Guidelines

### Input Sanitization

- **Always sanitize** user inputs before processing
- **Validate data types** and ranges
- **Escape HTML** content to prevent XSS
- **Use parameterized queries** if using databases

### Authentication & Authorization

- **Implement proper session management**
- **Use HTTPS** for all communications
- **Sanitize file uploads** if implemented
- **Rate limit API endpoints**

## 🧪 Testing Standards

### Unit Test Structure

```javascript
// tests/taskManager.test.js
describe("TaskManager", () => {
  describe("addTask", () => {
    it("should add a valid task successfully", () => {
      const task = { title: "Test Task", description: "Test Description" };
      const result = taskManager.addTask(task);
      expect(result.success).toBe(true);
      expect(result.data.id).toBeDefined();
    });

    it("should reject task without title", () => {
      const task = { description: "Test Description" };
      expect(() => taskManager.addTask(task)).toThrow("Task title is required");
    });
  });
});
```

### Test Coverage Expectations

- **Functions**: 90%+ coverage
- **Critical paths**: 100% coverage
- **Error handling**: All error scenarios tested
- **API endpoints**: All routes tested

## 🎯 Code Review Focus Areas

### High Priority Issues

1. **Security vulnerabilities** (XSS, injection attacks)
2. **Memory leaks** and performance issues
3. **Unhandled promise rejections**
4. **Missing input validation**
5. **Improper error handling**

### Medium Priority Issues

1. **Code duplication** and maintainability
2. **Missing documentation**
3. **Inconsistent naming conventions**
4. **Unused variables/functions**
5. **Missing unit tests**

### Low Priority Suggestions

1. **Code optimization** opportunities
2. **Better variable naming**
3. **Code organization** improvements
4. **Additional utility functions**

## 🚀 Performance Guidelines

### Frontend Performance

- **Minimize DOM manipulations**
- **Use event delegation** for dynamic content
- **Implement lazy loading** for large lists
- **Optimize CSS selectors**
- **Use efficient data structures**

### Backend Performance

- **Implement caching** where appropriate
- **Use connection pooling**
- **Optimize database queries**
- **Implement proper pagination**
- **Monitor memory usage**

## 📚 Documentation Requirements

### Code Documentation

- **JSDoc comments** for all public functions
- **README files** for each major module
- **API documentation** with examples
- **Setup and deployment** instructions

### Comment Guidelines

```javascript
// ✅ Good: Explain why, not what
// Cache results to avoid expensive recalculation on subsequent calls
const cachedResult = memoize(expensiveCalculation);

// ❌ Bad: Obvious comments
// Increment counter by 1
counter++;
```

## 🎯 AI Assistant Guidance

When reviewing code or providing assistance:

1. **Focus on the bigger picture** first, then details
2. **Suggest specific improvements** with code examples
3. **Consider security implications** of all changes
4. **Recommend testing approaches** for new features
5. **Maintain consistency** with existing codebase patterns
6. **Prioritize readability** and maintainability
7. **Suggest performance optimizations** when relevant

## 📋 Common Issue Classifications

### Bug Issues

- App crashes or freezes
- Features not working as expected
- Data loss or corruption
- Performance degradation

### Enhancement Issues

- New feature requests
- UI/UX improvements
- Performance optimizations
- Developer experience improvements

### Question Issues

- How-to questions
- Architecture discussions
- Best practice inquiries
- Deployment questions

### Documentation Issues

- Missing documentation
- Outdated instructions
- Unclear explanations
- Example code needed

---

**🤖 This configuration helps Gemini CLI provide more relevant and contextual assistance for the TaskFlow Manager project.**
