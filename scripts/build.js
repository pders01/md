import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

async function build() {
  console.log('🔨 Building CLI with Vite...');
  
  // Create dist directory
  await fs.mkdir('dist', { recursive: true });
  
  // Run vite build
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Read the bundled file
  let bundledCode = await fs.readFile('dist/md-server.js', 'utf-8');
  
  // Read static assets
  const assets = {
    template: await fs.readFile('public/template.html', 'utf-8'),
    styles: await fs.readFile('public/styles.css', 'utf-8'),
    tailwind: await fs.readFile('public/tailwind.css', 'utf-8'),
    prismLight: await fs.readFile('public/prism-light.css', 'utf-8'),
    prismDark: await fs.readFile('public/prism-dark.css', 'utf-8'),
    prismJs: await fs.readFile('public/prism.js', 'utf-8'),
  };
  
  // Create assets object
  const assetsCode = `
// Embedded static assets
const EMBEDDED_ASSETS = ${JSON.stringify(assets, null, 2)};
`;
  
  // Remove the shebang from vite output and add it at the beginning
  bundledCode = bundledCode.replace('#!/usr/bin/env node\n', '');
  
  // Insert assets and shebang at the beginning
  bundledCode = '#!/usr/bin/env node\n' + assetsCode + bundledCode;
  
  // Write the final bundled file
  await fs.writeFile('dist/md-server.js', bundledCode);
  
  // Make it executable
  await fs.chmod('dist/md-server.js', 0o755);
  
  console.log('✅ CLI built successfully!');
  console.log('📦 Output: dist/md-server.js');
}

build().catch(console.error); 