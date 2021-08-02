import FormProperty from '@/components/form/mall/property/FormProperty'
import PropertyValueTable from '@/components/table/PropertyValueTable'
import FormTranslation from '@/components/form/FormTranslation'
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
          render: (item) => {
            const actions = [
              {
                icon: 'mdi-pencil',
                click: this.handleEditItem,
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
          text: 'Value',
          value: 'values',
          sortable: false,
          render: (row) => {
            const items = row.values ? row.values.slice(0, 2) : []
            const values = items.map((val) => {
              return this.$createElement(
                VChip,
                {
                  class: 'mr-2',
                  props: { xSmall: true, label: true },
                  on: {
                    click: () => {
                      this.handleViewValue(row)
                    },
                  },
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
        component: FormProperty,
        data: {
          item: item,
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
    handleTranslate(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormTranslation,
        data: {
          entity: {
            id: item.id,
            model: 'App\\Models\\Mall\\Property',
          },
          item: item,
          fields: ['name'],
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
