<!-- (Module Only - Begin) -->
# ![Dirgen logo](./dirgen-head-logo.png "Dirgen logo") Dirgen
[![Npm Version](https://badge.fury.io/js/dirgen.svg)](https://badge.fury.io/js/dirgen)
[![Build Status](https://travis-ci.org/WilliamHuey/dirgen.svg?branch=master)](https://travis-ci.org/WilliamHuey/dirgen)
[![License](https://img.shields.io/:license-MIT-brightgreen.svg)](https://img.shields.io/github/license/mashape/apistatus.svg)
<!-- (Module Only - End) -->

# Overview:
Generate files and folders from a template file.

# Purpose:
Use this module when:

  * Generating repetitive boilerplate project structures
  * Writing unit tests with file and folder operations

[/]:# (Module Only - Begin)

# Installation:
``` bash
npm install dirgen -g
```
# Development:

``` bash
# Development should be done by getting this module's
# full content from git repository

# Use webpack to watch files
npm run watch

# Run the build command for 'dirgen-cli-entry.js'
# to be generated before running dirgen
npm run build
```

[/]:# (Module Only - End)

## Example:

Create a text file with the following contents and
give it a name of 'the-template-file.txt':

Template:
``` text
gsdf
  afsd
//sd,ss
dfg
  jj
  ygvhg
    dsd
  ygvhg
/fsfa
/fsfa
```

Command Line Usage:

``` bash
dirgen g 'the-template-file.txt' '/where-you-want-output-folder'
```

'Require' Usage:

The following is an equivalent to the above but is
required as a module in a JavaScript file

``` js
import dirgen from 'dirgen';

dirgen({
  template: '/location-of/the-template-file.txt',
  output: '/folder-location-for-generated-files-or-folders'
  /*
  options: {
    // The following two keys in the 'option' key below are optional
    // and are command options which
    // have values opposite of the settings default

    hideMessages: true,
    forceOverwrite: false,
  },

  // 'on' is also optional and it allows
  // for informational callbacks to execute with 'done' or 'line'
  on: {

    // 'done' is called when all files and folder are finished generating
    // or when there is an early return with an error condition
    done: (results, logOutput) => {

      // Example format of 'results'
      // Errors and warnings will contain a collection
      // of error and warning message strings respectively
      // {
      //   errors: [],
      //   warnings: []
      // }

      // Example format of 'logOutput'
      // {
      //   generated: 1,
      //   notGenerated: 0,
      //   repeats: [],
      //   skipped: 0,
      //   overwritten: {
      //    file: 0,
      //    folder: 0
      //   }
      // }
    },

    // 'line' gets called on every content line processed
    line: (stat) => {

      // Example format of 'stat'
      // Generated:    Line #1 (File): <line-content>
    }
  }

  */
});
```

Console output:

``` bash
 Warning: Line #3: '//sd,ss', has illegal characters which has been
  replaced, resulting in 'sd,ss'.

 Warning: Line #8: 'ygvhg', of file type is a repeated line and was
 not generated. First appearance of sibling is on line #6.

 Warning: Line #10: '/fsfa', of folder type is a repeated line and
 was not generated . First appearance of sibling is on line #9.

 Template info: 10 total lines (10 content, 0 blanks)
 Template read: 0 errors and 3 warnings
 Creation count: 8 generated, 2 not generated, 0 skipped
 Generation failures: 0 write errors
 Write time: 35262057 nanoseconds
```

# Details:

## Template file:

Template files provide the hierarchy of structure which explains the
nesting of files and folders. These files are plain textual files.

Indentation:
  Determines what file or folder types should be on the same folder level.
  Same indentation level between two lines means that the lines
  are siblings assuming that the two have the same parent.

  White space characters such as tabs or spaces define the indentations.
  However, only one type of white space character can be used at
  any one time in a single template file.

Lines:
  All non-blank lines will be counted towards the generation if the line
  is valid for generation.

Structure Type:
  File:
    A content line without a folder marker (forward slash) will be
    identified as a file line and if it has not been skipped.

    Example:
      a-file
      a-file-with-an-extension.someextension

  Folder:
    A content line with a folder marker (forward slash) at the
    beginning of the line will be identified as a folder type.
    A folder line can also signify having a later line
    with a greater indent than the folder line.

    It might be desirable to use the explicit 'slash'
    syntax to intend for an empty folder to be created
    among all the files that are created at the same level.

    Example:
      /a-folder

      or

      a-folder
        child-with-greater-indentation

# Terminologies:

  Template info:

    Content:
      Lines that have characters which are non-white space. These lines
      may or may not be generated.

    Blanks:
      Lines that are white-space only characters or have no characters
      at all. These lines are never generated.

  Template read:

    Errors:
      Upon one or more errors, there will be no
      generated file or folders.

    Warnings:
      Warning lines that are correctable such as having non-permissible
      characters can be sanitized and generated, but incorrect lines
      such as duplicated line content will be not be generated.

  Creation count:

    Generated:
      Lines that were read and were successfully created

    Not generated:
      Lines that produced a warning that may or may
      not have been generated.

    Skipped:
      Lines that were skipped because they already exists. By default,
      existing files and folders are not overwritten to prevent data lost.

    'Generated', 'Not generated', and 'Skipped counts' add up to the
    total line count of the template file.

  Generation failures:
    Failures occur when a valid line creation attempt did not go through.
    The generation failures count towards the "Skipped" of
    "Creation count".

  Write time:
    The time taken to write all the files and folders. Will yield "0" when
    at least one error has occurred on reading the template file because
    nothing will be generated.

## Demo:

For a demo of Dirgen, run 'dirgen demo' on the command line
and look at the output in the 'demo/example-output' folder
under the root of the Dirgen module folder.

## CLI Usage:

``` text
dirgen [command] [command parameters] [options]
```

## Command and Parameters:

### generate (g | gen)

``` text
[template] (required)

The text file provided for generation
Ex: "/some-directory/my-file-template.txt"

[output directory] (required)

The destination path for where the generated files or
folder should go.

Ex: dirgen g [template] [output directory]

```

### demo

``` text
Shows an example of how a template file is used
to generate files and folders inside the /demo folder
of the Dirgen NPM module.

Ex: dirgen demo
```

### version (v)

``` text
Displays what is the edition of this module.

Ex: dirgen v
```

### help (h)

``` help
Displays general information for this module.

Ex: dirgen h
```

## Options:

-f

  Overwrite files and directories even if they already
  exist. Default behavior is to not use this option
  as a safety measure.

-s

  Suppress the actual warnings and errors messages from
  showing up in the console. The count of warnings and
  errors will still be shown in the generation output
  information.

# License
MIT