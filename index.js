const postcss = require('postcss')

const schema = {
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
}

module.exports = postcss.plugin('postcss-bem', function (opts) {
  function getAtruleSelector (atRule, paramName, parentSelector) {
    let selectorArray = [schema[atRule.name].separator, paramName]
    if (parentSelector) {
      return `${parentSelector}${selectorArray.join('')}`
    } else {
      let theParent = atRule.parent
      while (theParent.type !== 'root') {
        selectorArray.unshift(`${schema[theParent.name].separator}${theParent.params}`)
        theParent = theParent.parent
      }
      return selectorArray.join('')
    }
  }

  function processAtrule (css, atRule, parentSelector) {
    let ruleName = atRule.name
    if (!schema.hasOwnProperty(ruleName)) {
      throw new Error(`you have written an unsupported type of bem declaration ${ruleName}`)
    }
    let paramName = atRule.params
    let ruleSelector = getAtruleSelector(atRule, paramName, parentSelector)
    let newRule = postcss.rule({
      selector: ruleSelector
    })
    atRule.nodes.forEach((item) => {
      if (item.type === 'decl') {
        newRule.append(item)
      }
      if (item.type === 'atrule') {
        processAtrule(css, item, ruleSelector)
      }
    })
    css.append(newRule)
    atRule.remove()
  }

  return function (css, result) {
    css.walkAtRules(function (atRule) {
      processAtrule(css, atRule)
    })
  }
})
