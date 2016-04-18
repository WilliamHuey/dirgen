#!/usr/bin/env node

console.log("dirgen global commmand line execution");

require('babel-core/register')({
   presets: [ 'es2015' ]
});

require('../lib/dirgen').default();