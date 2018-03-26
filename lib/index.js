'use strict';

var postcss = require('postcss');

var schema = {
  component: {
    separator: '.'
  },
  descendent: {
    separator: '-'
  },
  modifier: {
    separator: '--'
  },
  when: {
    separator: '_'
  }
};

module.exports = postcss.plugin('postcss-bem', function (opts) {
  function getAtruleSelector(atRule, paramName, parentSelector) {
    var selectorArray = [schema[atRule.name].separator, paramName];
    if (parentSelector) {
      return '' + parentSelector + selectorArray.join('');
    } else {
      var theParent = atRule.parent;
      while (theParent.type !== 'root') {
        selectorArray.unshift('' + schema[theParent.name].separator + theParent.params);
        theParent = theParent.parent;
      }
      return selectorArray.join('');
    }
  }

  function processAtrule(css, atRule, parentSelector) {
    var ruleName = atRule.name;
    if (!schema.hasOwnProperty(ruleName)) {
      throw new Error('you have written an unsupported type of bem declaration ' + ruleName);
    }
    var paramName = atRule.params;
    var ruleSelector = getAtruleSelector(atRule, paramName, parentSelector);
    var newRule = postcss.rule({
      selector: ruleSelector
    });
    atRule.nodes.forEach(function (item) {
      if (item.type === 'decl') {
        newRule.append(item);
      }
      if (item.type === 'atrule') {
        processAtrule(css, item, ruleSelector);
      }
    });
    css.append(newRule);
    atRule.remove();
  }

  return function (css, result) {
    css.walkAtRules(function (atRule) {
      processAtrule(css, atRule);
    });
  };
});