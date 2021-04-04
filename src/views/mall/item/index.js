import FormQuickItem from '@/components/form/mall/item/FormQuickItem'
import FormSeo from '@/components/form/seo/FormSeo'
import FormItemProperty from '@/components/form/mall/item/FormItemProperty'
import FormSpecImport from '@/components/form/mall/item/FormSpecImport'

import MediaTable from '@/components/table/MediaTable'
import ImageViewer from '@/components/image/ImageViewer'
import { VAutocomplete, VIcon, VSwitch } from 'vuetify/lib'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: this.__('id'),
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
          text: this.__('name'),
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
                icon: 'mdi-google',
                click: this.handleEditSeo,
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
          text: this.__('vendor'),
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
          text: this.__('category'),
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
          text: this.__('flag'),
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
          text: this.__('status'),
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
          text: this.__('action'),
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
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductFlags', 'getProductCategories', 'getVendors']),
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
      window.open(item.href, '_blank')
    },
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormQuickItem,
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
        component: FormQuickItem,
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
    handleEditProperty(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormItemProperty,
        data: {
          product: item,
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
    handleEditSeo(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormSeo,
        data: {
          item: this.setSeo(item),
          action: (data) => {
            return this.$store.dispatch('updateProduct', data)
          },
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
        this.$store.dispatch('deleteProduct', id).then(() => {
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
