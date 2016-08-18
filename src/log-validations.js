export default (againstRule, summaryValidation) => {

  //ex againstRule = {
  // type: 'error',
    // line: { number: 2, message: 'Line 2 has error on ...'}
  //}

  if (typeof againstRule.type !== 'undefined') {
    if (againstRule.type === 'error') {
      summaryValidation.errors.push(againstRule.line);
    } else if (againstRule.type === 'warning') {
      summaryValidation.warnings.push(againstRule.line);
    }
    if (againstRule.output) {
      return againstRule.output;
    }
  }
};