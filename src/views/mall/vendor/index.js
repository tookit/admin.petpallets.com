import FormVendor from '@/components/form/vendor/FormVendor'
import FormTranslation from '@/components/form/FormTranslation'
import { VSelect, VIcon } from 'vuetify/lib'
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
          text: 'City',
          value: 'city',
          sortable: true,
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Website',
          value: 'website',
          sortable: true,
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {
                  href: item.website,
                  target: '_blank',
                },
              },
              item.website
            )
          },
        },
        {
          text: 'Task',
          value: 'tasks_count',
          sortable: false,
        },
        {
          text: 'Products',
          value: 'products_count',
          render: (item) => {
            return this.$createElement(
              'span',
              {
                class: {
                  'v-chip': true,
                  'v-chip--outlined': true,
                },
                props: {
                  text: true,
                  small: true,
                },
              },
              item.products_count
            )
          },
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
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    filterItems() {
      return [
        {
          cols: 6,
          element: VSelect,
          props: {
            name: 'city',
            items: ['shenzhen'],
            dense: true,
            hideDetails: true,
            outlined: true,
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
        component: FormVendor,
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
        component: FormVendor,
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
            model: 'App\\Models\\Mall\\Vendor',
          },
          item: item,
          fields: ['name', 'description', 'address', 'mobile', 'contact'],
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
        this.$store.dispatch('deleteVendor', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
