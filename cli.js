#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { startServer } from './server.js';

const program = new Command();

program
  .name('md-server')
  .description('A CLI tool that serves markdown files as HTML with Tailwind styling')
  .version('1.0.0')
  .option('-p, --port <port>', 'Port to run the server on', '3000')
  .option('-d, --directory <dir>', 'Directory to serve markdown files from', '.')
  .option('-h, --host <host>', 'Host to bind the server to', 'localhost')
  .parse();

const options = program.opts();

console.log(chalk.blue('🚀 Starting Markdown Server...'));
console.log(chalk.gray(`📁 Serving from: ${options.directory}`));
console.log(chalk.gray(`🌐 Server will be available at: http://${options.host}:${options.port}`));

startServer({
  port: parseInt(options.port),
  directory: options.directory,
  host: options.host
}); 