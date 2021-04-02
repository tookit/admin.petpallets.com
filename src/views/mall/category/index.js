import FormAbbr from '@/components/form/cms/FormAbbr'
import { mapGetters } from 'vuex'
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
        },
        {
          text: 'Sort',
          value: 'order_column',
        },
        {
          text: this.__('flag'),
          value: 'flag',
          width: 50,
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
          text: this.__('add_child'),
          icon: 'mdi-plus',
          click: this.handleAddChild,
        },
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
          text: this.__('move_item'),
          icon: 'mdi-pencil',
          click: this.handleMoveItem,
        },
        {
          text: this.__('delete_item'),
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
        {
          text: this.__('translate_item'),
          icon: 'mdi-translate',
          click: this.handleShowTranslation,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductFlags', 'getProductCategories']),
    filterItems() {
      return [
        {
          cols: 12,
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
      ]
    },
  },
  watch: {},
  methods: {
    //action
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormAbbr,
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
        component: FormAbbr,
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
        this.$store.dispatch('deleteAbbr', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
