import FormProperty from '@/components/form/property/FormProperty'
import PropertyValueTable from '@/components/table/PropertyValueTable'
import { VChip, VIcon } from 'vuetify/lib'
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
          sortable: true,
          render: (row) => {
            return this.$createElement(
              'a',
              {
                on: {
                  click: () => {
                    this.handleEditItem(row)
                  },
                },
              },
              row.name
            )
          },
        },
        {
          text: 'Slug',
          value: 'slug',
          sortable: false,
        },
        {
          text: 'Value',
          value: 'values',
          sortable: false,
          render: (row) => {
            const items = row.values.slice(0, 2)
            const values = items.map((val) => {
              return this.$createElement(
                VChip,
                {
                  props: { xSmall: true },
                },
                val.value
              )
            })
            const icon = this.$createElement(
              VIcon,
              {
                on: {
                  click: () => {
                    this.handleViewValue(row)
                  },
                },
              },
              'mdi-plus'
            )
            return this.$createElement('div', {}, [...values, icon])
          },
        },
        {
          text: 'Unit',
          value: 'unit',
          width: 100,
          sortable: false,
        },
        {
          text: 'Action',
          value: 'action',
          width: 100,
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
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    filterItems() {
      return []
    },
  },
  watch: {},
  methods: {
    //action
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormProperty,
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
        component: FormProperty,
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
        this.$store.dispatch('deleteProperty', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
    handleViewValue(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: PropertyValueTable,
        data: {
          property: item,
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
