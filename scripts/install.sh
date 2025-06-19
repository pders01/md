#!/bin/bash

# md-server installation script
# This script creates a global symlink for the md-server CLI

set -e

echo "🚀 Installing md-server..."

# Check if we're in the right directory
if [ ! -f "cli.js" ] || [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the md-server project root directory"
    exit 1
fi

# Build the CLI if it doesn't exist
if [ ! -f "dist/md-server.js" ]; then
    echo "📦 Building CLI..."
    if command -v pnpm &> /dev/null; then
        pnpm run build
    else
        echo "❌ Error: pnpm is required. Please install it first: npm install -g pnpm"
        exit 1
    fi
fi

# Create symlink
echo "🔗 Creating global symlink..."
sudo ln -sf "$(pwd)/dist/md-server.js" /usr/local/bin/md-server
sudo chmod +x /usr/local/bin/md-server

echo "✅ Installation complete!"
echo ""
echo "You can now use md-server from anywhere:"
echo "  md-server --port 3000"
echo "  md-server --help"
echo ""
echo "To uninstall, run: sudo rm /usr/local/bin/md-server" 