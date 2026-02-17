#!/bin/bash

# 🚀 USF BUAN Planner - Automated Vercel Deployment Setup
# This script prepares your project for Vercel deployment

echo "🎓 USF Business Analytics Course Planner - Deployment Setup"
echo "========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'.' -f1 | cut -d'v' -f2)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION detected. Please upgrade to Node.js 18+."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Create project directory structure
echo "📁 Creating project structure..."
mkdir -p pages components public

# Install dependencies
echo "📦 Installing dependencies..."
npm init -y > /dev/null 2>&1

# Update package.json with correct dependencies
cat > package.json << 'EOL'
{
  "name": "usf-buan-prerequisite-planner",
  "version": "1.0.0",
  "description": "University of San Francisco Business Analytics Course Prerequisite Planner",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "keywords": [
    "university-of-san-francisco",
    "business-analytics",
    "course-planner",
    "prerequisite-map",
    "academic-planning"
  ],
  "author": "University of San Francisco - McLaren School of Management",
  "license": "MIT"
}
EOL

echo "✅ Package.json configured"

# Install packages
echo "📥 Installing npm packages..."
npm install --silent

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies. Check your internet connection."
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Verify all required files exist
echo "🔍 Verifying project files..."

REQUIRED_FILES=(
    "next.config.js"
    "vercel.json"
    "pages/index.js"
    "pages/_app.js"
    "components/PrereqPlanner.jsx"
    "README.md"
)

MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo "❌ Missing required files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    echo ""
    echo "Please ensure all project files are in the current directory."
    exit 1
fi

echo "✅ All required files found"

# Test build locally
echo "🔨 Testing local build..."
npm run build > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Local build failed. Check your component code for errors."
    echo "Run 'npm run build' to see detailed error messages."
    exit 1
fi

echo "✅ Local build successful"

# Check for Vercel CLI
if command -v vercel &> /dev/null; then
    VERCEL_CLI_AVAILABLE=true
    echo "✅ Vercel CLI detected"
else
    VERCEL_CLI_AVAILABLE=false
    echo "ℹ️  Vercel CLI not installed (optional)"
fi

echo ""
echo "🎉 Setup Complete! Your project is ready for deployment."
echo ""
echo "Next Steps:"
echo "==========="
echo ""

if [ "$VERCEL_CLI_AVAILABLE" = true ]; then
    echo "Option 1: Deploy with Vercel CLI (Quick)"
    echo "  1. vercel login"
    echo "  2. vercel"
    echo "  3. Follow the prompts"
    echo ""
fi

echo "Option 2: Deploy via GitHub + Vercel (Recommended)"
echo "  1. Create GitHub repository"
echo "  2. Upload these files to GitHub"
echo "  3. Connect repository to Vercel"
echo "  4. Auto-deploy! ✨"
echo ""

echo "📖 Full deployment guide: See DEPLOYMENT_GUIDE.md"
echo ""

# Display project info
echo "Project Information:"
echo "==================="
echo "📁 Project Directory: $(pwd)"
echo "📦 Dependencies: $(npm list --depth=0 2>/dev/null | grep -c '├\|└')"
echo "📄 Pages: $(ls pages/ | wc -l)"
echo "🧩 Components: $(ls components/ | wc -l)"
echo "📊 Bundle Size: $(du -sh node_modules/ 2>/dev/null | cut -f1)B"
echo ""

# Generate deployment info file
cat > deployment-info.txt << EOL
USF BUAN Prerequisite Planner - Deployment Information
======================================================

Generated: $(date)
Node.js Version: $(node -v)
NPM Version: $(npm -v)

Project Structure:
- pages/index.js (Homepage)
- pages/_app.js (App wrapper)  
- components/PrereqPlanner.jsx (Main component)
- package.json (Dependencies)
- next.config.js (Next.js config)
- vercel.json (Vercel config)

Deployment URLs:
- GitHub: https://github.com/YOUR_USERNAME/usf-buan-prerequisite-planner
- Vercel: https://usf-buan-planner-XXXX.vercel.app

Notes:
- All dependencies installed
- Local build tested successfully
- Ready for Vercel deployment
- PNG export functionality included
- Responsive design implemented
EOL

echo "💾 Deployment info saved to: deployment-info.txt"
echo ""
echo "🚀 Ready to deploy! Good luck with your USF BUAN Course Planner!"
