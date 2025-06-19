# Markdown Server

A simple CLI tool that serves markdown files as HTML with beautiful Tailwind CSS styling.

## Features

- 🚀 **Fast & Lightweight**: Built with Express.js
- 🎨 **Beautiful Styling**: Uses Tailwind CSS for modern, responsive design
- 📁 **Directory Listing**: Automatically lists all markdown files in the directory
- 🔗 **Smart URLs**: Access files with or without the `.md` extension
- 📱 **Responsive**: Works great on desktop and mobile devices

## Usage

### Installation

```bash
pnpm install
```

### Running the Server

```bash
# Start with default settings (port 3000, current directory)
pnpm start

# Or run directly
node cli.js

# Custom port and directory
node cli.js --port 8080 --directory ./docs
```

### Command Line Options

- `-p, --port <port>`: Port to run the server on (default: 3000)
- `-d, --directory <dir>`: Directory to serve markdown files from (default: current directory)
- `-h, --host <host>`: Host to bind the server to (default: localhost)

## Examples

### Basic Usage

```bash
# Serve markdown files from current directory
md-server

# Serve from a specific directory
md-server --directory ./my-docs

# Use a different port
md-server --port 8080
```

### File Access

Once the server is running, you can access your markdown files at:

- `http://localhost:3000/` - Directory listing
- `http://localhost:3000/README.md` - View README.md
- `http://localhost:3000/README` - Same as above (extension optional)

## Markdown Features

The server supports all standard markdown features:

### Headers

# H1 Header
## H2 Header
### H3 Header

### Lists

- Unordered list item 1
- Unordered list item 2
  - Nested item
  - Another nested item

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Code

Inline code: `console.log('Hello, World!')`

```javascript
// Code block
function greet(name) {
  return `Hello, ${name}!`;
}
```

### Links and Images

[Visit GitHub](https://github.com)

![Example Image](https://via.placeholder.com/300x200)

### Tables

| Feature | Description | Status |
|---------|-------------|--------|
| Markdown Support | Full markdown parsing | ✅ |
| Tailwind Styling | Beautiful, responsive design | ✅ |
| Directory Listing | Auto-generated file index | ✅ |
| CLI Interface | Easy command-line usage | ✅ |

### Blockquotes

> This is a blockquote. It can contain multiple lines and is styled with a left border.

## Development

### Project Structure

```
md-server/
├── cli.js          # CLI entry point
├── server.js       # Express server logic
├── package.json    # Dependencies and scripts
└── README.md       # This file
```

### Dependencies

- **express**: Web server framework
- **marked**: Markdown parser
- **commander**: CLI argument parsing
- **chalk**: Terminal color output
- **tailwindcss**: Styling (via CDN)

## License

MIT License - feel free to use this project for your own needs! 