#!/bin/bash
# TaskFlow Manager - Quick Setup Script
# This script helps you set up the demo environment quickly

set -e

echo "🎯 TaskFlow Manager - Demo Setup"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$NODE_MAJOR" -lt 16 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create basic demo data directory
mkdir -p demo-data

# Check if Git is available
if command -v git &> /dev/null; then
    echo "✅ Git is available"
    
    # Initialize git if not already a git repository
    if [ ! -d ".git" ]; then
        echo "🔧 Initializing Git repository..."
        git init
        git add .
        git commit -m "Initial commit: TaskFlow Manager demo setup"
    fi
else
    echo "⚠️  Git not found. You may want to install Git for version control."
fi

echo ""
echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "=============="
echo ""
echo "1. 🔑 Get your Gemini API Key:"
echo "   • Visit: https://aistudio.google.com/apikey"
echo "   • Create a new API key"
echo "   • Copy the key for the next step"
echo ""
echo "2. 🔐 Configure GitHub Secrets:"
echo "   • Go to your GitHub repository"
echo "   • Settings > Secrets and variables > Actions"
echo "   • Add new secret: GEMINI_API_KEY"
echo "   • Paste your API key as the value"
echo ""
echo "3. 🚀 Start the demo:"
echo "   • Run: npm start"
echo "   • Open: http://localhost:3000"
echo ""
echo "4. 📚 Demo Resources:"
echo "   • Setup Guide: docs/DEMO_SETUP.md"
echo "   • Commands: docs/DEMO_COMMANDS.md"
echo "   • Example Issues: docs/example-issues/"
echo ""
echo "🎯 You're ready to demonstrate Gemini CLI workflows!"
echo ""
echo "💡 Pro tip: Start with 'npm run dev' for development mode with auto-reload"
