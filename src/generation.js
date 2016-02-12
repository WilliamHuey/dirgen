'use strict';

import fs from 'fs';
import fileExists from 'file-exists';
import folderExists from './folder-exists';

/*
write both files and folder

should probably default to housing the files
and folders generated to a default named folder
to make it less more convenient to remove
accidentally created files or folders

read from the commandline or rc file
rc file has the name dirgen.config.js


*/

//Readline the first content line

export default (linesInfo) => {
  // console.log(`generation lines info is`, linesInfo);

  //Check for any specified folder to house
  //the files and folders to be generated

  // console.log(fs.statSync('/Users/williamhuey/Desktop/Android-Nexus7-Tablet-Backup/').Stats.isDirectory());
  //Hard code this folder for now
  if (folderExists('testing')) {
    fs.rmdirSync('testing');
  }

  fs.mkdir('testing', function() {
    console.log("fib dir gen");

    //Go through the linesinfo and start
    //creating the folders or files

    // console.log("linesInfo", linesInfo);


    // Having children means that it is definitely a folder

    /*
      Need to walk through the linesinfo structure again

      check file line structure type and then
      check for existence of structure type, are the lines repeated?
    */

    if (linesInfo.firstLine.children.length > 0) {
      console.log("is a folder");
    } else {
      // Not having children means that it could be a file or a folder
      console.log("could be file or folder");

      //Evaluate what the current line might be

      //Check for presence of any special characters


      //If the line has a slash in front than it is a folder,
      //regardless of whether or not it has periods in its name

      // if a one or more periods in the name than it is assumed to be a file
      //unless it is stated otherwise
    }


  });

};