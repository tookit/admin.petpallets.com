export const arrayToTree = (items) => {
  /**
   * The nested tree.
   * @type {*[]}
   */
  const rootItems = []
  const lookup = {}
  for (const item of items) {
    const itemId = item['id']
    const parentId = item['parent_id']
    if (!lookup[itemId]) lookup[itemId] = { ['children']: [] }

    lookup[itemId] = { ...item, ['children']: lookup[itemId]['children'] }

    const TreeItem = lookup[itemId]

    if (parentId === null || parentId === undefined || parentId === '') {
      rootItems.push(TreeItem)
    } else {
      if (!lookup[parentId]) lookup[parentId] = { ['children']: [] }

      lookup[parentId]['children'].push(TreeItem)
    }
  }

  return rootItems
}
