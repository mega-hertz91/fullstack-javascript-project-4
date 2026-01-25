#!/usr/bin/env node

import { Command } from 'commander'
import { pageLoaderAction } from '../src/actions/index.js'

const program = new Command()

// Base setting cli
program
  .name('page-loader')
  .description('Page loader utility')
  .version('0.0.1')

// Replace default help option
program
  .helpOption('-h, --help', 'output usage information')

// Add options
program
  .argument('<url>')
  .option('-o, --output [dir]', `output dir (default: ${process.cwd()})`)
  .action(pageLoaderAction)

program.parse(process.argv)
