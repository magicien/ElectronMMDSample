'use strict'

export const defaultMatcher = (filterText, node) => {
  return node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
}

export const findNode = (node, filter, matcher) => {
  return matcher(filter, node) ||
    (node.children &&
      node.children.length &&
      !!node.children.find(child => findNode(child, filter, matcher)))
}

export const filterTree = (node, filter, matcher = defaultMatcher) => {
  if(matcher(filter, node) || !node.children){
    return node
  }
  const filtered = node.children
    .filter(child => findNode(child, filter, matcher))
    .map(child => filterTree(child, filter, matcher))
  return Object.assign({}, node, {children: filtered})
}

export const expandFilteredNodes = (node, filter, matcher = defaultMatcher) => {
  let children = node.children
  if(!children || children.length === 0){
    return Object.assign({}, node, {toggled: false})
  }
  const childrenWithMatches = node.children.filter(child => findNode(child, filter, matcher))
  const shouldExpand = childrenWithMatches.length > 0
  if(shouldExpand){
    children = childrenWithMatches.map(child => {
      return expandFilteredNodes(child, filter, matcher)
    })
  }
  return Object.assign({}, node, {
    children: children,
    toggled: shouldExpand
  })
}
