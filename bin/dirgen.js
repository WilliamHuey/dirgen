#!/usr/bin/env node

console.time('start');
console.log("dirgen global commmand line execution");

require('babel-core/register')({
   presets: [ 'es2015' ]
});

require('../lib/dirgen').default();

console.timeEnd('start');