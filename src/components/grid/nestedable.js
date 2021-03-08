import Vue from 'vue'
/**
 * nestedable
 *
 * @mixin
 *
 */

/* @vue/component */

export default Vue.extend().extend({
  name: 'nestedable',
  props: {
    nested: Boolean,
    nestedKey: {
      type: String,
      default: 'children'
    },
    nestedLabel: {
      type: String,
      default: 'name'
    }
  },
  methods: {
    isLeaf(node) {
      return !node[this.nestedKey]
    },
    isParent(node) {
      return node[this.nestedKey] && node[this.nestedKey].length > 0
    },
    collapseNode(node) {
      node[this.nestedKey].forEach((item) => {
        const selector = `.v-tree-table__row__${item.id}`
        document
          .querySelector(selector)
          .classList.add('v-tree-table__row__hidden')
        this.collapseNode(item)
      })
    },
    expandNode(node) {
      node[this.nestedKey].forEach((item) => {
        const selector = `.v-tree-table__row__${item.id}`
        document
          .querySelector(selector)
          .classList.remove('v-tree-table__row__hidden')
      })
    },
    toggleNode(data) {
      const collapsed = data.__expanded
      if (!collapsed) {
        data.children.map((child) => {
          child.__expanded = false
          return child
        })
        this.collapseNode(data)
      } else {
        this.expandNode(data)
      }
    }
  }
})
