# Markdown Server CLI

A simple and beautiful CLI tool that serves markdown files as HTML with Tailwind CSS styling.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Start the server:**
   ```bash
   pnpm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Basic Commands

```bash
# Start with default settings (port 3000, current directory)
node cli.js

# Use a different port
node cli.js --port 8080

# Serve from a specific directory
node cli.js --directory ./docs

# Use a different host
node cli.js --host 0.0.0.0
```

### Command Line Options

| Option | Description | Default |
|--------|-------------|---------|
| `-p, --port <port>` | Port to run the server on | `3000` |
| `-d, --directory <dir>` | Directory to serve markdown files from | `.` (current directory) |
| `-h, --host <host>` | Host to bind the server to | `localhost` |

### Examples

```bash
# Serve markdown files from current directory
node cli.js

# Serve from a documentation folder on port 8080
node cli.js --port 8080 --directory ./docs

# Make server accessible from other devices
node cli.js --host 0.0.0.0 --port 3000
```

## 🌟 Features

- **Beautiful Styling**: Modern, responsive design with Tailwind CSS
- **Directory Listing**: Automatically lists all markdown files
- **Smart URLs**: Access files with or without `.md` extension
- **Full Markdown Support**: Headers, lists, code blocks, tables, links, images, and more
- **Fast & Lightweight**: Built with Express.js
- **Cross-platform**: Works on Windows, macOS, and Linux

## 📁 File Access

Once the server is running:

- **Homepage**: `http://localhost:3000/` - Shows directory listing
- **Markdown files**: `http://localhost:3000/filename.md` - View any markdown file
- **Short URLs**: `http://localhost:3000/filename` - Same as above (extension optional)

## 🎨 Styling

The server uses Tailwind CSS for beautiful, responsive styling:

- Clean, modern design
- Responsive layout that works on all devices
- Syntax highlighting for code blocks
- Proper typography and spacing
- Navigation with breadcrumbs

## 📦 Dependencies

- **express**: Web server framework
- **marked**: Markdown parser
- **commander**: CLI argument parsing
- **chalk**: Terminal color output
- **tailwindcss**: Styling (via CDN)

## 🔧 Development

### Project Structure

```
md-server/
├── cli.js              # CLI entry point
├── server.js           # Express server logic
├── package.json        # Dependencies and scripts
├── README.md           # Main documentation
├── example.md          # Example markdown file
└── PROJECT_README.md   # This file
```

### Running in Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Or run directly
node cli.js --port 3000
```

## 📝 Supported Markdown Features

- **Headers**: All levels (H1-H6)
- **Lists**: Ordered and unordered, with nesting
- **Code**: Inline code and code blocks with syntax highlighting
- **Links**: Internal and external links
- **Images**: Local and remote images
- **Tables**: Full table support with styling
- **Blockquotes**: Styled quote blocks
- **Horizontal Rules**: Divider lines
- **Bold/Italic**: Text formatting
- **Mixed Content**: All elements work together

## 🎯 Use Cases

- **Documentation**: Serve project documentation
- **Blog**: Quick markdown blog setup
- **Notes**: View personal markdown notes
- **Presentations**: Convert markdown to slides
- **Portfolio**: Showcase markdown projects

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

MIT License - feel free to use this project for your own needs! 