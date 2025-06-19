#!/bin/bash

# md-server uninstallation script
# This script removes the global symlink for the md-server CLI

set -e

echo "🗑️  Uninstalling md-server..."

# Remove symlink
if [ -L "/usr/local/bin/md-server" ]; then
    echo "🔗 Removing global symlink..."
    sudo rm /usr/local/bin/md-server
    echo "✅ Uninstallation complete!"
else
    echo "ℹ️  md-server is not installed globally"
fi 