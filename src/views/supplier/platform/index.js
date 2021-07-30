import FormNews from '@/components/form/cms/FormNews'
import MediaTable from '@/components/table/MediaTable'
import FormTranslation from '@/components/form/FormTranslation'
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
          text: 'Name',
          value: 'name',
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {
                  href: item.url,
                  target: '_blank',
                },
              },
              item.name
            )
          },
        },

        {
          text: 'Shops',
          value: 'shop_count',
          sortable: false,
        },
        {
          text: 'Items',
          value: 'item_count',
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
      return []
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
            model: 'App\\Models\\CMS\\Post',
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
          entity: 'App\\Models\\CMS\\Post',
          directory: `upload`,
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
