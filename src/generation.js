'use strict';

//Native Nodejs modules
import fs from 'fs';

//Vendor modules
import fileExists from 'file-exists';
import _ from 'lodash';

//Source modules
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

const createStructure = (key) => {

  // console.log("createStructure", createStructure);
  console.log("key is ", key);
  // if file
  //   createFile()
  // if folder
  //   createFolder(children, callback)
};

const readObjectLevel = (linesInfo) => {
  let keys = _.keys(linesInfo);

  _.each(keys, function(key) {
    //TODO: warn check for existing structureType

    createStructure(key);
  });

};

export default (linesInfo) => {
  // console.log(`generation lines info is`, linesInfo);

  //Check for any specified folder to house
  //the files and folders to be generated

  //Hard code this folder for now
  if (folderExists('testing')) {
    fs.rmdirSync('testing');
  }

  //Get the first line from the linesInfo

  readObjectLevel(linesInfo.firstLine);


};