import FormTask from '@/components/form/crawler/FormTask'
import { VAutocomplete, VIcon } from 'vuetify/lib'
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
          text: 'Link',
          value: 'link',
        },
        {
          text: 'Product',
          value: 'product_id',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Rule',
          value: 'rule',
          render: (item) => {
            return this.$createElement(
              VIcon,
              {
                props: { size: 24 },
                on: {
                  click: () => {
                    this.handleEditItem(item)
                  },
                },
              },
              'mdi-pipe'
            )
          },
        },
        {
          text: 'Http Status',
          value: 'http_status',
        },
        {
          text: 'Status',
          value: 'status',
        },
        {
          text: 'Created',
          value: 'created_at',
          sortable: true,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
        },
      ],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Run Task',
          icon: 'mdi-hammer',
          click: this.handleRunTask,
          enable: (item) => {
            return item.rule
          },
        },
        {
          text: 'Import',
          icon: 'mdi-database-import',
          click: this.handleLinkProduct,
          enable: (item) => {
            return item.raw_data
          },
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
    ...mapGetters(['getVendors']),
    filterItems() {
      return [
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'vendor_id',
            items: this.getVendors,
            outlined: true,
            hideDetails: true,
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
        component: FormTask,
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
        component: FormTask,
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
        this.$store.dispatch('deleteCrawlerTask', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
    handleRunTask({ id }) {
      if (window.confirm('Are you sure to run this task ?')) {
        this.showOverlay = true
        this.$store
          .dispatch('runCrawlerTask', id)
          .then(() => {
            this.handleRefreshItem()
            this.showOverlay = false
          })
          .catch(() => {
            this.showOverlay = false
          })
      }
    },
    handleLinkProduct({ id, status, type }) {
      if (type === 'item' && status === 'finished') {
        this.showOverlay = true
        this.$store
          .dispatch('linkProduct', id)
          .then(() => {
            this.handleRefreshItem()
            this.showOverlay = false
          })
          .catch(() => (this.showOverlay = false))
      }
    },
  },
}
