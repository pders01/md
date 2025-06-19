import express from 'express';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function startServer({ port = 3000, directory = '.', host = 'localhost' }) {
  const app = express();
  
  // Serve static files from the public directory
  app.use('/static', express.static(path.join(__dirname, '../public')));
  
  // Handle markdown files first (before static files)
  app.get('/:filename.md', async (req, res) => {
    try {
      const filePath = path.join(directory, req.params.filename + '.md');
      const markdown = await fs.readFile(filePath, 'utf-8');
      const html = marked(markdown);
      
      const fullHtml = generateHTML(html, req.path);
      res.send(fullHtml);
    } catch (error) {
      console.error(chalk.red(`Error reading file: ${error.message}`));
      res.status(404).send('File not found');
    }
  });
  
  // Handle requests for .md files without extension
  app.get('/:filename', async (req, res, next) => {
    const filename = req.params.filename;
    if (!filename.endsWith('.md')) {
      const mdPath = path.join(directory, `${filename}.md`);
      try {
        await fs.access(mdPath);
        return res.redirect(`/${filename}.md`);
      } catch {
        return next();
      }
    }
    next();
  });
  
  // Handle root path - show directory listing
  app.get('/', async (req, res) => {
    try {
      const files = await fs.readdir(directory);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      if (markdownFiles.length === 0) {
        res.send(generateHTML('<h1>No markdown files found</h1><p>Add some .md files to this directory to get started.</p>', '/'));
        return;
      }
      
      const fileList = markdownFiles.map(file => 
        `<a href="/${file}" class="file-link">${file}</a>`
      ).join('');
      
      const html = `
        <h1>${markdownFiles.length} file${markdownFiles.length === 1 ? '' : 's'}</h1>
        ${fileList}
      `;
      
      res.send(generateHTML(html, '/'));
    } catch (error) {
      console.error(chalk.red(`Error reading directory: ${error.message}`));
      res.status(500).send('Internal server error');
    }
  });
  
  // Serve static files from the specified directory (after markdown handling)
  app.use(express.static(directory));
  
  app.listen(port, host, () => {
    console.log(chalk.green(`✅ Server running at http://${host}:${port}`));
    console.log(chalk.yellow('Press Ctrl+C to stop the server'));
  });
}

function generateHTML(content, currentPath) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentPath === '/' ? 'Markdown Files' : currentPath}</title>
    <link href="/static/tailwind.css" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #ffffff;
            --text-primary: #111827;
            --text-secondary: #374151;
            --border-color: #e5e7eb;
            --link-color: #2563eb;
            --link-hover: #1d4ed8;
            --blockquote-bg: #f8fafc;
            --blockquote-border: #3b82f6;
            --table-header-bg: #f9fafb;
            --table-border: #e5e7eb;
        }
        
        @media (prefers-color-scheme: dark) {
            :root {
                --bg-primary: #111827;
                --text-primary: #f9fafb;
                --text-secondary: #d1d5db;
                --border-color: #4b5563;
                --link-color: #60a5fa;
                --link-hover: #93c5fd;
                --blockquote-bg: #1e293b;
                --blockquote-border: #3b82f6;
                --table-header-bg: #374151;
                --table-border: #4b5563;
            }
        }
        
        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            transition: background-color 0.2s, color 0.2s;
        }
        
        .prose {
            max-width: 65ch;
            margin: 0 auto;
        }
        .prose h1 {
            margin-top: 2rem;
            margin-bottom: 1.5rem;
        }
        .prose h2 {
            margin-top: 1.5rem;
            margin-bottom: 1rem;
        }
        .prose h3 {
            margin-top: 1.25rem;
            margin-bottom: 0.75rem;
        }
        .prose h4 {
            margin-top: 1rem;
            margin-bottom: 0.5rem;
        }
        .prose p {
            margin-bottom: 1.25rem;
        }
        .prose ul, .prose ol {
            margin-bottom: 1.25rem;
        }
        .prose li {
            margin-bottom: 0.25rem;
        }
        .prose blockquote {
            margin: 1.5rem 0;
            padding: 0.75rem 1rem;
            background-color: var(--blockquote-bg);
            border-left: 4px solid var(--blockquote-border);
            border-radius: 0.375rem;
        }
        .prose pre {
            margin: 1.5rem 0;
            padding: 1rem;
        }
        .prose table {
            margin: 1.5rem 0;
            width: 100%;
            border-collapse: collapse;
        }
        .prose th, .prose td {
            padding: 0.75rem;
            border: 1px solid var(--table-border);
        }
        .prose th {
            background-color: var(--table-header-bg);
            font-weight: 600;
            color: var(--text-primary);
        }
        .prose img {
            margin: 1.5rem auto;
            display: block;
        }
        .prose hr {
            margin: 2rem 0;
            border: none;
            border-top: 1px solid var(--border-color);
        }
        .file-link {
            display: block;
            padding: 0.5rem 0;
            color: var(--link-color);
            text-decoration: none;
            border-bottom: 1px solid var(--border-color);
        }
        .file-link:hover {
            color: var(--link-hover);
        }
        .back-link {
            position: fixed;
            top: 1rem;
            left: 1rem;
            padding: 0.5rem 1rem;
            background-color: var(--link-color);
            color: white;
            text-decoration: none;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            opacity: 0.8;
            transition: opacity 0.2s;
        }
        .back-link:hover {
            opacity: 1;
        }
    </style>
</head>
<body>
    ${currentPath !== '/' ? '<a href="/" class="back-link">←</a>' : ''}
    
    <main class="max-w-4xl mx-auto px-4 py-8">
        <div class="prose prose-lg prose-gray dark:prose-invert max-w-none">
            ${content}
        </div>
    </main>
</body>
</html>`;
} 