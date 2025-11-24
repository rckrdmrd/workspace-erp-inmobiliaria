#!/bin/bash

################################################################################
# GAMILIT Frontend - Auth Forms Quick Start
# This script will install dependencies and setup the authentication forms
################################################################################

echo "=================================="
echo "GAMILIT Frontend - Auth Setup"
echo "=================================="
echo ""

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from apps/frontend directory"
    exit 1
fi

# Step 1: Install missing dependencies
echo "📦 Step 1: Installing missing dependencies..."
echo "   - zod"
echo "   - @hookform/resolvers"
echo ""

npm install zod @hookform/resolvers

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully!"
echo ""

# Step 2: Check if App.tsx exists
echo "📝 Step 2: Checking App.tsx..."
echo ""

if [ -f "src/App.tsx" ]; then
    echo "⚠️  Warning: App.tsx already exists"
    echo ""
    echo "To integrate auth forms, you need to update App.tsx with routing."
    echo "A complete example is available in: src/App.example.tsx"
    echo ""
    echo "Options:"
    echo "  1. Manually copy routing code from App.example.tsx to App.tsx"
    echo "  2. Or replace App.tsx with the example (backup your current file first!):"
    echo "     mv src/App.tsx src/App.backup.tsx"
    echo "     cp src/App.example.tsx src/App.tsx"
    echo ""
else
    echo "📄 App.tsx not found. Copying example..."
    cp src/App.example.tsx src/App.tsx
    echo "✅ App.tsx created from example"
    echo ""
fi

# Step 3: Verify installation
echo "🔍 Step 3: Verifying installation..."
echo ""

# Check if TypeScript compiles
echo "Checking TypeScript compilation..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ TypeScript compilation successful!"
    echo ""
else
    echo ""
    echo "⚠️  TypeScript compilation has errors"
    echo "Please check the errors above and fix them"
    echo ""
fi

# Final instructions
echo "=================================="
echo "🎉 Setup Complete!"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Start development server:"
echo "   npm run dev"
echo ""
echo "2. Visit these routes:"
echo "   http://localhost:5173/login"
echo "   http://localhost:5173/register"
echo "   http://localhost:5173/forgot-password"
echo ""
echo "3. Read the integration guide:"
echo "   cat INTEGRATION_GUIDE.md"
echo ""
echo "4. Test the authentication flow:"
echo "   - Register a new user"
echo "   - Login with credentials"
echo "   - Access protected /dashboard route"
echo ""
echo "=================================="
echo "📚 Documentation:"
echo "=================================="
echo ""
echo "- Integration Guide: INTEGRATION_GUIDE.md"
echo "- Example App.tsx:   src/App.example.tsx"
echo ""
echo "For support, check the integration guide or contact the team."
echo ""
