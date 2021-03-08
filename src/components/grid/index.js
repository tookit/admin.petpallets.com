import {
  getObjectValueByPath,
  getPrefixedScopedSlots,
  getPropertyFromItem,
} from 'vuetify/lib/util/helpers'
import VDataTable from 'vuetify/lib/components/VDataTable/VDataTable'
import VSimpleCheckbox from 'vuetify/lib/components/VCheckbox/VSimpleCheckbox'
import VIcon from 'vuetify/lib/components/VIcon'
import Row from './Row'
import MobileRow from 'vuetify/lib/components/VDataTable/MobileRow' // Mixins
import { mergeClasses } from 'vuetify/lib/util/mergeData'

export default VDataTable.extend({
  name: 'v-grid',
  props: {
    nested: Boolean,
    nestedKey: {
      type: String,
      default: 'children',
    },
    nestedLabel: {
      type: String,
      default: 'name',
    },
  },

  methods: {
    genDefaultSimpleRow(item, index, classes = {}) {
      const rows = []
      if (this.nested) item.__expanded = false
      const scopedSlots = getPrefixedScopedSlots('item.', this.$scopedSlots)
      const data = this.createItemProps(item, index)
      if (this.showSelect) {
        const slot = scopedSlots['data-table-select']
        scopedSlots['data-table-select'] = slot
          ? () =>
              slot({
                ...data,
                isMobile: this.isMobile,
              })
          : () =>
              this.$createElement(VSimpleCheckbox, {
                staticClass: 'v-data-table__checkbox',
                props: {
                  value: data.isSelected,
                  disabled: !this.isSelectable(item),
                },
                on: {
                  input: (val) => data.select(val),
                },
              })
      }

      if (this.showExpand) {
        const slot = scopedSlots['data-table-expand']
        scopedSlots['data-table-expand'] = slot
          ? () => slot(data)
          : () =>
              this.$createElement(
                VIcon,
                {
                  staticClass: 'v-data-table__expand-icon',
                  class: {
                    'v-data-table__expand-icon--active': data.isExpanded,
                  },
                  on: {
                    click: (e) => {
                      e.stopPropagation()
                      data.expand(!data.isExpanded)
                    },
                  },
                },
                [this.expandIcon]
              )
      }
      if (this.nested) {
        const slot = scopedSlots[this.nestedLabel]
        const margin = item.depth * 6
        const icon = this.isParent(item)
          ? !item.__expanded
            ? 'mdi-menu-right'
            : 'mdi-menu-right'
          : 'mdi-subdirectory-arrow-right'
        scopedSlots[this.nestedLabel] = slot
          ? () =>
              slot({
                ...data,
                isMobile: this.isMobile,
              })
          : () => [
              this.$createElement(
                VIcon,
                {
                  staticClass: `v-data-table__tree-icon ml-${margin}`,
                  class: {
                    'v-data-table__active': data.isExpanded,
                  },
                  on: {
                    click: (e) => {
                      e.stopPropagation()
                      item.__expanded = !item.__expanded
                      this.toggleNode(item)
                    },
                  },
                },
                [icon]
              ),
              this.$createElement('span', item.name),
            ]
      }
      // parent expanded -> children -> expanded
      const row = this.$createElement(this.isMobile ? MobileRow : Row, {
        key: getObjectValueByPath(item, this.itemKey),
        attrs: {
          'data-id': item.id,
        },
        staticClass: this.nested
          ? `v-tree-table__level__${item.depth} v-tree-table__row__${item.id}`
          : '',
        class: mergeClasses(
          {
            ...classes,
            'v-data-table__selected': data.isSelected,
            'v-tree-table__row__hidden': this.nested,
          },
          getPropertyFromItem(item, this.itemClass)
        ),
        props: {
          headers: this.computedHeaders,
          hideDefaultHeader: this.hideDefaultHeader,
          index,
          item,
          rtl: this.$vuetify.rtl,
        },
        scopedSlots,
        on: {
          // TODO: for click, the first argument should be the event, and the second argument should be data,
          // but this is a breaking change so it's for v3
          click: () => this.$emit('click:row', item, data),
          contextmenu: (event) => this.$emit('contextmenu:row', event, data),
          dblclick: (event) => this.$emit('dblclick:row', event, data),
        },
      })
      rows.push(row)
      if (item.children) {
        item.children.map((child) => {
          rows.push(this.genDefaultSimpleRow(child))
        })
      }
      return rows
    },
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
    },
  },
})
