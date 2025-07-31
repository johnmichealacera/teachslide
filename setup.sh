#!/bin/bash

echo "🎓 Presentation Generator Setup"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "🔑 Creating .env.local file..."
    echo "# Groq API Configuration" > .env.local
    echo "GROQ_API_KEY=your_groq_api_key_here" >> .env.local
    echo ""
    echo "⚠️  Please edit .env.local and add your Groq API key"
    echo "   Get your API key from: https://console.groq.com/"
else
    echo "✅ .env.local already exists"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
echo "1. Add your Groq API key to .env.local"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "Happy teaching! 📚"
else
    echo "❌ Build failed. Please check the error messages above."
    exit 1
fi 