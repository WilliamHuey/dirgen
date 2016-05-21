'use strict';

import './dirgen-cli-commands';

// console.time('Command Line Load Time');

//Check JavaScript environment before executing
if (typeof process === 'undefined') {
  console.error(`Not in a Node environment,can not advance with file and folder generation.`);
} else if (typeof window !== 'undefined') {
  console.error('Most likely in a browser');
}

// console.timeEnd('Command Line Load Time');