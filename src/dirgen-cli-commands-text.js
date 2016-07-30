'use strict';

const cliText = `
  \x1B[1m Overview: \x1B[22m

    Generate files and folders from a template file.

  ------------------------------------------------------------------------------

  \x1B[1m Details: \x1B[22m

    Template files provide the heirarchy of structure which explains the
    nesting of files and folders. Template files are plain textual files.

    Indentation:
      Determines what file or folder types should be on the same folder level.
      Same indentation level between two lines means that the lines
      are siblings assuming that the two have the same parent.

      White space characters such as tabs or spaces define the indentations.
      However, only one type of white space character can be used at
      any one time in a single template file.

    Lines:
      All lines will be counted towards the generation, but not all lines will
      be generated such as blanks lines.



  ------------------------------------------------------------------------------

  \x1B[1m Usage: \x1B[22m

    dirgen [command] [command parameters] [options]

  ------------------------------------------------------------------------------

  \x1B[1m Command: \x1B[22m           \x1B[1m Command Parameters: \x1B[22m
   (Alias below)        (in respective order)

    generate             <template> (required)
    (g | gen)             The text file provided for generation
                          Ex: "/some-directory/my-file-template.txt"

                         <output directory> (required)
                          The destination path for where the generated files
                          or folder should go.

    demo                 N/A
                          Shows an example of how a template file is used
                          to generate files and folder inside the /demo folder
                          of the Dirgen NPM module.

    version              N/A
    (v)                   Display what is the edition of this module.

  ----------------------------------------------------------------------------

  \x1B[1m Options: \x1B[22m

    -f                  Overwrite files and directory even if they already
                        exist. Default behavior without this option does not
                        forcibly overwrite content.

  ------------------------------------------------------------------------------

  \x1B[1m Generation Output: \x1B[22m

    Example:

    Template info: 0 total lines (0 content, 0 blanks)
    Template read: 1 errors and 0 warnings
    Creation count: 0 generated, 0 not generated, 0 skipped
    Generation failures: 0 write errors
    Write time: 0 nanoseconds

                        `;

export default cliText;