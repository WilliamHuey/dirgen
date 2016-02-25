/*
 **COMMAND LINE

but command line input might interfere with the
rc file if one is defined.
take the precedence of the cli arguments over the
rc file

--------------------------
situations:

-no-content
  error 'no content in the file'

-potential unsafe content in line
  errors produce warnings
    walk thru errors or mass change
    opts (ignore| replace | skip)

    remember choices in config file




---------------------

 --filename-all-safe (warn on attempt of creating file/folder using a character that is allowed in current os but is forbidden in other oses)
 permitted value of true, false,step

 --trim-name (windows will not allow filenames with whitespace at the ends of the filename)

--encoding type
--permission level

--overwrite

might be preferrable to have a rc file because the configuration could get pretty advance

warn would allow the user to selectively allow all
or skip through the ones that is desired
-option to walk through or to skip through all

warn on / error out on (default as true)
  invalid character(s)
    character not allowed in this os
    character not allowed for other os
  existing files or folders


 */