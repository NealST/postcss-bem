import { atRule } from 'postcss';

const postcss = require('postcss')

const schema = {
  component: {
    alias: 'b',
    separator: '.'
  },
  descendent: {
    alias: 'e',
    separator: '-'
  },
  modifier: {
    alias: 'm',
    separator: '--'
  },
  when: {
    alias: 'w',
    separator: '_'
  }
}

module.exports = postcss.plugin('postcss-bem', function (opts) {
  function getAtruleSelector (atRule, paramName) {
    let selectorArray = [schema[atRule.name].separator, paramName]
    let theParent = atRule.parent
    while (theParent && theParent.type !== 'root') {
      selectorArray.unshift(`${schema[theParent.name].separator}${theParent.params}`)
      theParent = theParent.parent
    }
    return selectorArray.join('')
  }

  function processAtrule (css, atRule) {
    let ruleName = atRule.name
    if (!schema.hasOwnProperty(ruleName)) {
      throw new Error(`you have written an unsupported type of bem declaration ${ruleName}`)
    }
    let paramName = atRule.params
    let ruleSelector = getAtruleSelector(atRule, paramName)
    let newRule = postcss.rule({
      selector: ruleSelector
    })
    atRule.nodes.forEach((item) => {
      if (item.type === 'decl') {
        newRule.append(item)
      }
    })
    css.append(newRule)
  }

  return function (css, result) {
    let atRules = []
    css.walkAtRules(function (atRule) {
      atRules.push(atRule)
      processAtrule(css, atRule)
    })
    atRule.forEach((item) => {
      item.remove()
    })
  }
})
