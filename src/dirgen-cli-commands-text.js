'use strict';

const cliText = `
  \x1B[1m Description: \x1B[22m

    Generate files and folders from a template file.

  ----------------------------------------------------------------------------

  \x1B[1m Usage: \x1B[22m

    dirgen [command] [command parameters] [options]

  ----------------------------------------------------------------------------

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

  ----------------------------------------------------------------------------

  \x1B[1m Generation Output: \x1B[22m

                        `;

export default cliText;