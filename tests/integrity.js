'use strict'

//Native modules
var childProcess = require('child_process'),
  path = require('path');

//Vendor modules
var fs = require('fs-extra-promise'),
  lab = exports.lab = require('lab').script(),
  __ = require('hamjest');

//Source modules
var validCliCommands = require('../src/cli-command-valid');

//Path definitions
var cliEntryFile = 'node ' + __dirname +  '/../bin/dirgen-cli-init.js';

lab.experiment('Cli commands when input is "dirgen"', function() {

  var exec = childProcess.exec;

  // require('./no-commands-or-options')(__, lab, cliEntryFile, exec);
  // require('./generate-command')(__, lab, cliEntryFile, exec);
  // require('./information-command')(__, lab, cliEntryFile, exec, validCliCommands, path);
  // require('./demo-command')(__, lab, cliEntryFile, exec, fs, path);
  // require('./generate-command-scenarios')(__, lab, cliEntryFile, exec, fs, path);
  require('./file-safety-check')(__, lab, cliEntryFile, exec, fs, path);
});