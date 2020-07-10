#!/usr/bin/env node

import { program } from 'commander';
import { spawn } from 'child_process';
import { resolve } from 'path';
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const colors = require('colors/safe');
const notifier = updateNotifier({ pkg });
notifier.notify();
const CLI_NODEMODULES_PATH = resolve(__dirname, '../node_modules/')
updateNotifier({ pkg }).notify();

program
    .command('start')
    .action(function () {
        const childProcess = spawn(/^win/.test(process.platform) ?
            `${CLI_NODEMODULES_PATH}/.bin/tsnd.cmd`
            : `${CLI_NODEMODULES_PATH}/.bin/tsnd`,
            [`${process.cwd()}/src/app.ts`],
            { stdio: [process.stdin, process.stdout, process.stderr] });
        childProcess.on('error', function (err) { throw err })
    })
program
    .command('new <name>')
    .option('-t, --template_type <template>', 'template to be initialized', 'blank')
    .action(function (folderName, options) {
        const { template_type } = options;
        console.log(`sustainland/sustain/samples/${template_type}`)
        const childProcess = spawn(/^win/.test(process.platform) ? 'npx.cmd' : 'npx',
            ['degit', `sustainland/sustain/samples/${template_type}`, folderName],
            { stdio: [process.stdin, process.stdout, process.stderr] });
        childProcess.on('error', function (err) { throw err })
        childProcess.on('exit', function (error) {
            if (!error) {
                console.log(colors.green('\nSuccess!\n'))
                console.log(`run: \ncd ${folderName} \nnpm install \nsustain start`)
            }

        })
    })

program.parse(process.argv);

