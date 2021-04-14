import FormNewsCategory from '@/components/form/cms/FormNewsCategory'
import FormTranslation from '@/components/form/FormTranslation'

import { VSwitch, VIcon } from 'vuetify/lib'
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
          text: 'Posts',
          value: 'posts_count',
          sortable: false,
        },
        {
          text: 'Active',
          value: 'is_active',
          render: (item) => {
            return this.$createElement(VSwitch, {
              props: {
                value: item.is_active,
                inputValue: item.is_active,
                trueValue: true,
                falseValue: false,
              },
              on: {
                change: (e) => {
                  this.handleStatusChange(item.id, 'is_active', e)
                },
              },
            })
          },
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
          element: VSwitch,
          props: {
            name: 'is_active',
            label: 'Active',
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
        component: FormNewsCategory,
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
    handleTranslate(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormTranslation,
        data: {
          entity: {
            id: item.id,
            model: 'App\\Models\\CMS\\Category',
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
        .dispatch('updateNewsCategory', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    handleEditItem(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormNewsCategory,
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
        this.$store.dispatch('deleteNewsCategory', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
