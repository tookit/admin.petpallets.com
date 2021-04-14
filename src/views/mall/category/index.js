import FormMallCategory from '@/components/form/mall/category/FormMallCategory'
import FormEditCategory from '@/components/form/mall/category/FormEditCategory'
import FormMergeCategory from '@/components/form/mall/category/FormMergeCategory'
import FormTranslation from '@/components/form/FormTranslation'
import MediaTable from '@/components/table/MediaTable'
import { mapGetters } from 'vuex'
import { VAutocomplete, VSwitch, VIcon } from 'vuetify/lib'
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
            const actions = [
              {
                icon: 'mdi-pencil',
                click: this.handleEditItem,
              },
              {
                icon: 'mdi-image',
                click: this.handleEditImage,
              },
              {
                icon: 'mdi-translate',
                click: this.handleTranslate,
              },
            ]
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
              this.$createElement(
                'div',
                actions.map((act) => {
                  return this.$createElement(
                    VIcon,
                    {
                      props: { size: 20, color: act.color },
                      on: {
                        click: () => {
                          act.click(item)
                        },
                      },
                    },
                    act.icon
                  )
                })
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
          text: 'Flag',
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
          text: 'Active',
          value: 'is_active',
          width: 50,
          render: (item) => {
            return this.$createElement(VSwitch, {
              props: {
                inputValue: item.is_active,
                trueValue: true,
                falseVaule: false,
              },
              on: {
                change: (val) => {
                  this.handleUpdateField('is_active', val, item.id)
                },
              },
            })
          },
        },
        {
          text: 'Products',
          value: 'products_count',
          width: 50,
        },
        {
          text: 'Action',
          value: 'action',
          width: 50,
        },
      ],
      items: [],
      actions: [
        {
          text: 'View Item',
          icon: 'mdi-eye',
          click: this.handleViewItem,
        },
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Merge Category',
          icon: 'mdi-pencil',
          click: this.handleMergeItem,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductFlags', 'getNestedCategories']),
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
            items: this.getNestedCategories,
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
    handleViewItem(item) {
      let routeData = this.$router.resolve({
        path: `/mall/category/item/${item.id}`,
      })
      window.open(routeData.href, '_blank')
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
        component: FormEditCategory,
        data: {
          id: item.id,
          name: item.name,
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleTranslate(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormTranslation,
        data: {
          entity: {
            id: item.id,
            model: 'App\\Models\\Mall\\Category',
          },
          item: item,
          fields: ['name', 'description'],
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleEditImage(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: MediaTable,
        data: {
          entityId: item.id,
          entity: 'App\\Models\\Mall\\Category',
          directory: `category/${item.id}`,
          showSelect: true,
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
