import fs from 'fs';
import path from 'path';

export default (filepath, options) => {

  if (!filepath) return false;

  try {
    return fs.statSync(filepath).isDirectory();
  } catch (e) {
    return false;
  }
};