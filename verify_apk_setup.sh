#!/bin/bash

# APK Build Setup Verification Script
# سكريبت التحقق من إعداد بناء APK

echo "========================================="
echo "APK Build Setup Verification"
echo "التحقق من إعداد بناء APK"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "1. Checking Node.js..."
echo "   التحقق من Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
fi
echo ""

# Check npm
echo "2. Checking npm..."
echo "   التحقق من npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
fi
echo ""

# Check Java
echo "3. Checking Java JDK..."
echo "   التحقق من Java JDK..."
if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✓${NC} Java installed: $JAVA_VERSION"
else
    echo -e "${RED}✗${NC} Java not found"
fi
echo ""

# Check Android SDK
echo "4. Checking Android SDK..."
echo "   التحقق من Android SDK..."
if [ -n "$ANDROID_HOME" ]; then
    echo -e "${GREEN}✓${NC} ANDROID_HOME set: $ANDROID_HOME"
else
    echo -e "${YELLOW}⚠${NC} ANDROID_HOME not set (needed for building APK)"
fi
echo ""

# Check Capacitor dependencies
echo "5. Checking Capacitor installation..."
echo "   التحقق من تثبيت Capacitor..."
if [ -d "node_modules/@capacitor/core" ]; then
    echo -e "${GREEN}✓${NC} @capacitor/core installed"
else
    echo -e "${RED}✗${NC} @capacitor/core not found"
fi

if [ -d "node_modules/@capacitor/android" ]; then
    echo -e "${GREEN}✓${NC} @capacitor/android installed"
else
    echo -e "${RED}✗${NC} @capacitor/android not found"
fi
echo ""

# Check configuration files
echo "6. Checking configuration files..."
echo "   التحقق من ملفات التكوين..."
if [ -f "app.json" ]; then
    echo -e "${GREEN}✓${NC} app.json exists"
else
    echo -e "${RED}✗${NC} app.json not found"
fi

if [ -f "capacitor.config.ts" ]; then
    echo -e "${GREEN}✓${NC} capacitor.config.ts exists"
else
    echo -e "${RED}✗${NC} capacitor.config.ts not found"
fi
echo ""

# Check Android platform
echo "7. Checking Android platform..."
echo "   التحقق من منصة Android..."
if [ -d "android" ]; then
    echo -e "${GREEN}✓${NC} android/ directory exists"
    
    if [ -f "android/app/build.gradle" ]; then
        echo -e "${GREEN}✓${NC} Android project properly configured"
    else
        echo -e "${RED}✗${NC} Android project incomplete"
    fi
else
    echo -e "${RED}✗${NC} android/ directory not found"
fi
echo ""

# Check build directory
echo "8. Checking build output..."
echo "   التحقق من مخرجات البناء..."
if [ -d "dist/public" ]; then
    echo -e "${GREEN}✓${NC} dist/public exists (web build ready)"
else
    echo -e "${YELLOW}⚠${NC} dist/public not found (run 'npm run build' first)"
fi
echo ""

# Summary
echo "========================================="
echo "Summary | الملخص"
echo "========================================="
echo ""
echo "Configuration files:"
echo "ملفات التكوين:"
echo "  • app.json"
echo "  • capacitor.config.ts"
echo "  • android/ (complete Android project)"
echo ""
echo "Documentation:"
echo "الوثائق:"
echo "  • APK_BUILD_GUIDE.md (full guide)"
echo "  • QUICK_START_APK.md (quick start)"
echo "  • APK_BUILD_CHECKLIST.md (checklist)"
echo ""
echo "Build commands:"
echo "أوامر البناء:"
echo "  • npm run build              (build web)"
echo "  • npm run cap:sync           (sync to Android)"
echo "  • npm run cap:build:android  (build debug APK)"
echo ""
echo -e "${GREEN}✓ Setup verification complete!${NC}"
echo -e "${GREEN}✓ اكتمل التحقق من الإعداد!${NC}"
echo ""
