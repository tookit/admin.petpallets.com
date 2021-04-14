import FormEditItem from '@/components/form/mall/item/FormEditItem'
import FormQuickItem from '@/components/form/mall/item/FormQuickItem'
import FormItemProperty from '@/components/form/mall/item/FormItemProperty'
import FormSpecImport from '@/components/form/mall/item/FormSpecImport'
import FormTranslation from '@/components/form/FormTranslation'

import MediaTable from '@/components/table/MediaTable'
import ImageViewer from '@/components/image/ImageViewer'
import { VAutocomplete, VIcon, VSwitch } from 'vuetify/lib'
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
          text: 'Image',
          value: 'media',
          align: 'center',
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: item.media,
              },
            })
          },
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
                icon: 'mdi-filter',
                click: this.handleEditProperty,
              },
              {
                icon: 'mdi-cloud',
                click: this.handleEditSpec,
                color: item.property_values.length > 0 ? 'grey' : 'error',
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
          text: 'Vendor',
          value: 'vendor.name',
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {
                  target: '_blank',
                  href: item.reference_url,
                },
              },
              item.vendor ? item.vendor.name : ''
            )
          },
        },
        {
          text: 'Category',
          value: 'categories',
          width: 250,
          render: (item) => {
            const label = item.category ? item.category.name : 'None'
            const nodes = [
              this.$createElement(
                'a',
                {
                  domProps: {
                    href: item.category ? item.category.href : '#',
                    target: '_blank',
                  },
                },
                label
              ),
              this.$createElement('div', [
                this.$createElement(
                  VIcon,
                  {
                    props: {
                      size: 16,
                    },
                    on: {
                      click: () => {
                        let routeData = this.$router.resolve({
                          path: `/mall/category/item/${item.category_id}`,
                        })
                        window.open(routeData.href, '_blank')
                      },
                    },
                  },
                  'mdi-pencil'
                ),
              ]),
            ]
            return this.$createElement('div', nodes)
          },
        },
        {
          text: 'Flag',
          value: 'flag',
          width: 150,
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
          text: 'Status',
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
          text: 'Action',
          value: 'action',
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
          text: 'Duplicate Item',
          icon: 'mdi-content-duplicate',
          click: this.handleDuplicateItem,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
        {
          text: 'Delete Batch',
          icon: 'mdi-close',
          click: this.handleDeleteBatch,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductFlags', 'getNestedCategories', 'getVendors']),
    filterItems() {
      return [
        {
          cols: 6,
          element: 'VCascader',
          transform: (val) => {
            return val ? parseInt(val) : val
          },
          props: {
            label: 'Category',
            name: 'categories.id',
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
            return val ? parseInt(val) : val
          },
          props: {
            name: 'vendor_id',
            items: this.getVendors,
            outlined: true,
            clearable: true,
            hideDetails: true,
          },
        },
        {
          cols: 6,
          element: VAutocomplete,
          transform: (val) => {
            return val ? parseInt(val) : val
          },
          props: {
            name: 'flag',
            clearable: true,
            items: this.getProductFlags,
            outlined: true,
            hideDetails: true,
          },
        },
        {
          cols: 6,
          element: VSwitch,
          props: {
            label: 'Active',
            name: 'is_active',
            hideDetails: true,
            outlined: true,
          },
        },
      ]
    },
  },
  methods: {
    setSeo(item) {
      const { meta_title, meta_keywords, meta_description } = item
      return {
        id: item.id,
        name: item.name,
        meta_title: meta_title
          ? meta_title
          : 'China factory provide ' + item.name,
        meta_keywords: meta_keywords
          ? meta_keywords
          : item.categories.map((item) => item.name).join(', '),
        meta_description: meta_description
          ? meta_description
          : item.description,
      }
    },
    //action
    handleViewItem(item) {
      let routeData = this.$router.resolve({
        path: `/mall/item/${item.id}`,
      })
      window.open(routeData.href, '_blank')
    },
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormQuickItem,
        data: {
          item: null,
          showHeader: true,
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
        component: FormEditItem,
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
    handleEditProperty(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormItemProperty,
        data: {
          id: item.id,
          showHeader: true,
        },
        on: {
          'form:cancel': () => {
            dialog.hide()
          },
        },
      })
      dialog.show()
    },
    handleEditSpec(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormSpecImport,
        data: {
          product: item,
          inDialog: true,
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
          entity: 'App\\Models\\Mall\\Product',
          directory: `fiber/${item.id}`,
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
    handleTranslate(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormTranslation,
        data: {
          entity: {
            id: item.id,
            model: 'App\\Models\\Mall\\Product',
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
    handleDuplicateItem({ id }) {
      if (window.confirm('Are you sure to duplicate this item ?')) {
        this.$store.dispatch('duplicateProduct', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
    handleDeleteItem(item) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteProduct', item.id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },

    handleDeleteBatch(item, selectedItems) {
      if (window.confirm('Are you sure to delete selected items ?')) {
        const data =
          selectedItems.length > 0 ? selectedItems.map((s) => s.id) : [item.id]
        this.$store.dispatch('deleteBatchProduct', data).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },

    handleUpdateField(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateProduct', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
  },
}
