#!/bin/bash

echo "🚀 Analytics SDK Quick Start"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm test

if [ $? -ne 0 ]; then
    echo "⚠️  Some tests failed, but continuing..."
else
    echo "✅ All tests passed"
fi

echo ""

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "✅ Build successful"
echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Update package.json with your organization name"
echo "  2. Update API endpoint in src/client.ts"
echo "  3. Try the demo: open examples/demo.html in your browser"
echo "  4. Read GETTING_STARTED.md for usage examples"
echo "  5. Read DEPLOYMENT.md for publishing instructions"
echo ""
echo "Available commands:"
echo "  npm test          - Run tests"
echo "  npm run build     - Build the SDK"
echo "  npm run dev       - Build in watch mode"
echo "  npm run lint      - Lint the code"
echo ""
