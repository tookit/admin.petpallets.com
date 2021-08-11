import FormNews from '@/components/form/cms/FormNews'
import ImageViewer from '@/components/image/ImageViewer'
import FormTranslation from '@/components/form/FormTranslation'
import { VAutocomplete, VIcon } from 'vuetify/lib'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      headers: [
        {
          text: 'id',
          value: 'id',
        },
        {
          text: 'Image',
          value: 'images',
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: item.images,
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
          text: 'Category',
          value: 'category_name',
          sortable: false,
        },
        {
          text: 'Price',
          value: 'price',
          sortable: true,
          render: (item) => {
            return this.$createElement('span', item.price / 100)
          },
        },
        {
          text: 'Currency',
          value: 'currency',
          sortable: false,
        },
        {
          text: 'Tag',
          value: 'tags',
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
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
      ],
    }
  },
  computed: {
    ...mapGetters(['getPlatformList']),
    filterItems() {
      return [
        {
          cols: 6,
          element: VAutocomplete,
          transform: (val) => {
            return val ? parseInt(val) : null
          },
          props: {
            label: 'Platform',
            name: 'platform_id',
            hideDetails: true,
            outlined: true,
            items: this.getPlatformList,
            itemText: 'name',
            itemValue: 'id',
          },
        },
      ]
    },
  },
  watch: {},
  created() {
    this.$store.dispatch('fetchSupplierPlatform', { pageSize: -1 })
  },
  methods: {
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormNews,
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
        component: FormNews,
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
    handleTranslate(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormTranslation,
        data: {
          entity: {
            id: item.id,
            model: 'Modules\\Supplier\\Models\\Item',
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
    handleStatusChange(id, field, value) {
      const data = {}
      data[field] = value
      this.$store
        .dispatch('updateNews', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    handleDeleteItem({ id }) {
      console.log
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteNews', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
