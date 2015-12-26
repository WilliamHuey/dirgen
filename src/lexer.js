import detectIndent from 'detect-indent';
import strscan from 'strscanner';
import PrettyError from 'pretty-error';

//Should also detect indentation and well as symbols
function Lexer() {}

Lexer.prototype = {
  lex: line => {
    console.log("line in lexer is ", line);
  }
};

export default Lexer;