import FormTask from '@/components/form/crawler/FormTask'
import FormItemImport from '@/components/form/crawler/FormItemImport'
import { VAutocomplete, VIcon } from 'vuetify/lib'
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
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: { href: item.link, target: '_blank' },
              },
              item.name
            )
          },
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
                props: { size: 20 },
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
            return item.raw_data && item.type === 'item'
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
    ...mapGetters(['getVendors', 'getCrawlerTypeList']),
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
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'type',
            items: this.getCrawlerTypeList,
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
    fetchRecords(q) {
      return this.$store.dispatch('fetchCrawlerTask', q)
    },

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
        this.$store
          .dispatch('runCrawlerTask', id)
          .then(() => {
            this.$refs.grid.fetchRecords()
          })
          .catch(() => {})
      }
    },
    handleLinkProduct(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormItemImport,
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
  },
}
