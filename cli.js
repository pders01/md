#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { startServer } from './src/server.js';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
let version = '1.0.0'; // fallback
try {
  let packagePath = join(__dirname, 'package.json');
  if (!existsSync(packagePath) && __dirname.includes('Cellar')) {
    // Homebrew install: look in ../libexec/
    packagePath = join(__dirname, '../libexec/package.json');
  }
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  version = packageJson.version;
} catch (error) {
  // If we can't read package.json, use fallback version
  console.warn('Warning: Could not read version from package.json, using fallback');
}

const program = new Command();

program
  .name('md-server')
  .description('DEPRECATED — use `mdv serve` from https://github.com/pders01/mdv')
  .version(version)
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-d, --directory <dir>', 'Directory to serve markdown files from', '.')
  .option('-h, --host <host>', 'Host to bind the server to', 'localhost')
  .parse();

const options = program.opts();

// Deprecation banner: this package's functionality has moved to `mdv serve`
// in https://github.com/pders01/mdv. Print on every startup so users running
// older installs see the migration path even without checking the README.
console.log(chalk.yellow.bold('⚠ md-server is deprecated.'));
console.log(chalk.yellow('  Functionality has moved to `mdv serve` — see'));
console.log(chalk.yellow('  https://github.com/pders01/mdv for the migration.'));
console.log();

console.log(chalk.blue('🚀 Starting Markdown Server...'));
console.log(chalk.gray(`📁 Serving from: ${options.directory}`));
console.log(chalk.gray(`🌐 Server will be available at: http://${options.host}:${options.port}`));

startServer({
  port: parseInt(options.port),
  directory: options.directory,
  host: options.host
}); 