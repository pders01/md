import express from 'express';
import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if we're in bundled mode by checking if we're running from a bundled location
const isBundled = __dirname.includes('Cellar') || __dirname.includes('dist');

export function startServer({ port = 3000, directory = '.', host = 'localhost' }) {
  const app = express();
  
  if (isBundled) {
    // In bundled mode, serve static assets from the correct location
    let staticPath;
    if (__dirname.includes('Cellar')) {
      // Homebrew installation - assets are in libexec
      staticPath = path.join(__dirname, '../libexec/public');
    } else {
      // Local bundled development - assets are in dist/public
      staticPath = path.join(__dirname, 'public');
    }
    app.use('/static', express.static(staticPath));
  } else {
    // Serve static files from the public directory (development mode)
    app.use('/static', express.static(path.join(__dirname, '../public')));
  }
  
  // Handle markdown files first (before static files)
  app.get('/:filename.md', async (req, res) => {
    try {
      const filePath = path.join(directory, req.params.filename + '.md');
      const markdown = await fs.readFile(filePath, 'utf-8');
      const html = marked(markdown);
      
      const fullHtml = await generateHTML(html, req.path, true);
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
  app.get('/', async (_, res) => {
    try {
      const files = await fs.readdir(directory);
      const markdownFiles = [];
      const directories = [];
      
      for (const file of files) {
        const filePath = path.join(directory, file);
        let stat;
        try {
          stat = await fs.lstat(filePath);
        } catch {
          continue; // skip unreadable files
        }

        if (stat.isSymbolicLink()) {
          try {
            stat = await fs.stat(filePath); // follow the symlink
          } catch {
            continue; // skip broken symlinks
          }
        }

        // Now stat refers to the target (if symlink), or the file itself (if not)
        if (stat.isDirectory()) {
          // Check if directory contains markdown files
          try {
            const subFiles = await fs.readdir(filePath);
            const hasMarkdown = subFiles.some(subFile => subFile.endsWith('.md'));
            if (hasMarkdown) {
              directories.push(file);
            }
          } catch {
            // Skip directories we can't read
          }
        } else if (file.endsWith('.md')) {
          markdownFiles.push(file);
        }
      }
      
      if (markdownFiles.length === 0 && directories.length === 0) {
        const html = await generateHTML('<h1>No markdown files found</h1><p>Add some .md files to this directory to get started.</p>', '/', false);
        res.send(html);
        return;
      }
      
      let content = `<h1>${path.resolve(directory)}</h1>`;
      
      if (markdownFiles.length > 0) {
        content += `<h2>Files (${markdownFiles.length})</h2>`;
        const fileList = markdownFiles.map(file => 
          `<a href="/${file}" class="file-link">${file}</a>`
        ).join('');
        content += fileList;
      }
      
      if (directories.length > 0) {
        content += `<h2>Directories (${directories.length})</h2>`;
        const dirList = directories.map(dir => 
          `<a href="/${dir}/" class="file-link">📁 ${dir}/</a>`
        ).join('');
        content += dirList;
      }
      
      const html = await generateHTML(content, '/', false);
      res.send(html);
    } catch (error) {
      console.error(chalk.red(`Error reading directory: ${error.message}`));
      res.status(500).send('Internal server error');
    }
  });
  
  // Handle subdirectory paths
  app.get('/:dir/*', async (req, res) => {
    const subDir = req.params.dir;
    const subPath = req.params[0];
    const fullPath = path.join(directory, subDir, subPath);
    
    try {
      let stat;
      try {
        stat = await fs.lstat(fullPath);
      } catch {
        return res.status(404).send('File not found');
      }

      if (stat.isSymbolicLink()) {
        try {
          stat = await fs.stat(fullPath); // follow the symlink
        } catch {
          return res.status(404).send('File not found');
        }
      }

      // Now stat refers to the target (if symlink), or the file itself (if not)
      if (stat.isDirectory()) {
        // Show directory listing
        const files = await fs.readdir(fullPath);
        const markdownFiles = [];
        const directories = [];
        
        for (const file of files) {
          const filePath = path.join(fullPath, file);
          let fileStat;
          try {
            fileStat = await fs.lstat(filePath);
          } catch {
            continue; // skip unreadable files
          }

          if (fileStat.isSymbolicLink()) {
            try {
              fileStat = await fs.stat(filePath); // follow the symlink
            } catch {
              continue; // skip broken symlinks
            }
          }

          // Now fileStat refers to the target (if symlink), or the file itself (if not)
          if (fileStat.isDirectory()) {
            // Check if directory contains markdown files
            try {
              const subFiles = await fs.readdir(filePath);
              const hasMarkdown = subFiles.some(subFile => subFile.endsWith('.md'));
              if (hasMarkdown) {
                directories.push(file);
              }
            } catch {
              // Skip directories we can't read
            }
          } else if (file.endsWith('.md')) {
            markdownFiles.push(file);
          }
        }
        let content = `<h1>${fullPath}</h1>`;
        
        if (markdownFiles.length > 0) {
          content += `<h2>Files (${markdownFiles.length})</h2>`;
          const fileList = markdownFiles.map(file => 
            `<a href="/${subDir}/${subPath}/${file}" class="file-link">${file}</a>`
          ).join('');
          content += fileList;
        }
        
        if (directories.length > 0) {
          content += `<h2>Directories (${directories.length})</h2>`;
          const dirList = directories.map(dir => 
            `<a href="/${subDir}/${subPath}/${dir}/" class="file-link">📁 ${dir}/</a>`
          ).join('');
          content += dirList;
        }
        
        const html = await generateHTML(content, `/${subDir}/${subPath}/`, true);
        res.send(html);
      } else if (fullPath.endsWith('.md')) {
        // Serve markdown file
        const markdown = await fs.readFile(fullPath, 'utf-8');
        const html = marked(markdown);
        const fullHtml = await generateHTML(html, req.path, true);
        res.send(fullHtml);
      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error(chalk.red(`Error reading path: ${error.message}`));
      res.status(404).send('File not found');
    }
  });
  
  // Handle subdirectory root paths (e.g., /docs/)
  app.get('/:dir/', async (req, res) => {
    const subDir = req.params.dir;
    const fullPath = path.join(directory, subDir);
    
    try {
      let stat;
      try {
        stat = await fs.lstat(fullPath);
      } catch {
        return res.status(404).send('Directory not found');
      }

      if (stat.isSymbolicLink()) {
        try {
          stat = await fs.stat(fullPath); // follow the symlink
        } catch {
          return res.status(404).send('Directory not found');
        }
      }

      // Now stat refers to the target (if symlink), or the directory itself (if not)
      if (stat.isDirectory()) {
        // Show directory listing
        const files = await fs.readdir(fullPath);
        const markdownFiles = [];
        const directories = [];
        
        for (const file of files) {
          const filePath = path.join(fullPath, file);
          let fileStat;
          try {
            fileStat = await fs.lstat(filePath);
          } catch {
            continue; // skip unreadable files
          }

          if (fileStat.isSymbolicLink()) {
            try {
              fileStat = await fs.stat(filePath); // follow the symlink
            } catch {
              continue; // skip broken symlinks
            }
          }

          // Now fileStat refers to the target (if symlink), or the file itself (if not)
          if (fileStat.isDirectory()) {
            // Check if directory contains markdown files
            try {
              const subFiles = await fs.readdir(filePath);
              const hasMarkdown = subFiles.some(subFile => subFile.endsWith('.md'));
              if (hasMarkdown) {
                directories.push(file);
              }
            } catch {
              // Skip directories we can't read
            }
          } else if (file.endsWith('.md')) {
            markdownFiles.push(file);
          }
        }
        
        let content = `<h1>${fullPath}</h1>`;
        
        if (markdownFiles.length > 0) {
          content += `<h2>Files (${markdownFiles.length})</h2>`;
          const fileList = markdownFiles.map(file => 
            `<a href="/${subDir}/${file}" class="file-link">${file}</a>`
          ).join('');
          content += fileList;
        }
        
        if (directories.length > 0) {
          content += `<h2>Directories (${directories.length})</h2>`;
          const dirList = directories.map(dir => 
            `<a href="/${subDir}/${dir}/" class="file-link">📁 ${dir}/</a>`
          ).join('');
          content += dirList;
        }
        
        const html = await generateHTML(content, `/${subDir}/`, true);
        res.send(html);
      } else {
        res.status(404).send('Directory not found');
      }
    } catch (error) {
      console.error(chalk.red(`Error reading directory: ${error.message}`));
      res.status(404).send('Directory not found');
    }
  });
  
  // Serve static files from the specified directory (after markdown handling)
  app.use(express.static(directory));
  
  app.listen(port, host, () => {
    console.log(chalk.green(`✅ Server running at http://${host}:${port}`));
    console.log(chalk.yellow('Press Ctrl+C to stop the server'));
  });
}

async function generateHTML(content, currentPath, showBackButton = false) {
  let template;
  
  try {
    if (isBundled) {
      // In bundled mode, read from the correct location
      let templatePath;
      if (__dirname.includes('Cellar')) {
        // Homebrew installation - template is in libexec
        templatePath = path.join(__dirname, '../libexec/template.html');
      } else {
        // Local bundled development - template is in dist
        templatePath = path.join(__dirname, 'template.html');
      }
      template = await fs.readFile(templatePath, 'utf-8');
    } else {
      const templatePath = path.join(__dirname, '../public/template.html');
      template = await fs.readFile(templatePath, 'utf-8');
    }
  } catch (error) {
    // Fallback template if we can't load the template file
    template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}}</title>
    <link rel="stylesheet" href="/static/tailwind.css">
    <link rel="stylesheet" href="/static/styles.css">
    <link rel="stylesheet" href="/static/prism-light.css" media="(prefers-color-scheme: light)">
    <link rel="stylesheet" href="/static/prism-dark.css" media="(prefers-color-scheme: dark)">
    <script src="/static/prism.js"></script>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
        {{#if showBackButton}}<a href=".." class="inline-block mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">← Back</a>{{/if}}
        <div class="prose prose-lg dark:prose-invert max-w-none">
            {{content}}
        </div>
    </div>
</body>
</html>`;
  }
  
  const title = currentPath === '/' ? 'Markdown Files' : currentPath;
  
  // Simple template replacement
  template = template.replace('{{title}}', title);
  template = template.replace('{{content}}', content);
  template = template.replace('{{#if showBackButton}}', showBackButton ? '' : '<!--');
  template = template.replace('{{/if}}', showBackButton ? '' : '-->');
  
  return template;
} 