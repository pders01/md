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
        `<li><a href="/${file}" class="text-blue-600 hover:text-blue-800 underline font-medium">${file}</a></li>`
      ).join('');
      
      const html = `
        <h1>Available Markdown Files</h1>
        <p class="text-gray-600 mb-6">Click on any file below to view it with beautiful typography:</p>
        <ul class="space-y-3">
          ${fileList}
        </ul>
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
    <title>Markdown Viewer - ${currentPath}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    typography: {
                        DEFAULT: {
                            css: {
                                maxWidth: 'none',
                                color: '#374151',
                                a: {
                                    color: '#2563eb',
                                    '&:hover': {
                                        color: '#1d4ed8',
                                    },
                                },
                                h1: {
                                    color: '#111827',
                                    fontWeight: '700',
                                },
                                h2: {
                                    color: '#1f2937',
                                    fontWeight: '600',
                                },
                                h3: {
                                    color: '#1f2937',
                                    fontWeight: '600',
                                },
                                h4: {
                                    color: '#1f2937',
                                    fontWeight: '600',
                                },
                                code: {
                                    color: '#dc2626',
                                    backgroundColor: '#f3f4f6',
                                    padding: '0.125rem 0.25rem',
                                    borderRadius: '0.25rem',
                                    fontSize: '0.875rem',
                                },
                                'code::before': {
                                    content: '""',
                                },
                                'code::after': {
                                    content: '""',
                                },
                                pre: {
                                    backgroundColor: '#1f2937',
                                    color: '#f9fafb',
                                    overflow: 'auto',
                                    borderRadius: '0.5rem',
                                },
                                'pre code': {
                                    backgroundColor: 'transparent',
                                    padding: '0',
                                    color: 'inherit',
                                },
                                blockquote: {
                                    borderLeftColor: '#d1d5db',
                                    fontStyle: 'italic',
                                },
                                table: {
                                    fontSize: '0.875rem',
                                },
                                thead: {
                                    borderBottomColor: '#d1d5db',
                                },
                                'thead th': {
                                    color: '#374151',
                                    fontWeight: '600',
                                },
                                'tbody tr': {
                                    borderBottomColor: '#e5e7eb',
                                },
                                'tbody tr:last-child': {
                                    borderBottomWidth: '0',
                                },
                                img: {
                                    borderRadius: '0.5rem',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                },
                            },
                        },
                    },
                },
            },
        }
    </script>
    <style>
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
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
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
            border: 1px solid #e5e7eb;
        }
        .prose th {
            background-color: #f9fafb;
            font-weight: 600;
        }
        .prose img {
            margin: 1.5rem auto;
            display: block;
        }
        .prose hr {
            margin: 2rem 0;
            border: none;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <nav class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-4xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                    </div>
                    <h1 class="text-xl font-semibold text-gray-900">Markdown Viewer</h1>
                </div>
                <a href="/" class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Back to files
                </a>
            </div>
        </div>
    </nav>
    
    <main class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-8">
                <article class="prose prose-lg prose-blue max-w-none">
                    ${content}
                </article>
            </div>
        </div>
    </main>
    
    <footer class="max-w-4xl mx-auto px-4 py-6 text-center">
        <div class="text-gray-500 text-sm">
            <p class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                <span>Powered by md-server</span>
            </p>
        </div>
    </footer>
</body>
</html>`;
} 