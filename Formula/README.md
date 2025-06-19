# Homebrew Tap for md-server

This tap provides the `md-server` CLI tool for easy installation via Homebrew.

## Installation

```bash
# Add the tap
brew tap pders01/md

# Install md-server
brew install md-server
```

## Usage

After installation, you can use `md-server` from anywhere:

```bash
# Start with default settings (port 3000, current directory)
md-server

# Custom port and directory
md-server --port 8080 --directory ./docs

# Show help
md-server --help
```

## What is md-server?

`md-server` is a simple CLI tool that serves markdown files as HTML with beautiful Tailwind CSS styling and automatic dark/light theme support.

### Features

- 🚀 Fast & lightweight Express.js server
- 🎨 Beautiful Tailwind CSS styling with typography plugin
- 🌙 Automatic dark/light theme switching
- 📁 Directory listing with navigation
- 💻 Syntax highlighting for code blocks
- 📱 Responsive design for all devices

## Documentation

For more information, visit the [main repository](https://github.com/pders01/md). 