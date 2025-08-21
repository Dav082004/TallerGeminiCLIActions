# 🤖 Gemini CLI GitHub Actions

[![Gemini CLI](https://img.shields.io/badge/Gemini_CLI-Powered-blue)](https://github.com/google-github-actions/run-gemini-cli)
[![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-Automated-green)](https://github.com/features/actions)

> **3 GitHub Actions workflows using Gemini CLI to automate development tasks with AI**

## 🎯 Available Workflows

### 🏷️ **Issue Triage** (`gemini-issue-automated-triage.yml`)
- Automatically classifies new issues
- Intelligently assigns labels and priorities
- **Manual command:** `@gemini-cli /triage` (Issues and PRs)

### 🔍 **PR Review** (`gemini-pr-review.yml`)
- Automatically reviews code in Pull Requests
- Detects bugs and suggests improvements
- **Manual command:** `@gemini-cli /review` (PRs and Issues)

### 💬 **Gemini Assistant** (`gemini-assistant.yml`)
- General assistant for technical questions
- **Usage:** `@gemini-cli` + your question (Issues and PRs)

## 🚀 Quick Setup

## 🚀 Quick Setup

### 🔑 **1. Get API Key**
- Go to [Google AI Studio](https://aistudio.google.com/)
- Create a free Gemini API Key
- Copy the generated key

### ⚙️ **2. Configure GitHub**
- Fork this repository
- Go to `Settings > Secrets and variables > Actions`
- Add: `GEMINI_API_KEY = your_api_key`

### ✅ **3. Test the Workflows**

#### **Triage (Classification):**
```
@gemini-cli /triage
```
*Works in Issues and PRs*

#### **Review (Code Review):**
```
@gemini-cli /review
```
*Works in PRs and Issues with code*

#### **Assistant (General Questions):**
```
@gemini-cli How to optimize this code?
@gemini-cli What design pattern to use here?
```
*Works in Issues and PRs*

## 📋 Available Commands

| Command | Issues | PRs | Description |
|---------|:------:|:---:|-------------|
| `@gemini-cli /triage` | ✅ | ✅ | Classify and categorize |
| `@gemini-cli /review` | ✅ | ✅ | Review code |
| `@gemini-cli` + question | ✅ | ✅ | General assistant |

## 🎭 Demo Application

### **Simple Frontend**
- ✅ **Vanilla JavaScript**
- 📱 **Basic HTML/CSS**
- 💾 **No dependencies**
- 🎨 **Responsive design**

Includes code examples to test review and triage workflows.

## 🎓 Workshop Usage

**Perfect for:**
- 👨‍🏫 GitHub Actions demonstrations
- 🤖 AI integration in development
- ⚡ Workflow automation
- 🚀 Practical Gemini CLI examples

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

- ✅ **Complete Frontend**: HTML, CSS, JavaScript
- 📱 **Responsive**: Works on mobile devices
- 💾 **Persistence**: Uses localStorage
- 🧪 **Example Code**: For testing workflows

#### **Project Structure:**
```
frontend/
├── index.html          # Main page
├── styles/
│   ├── main.css        # Main styles
│   └── components.css  # UI components
└── scripts/
    ├── app.js          # Main logic
    ├── taskManager.js  # Task management
    └── utils.js        # Utilities
```

## � Documentation

- 🎯 [**Complete Demos**](docs/DEMOS-WORKFLOWS.md) - Step-by-step examples
- ⚙️ [**Workflow Configuration**](docs/) - Technical documentation

## �️ Use Cases

### **For Development:**
- 🔍 **Automatic Code Review** - Catch bugs before merge
- 🏷️ **Issue Classification** - Organize automatically
- 💬 **Technical Assistant** - Answer questions instantly

### **For Learning:**
- 📚 **Practical Examples** - Real working workflows
- 🤖 **Applied AI** - Practical use of Gemini CLI
- 📖 **Documented Code** - Easy to understand and modify

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

---

**🎯 Ready to try it?**

1. Fork this repository
2. Configure `GEMINI_API_KEY`
3. Test commands in Issues and PRs  
4. Experiment with the demo app!

Welcome to AI-assisted development! 🚀✨
