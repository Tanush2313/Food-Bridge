#!/bin/bash

# The Food Bridge - Quick Start Script
# Run this script to start the development server

cd "$(dirname "$0")"

echo "🌉 The Food Bridge - Starting Development Server"
echo "=================================================="
echo ""
echo "Installing dependencies (if needed)..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🚀 Starting development server..."
echo ""
echo "Opening http://localhost:3000 in your browser..."
echo ""

npm run dev
