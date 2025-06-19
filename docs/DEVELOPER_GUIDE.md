# Markdown Server CLI

A simple and beautiful CLI tool that serves markdown files as HTML with Tailwind CSS styling.

---

_This project was **vibe coded** with AI pair programming!_

---

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build the CLI (single file):**
   ```bash
   pnpm run build
   ```

   This will generate `dist/md-server.js`.

3. **Start the server:**
   ```bash
   node dist/md-server.js
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## 📖 Usage

### Basic Commands

```bash
# Start with default settings (port 3000, current directory)
node dist/md-server.js

# Use a different port
node dist/md-server.js --port 8080

# Serve from a specific directory
node dist/md-server.js --directory ./docs

# Use a different host
node dist/md-server.js --host 0.0.0.0
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
node dist/md-server.js

# Serve from a documentation folder on port 8080
node dist/md-server.js --port 8080 --directory ./docs

# Make server accessible from other devices
node dist/md-server.js --host 0.0.0.0 --port 3000
```

## 🌟 Features

- **Beautiful Styling**: Modern, responsive design with Tailwind CSS
- **Directory Listing**: Automatically lists all markdown files
- **Smart URLs**: Access files with or without `.md` extension
- **Full Markdown Support**: Headers, lists, code blocks, tables, links, images, and more
- **Fast & Lightweight**: Built with Express.js
- **Cross-platform**: Works on Windows, macOS, and Linux
- **Single-file CLI**: Easy to install and distribute
- **Vite-powered**: Modern build and dev workflow

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
- **tailwindcss**: Styling
- **vite**: Bundler for dev and production

## 🛠 Development

### Project Structure

```
md-server/
├── cli.js              # CLI entry point
├── src/
│   ├── server.js       # Express server logic
│   └── styles/
│       └── tailwind.css # Tailwind source styles
├── public/
│   ├── styles.css      # Custom styles
│   ├── template.html   # HTML template
│   ├── tailwind.css    # Built Tailwind CSS
│   ├── prism.js        # Syntax highlighting
│   ├── prism-light.css # Light theme
│   └── prism-dark.css  # Dark theme (twilight)
├── tailwind.config.js  # Tailwind configuration
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies and scripts
```

### Running in Development

```bash
# Install dependencies
pnpm install

# Build CSS
pnpm run build:css

# Start development server
pnpm run dev
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