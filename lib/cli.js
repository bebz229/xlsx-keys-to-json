#!/usr/bin/env node
const yargs = require('yargs');
const { extract } = require('./index');

const argv = yargs
    .option('src', { alias: 's', description: 'excel source file' })
    .option('dest', { alias: 'd', description: 'destination folder' })
    .option('name', { alias: 'n', description: 'name to of file to write' })
    .option('tab', { alias: 't', description: 'tab in file' })
    .option('multi', { alias: 'm', description: 'generate multiple files', type: 'boolean' })
    .help()
    .alias('help', 'h')
    .alias('version', 'v')
    .argv;

const { src, dest = process.cwd(), name, tab, multi } = argv;

extract({ src, dest, name, tab, multi });
