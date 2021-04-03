import FormMallCategory from '@/components/form/mall/category/FormMallCategory'
import FormMergeCategory from '@/components/form/mall/category/FormMergeCategory'
import { mapGetters } from 'vuex'
import { VAutocomplete } from 'vuetify/lib'
export default {
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
          render: (item) => {
            const nodes = [
              this.$createElement(
                'a',
                {
                  domProps: {
                    target: '_blank',
                    href: item.href,
                  },
                },
                item.name
              ),
            ]
            return nodes
          },
        },
        {
          text: 'Sort',
          value: 'order_column',
        },
        {
          text: this.__('flag'),
          value: 'flag',
          width: 120,
          render: (item) => {
            return this.$createElement(VAutocomplete, {
              props: {
                items: this.getProductFlags,
                value: item.flag,
              },
              on: {
                change: (val) => {
                  this.handleUpdateField('flag', val, item.id)
                },
              },
            })
          },
        },
        {
          text: this.__('status'),
          value: 'is_active',
          width: 50,
        },
        {
          text: this.__('products'),
          value: 'products_count',
          width: 50,
        },
        {
          text: this.__('action'),
          value: 'action',
          width: 50,
        },
      ],
      items: [],
      actions: [
        {
          text: this.__('view_item'),
          icon: 'mdi-eye',
          click: this.handleViewItem,
        },
        {
          text: this.__('edit_item'),
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Merge Category',
          icon: 'mdi-pencil',
          click: this.handleMergeItem,
        },
        {
          text: this.__('delete_item'),
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductFlags', 'getProductCategories']),
    filterItems() {
      return [
        {
          cols: 6,
          element: 'VCascader',
          transform: (val) => {
            return val ? parseInt(val) : -1
          },
          props: {
            name: 'parent_id',
            items: this.getProductCategories,
            outlined: true,
            clearable: true,
            itemText: 'name',
            itemValue: 'id',
          },
        },
        {
          cols: 6,
          element: VAutocomplete,
          transform: (val) => {
            return val ? parseInt(val) : null
          },
          props: {
            name: 'flag',
            items: this.getProductFlags,
            outlined: true,
            clearable: true,
          },
        },
      ]
    },
  },
  watch: {},
  methods: {
    //action
    handleViewItem({ href }) {
      window.open(href, '_blank')
    },
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormMallCategory,
        data: {
          item: null,
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleEditItem(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormMallCategory,
        data: {
          item: item,
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleMergeItem(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormMergeCategory,
        data: {
          item: item,
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteProductCategory', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
    handleUpdateField(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateProductCategory', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
  },
}
