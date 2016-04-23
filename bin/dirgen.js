#!/usr/bin/env node

//Check JavaScript environment before executing
if (typeof process === 'undefined') {
  console.error(`Not in a Node environment,can not advance with file and folder generation.`);
}

if (typeof window !== 'undefined') {
  console.error('Most likely in a browser');
}

console.time('Command Line Time');

require('babel-core/register')({
   presets: [ 'es2015' ]
});

require('../lib/dirgen');

console.timeEnd('Command Line Time');