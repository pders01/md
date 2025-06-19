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
  app.get('/', async (req, res) => {
    try {
      const files = await fs.readdir(directory);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      if (markdownFiles.length === 0) {
        const html = await generateHTML('<h1>No markdown files found</h1><p>Add some .md files to this directory to get started.</p>', '/', false);
        res.send(html);
        return;
      }
      
      const fileList = markdownFiles.map(file => 
        `<a href="/${file}" class="file-link">${file}</a>`
      ).join('');
      
      const content = `
        <h1>${markdownFiles.length} file${markdownFiles.length === 1 ? '' : 's'}</h1>
        ${fileList}
      `;
      
      const html = await generateHTML(content, '/', false);
      res.send(html);
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

async function generateHTML(content, currentPath, showBackButton = false) {
  const templatePath = path.join(__dirname, '../public/template.html');
  let template = await fs.readFile(templatePath, 'utf-8');
  
  const title = currentPath === '/' ? 'Markdown Files' : currentPath;
  
  // Simple template replacement
  template = template.replace('{{title}}', title);
  template = template.replace('{{content}}', content);
  template = template.replace('{{#if showBackButton}}', showBackButton ? '' : '<!--');
  template = template.replace('{{/if}}', showBackButton ? '' : '-->');
  
  return template;
} 