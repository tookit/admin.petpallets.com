import FormNews from '@/components/form/cms/FormNews'
import FormSeo from '@/components/form/seo/FormSeo'
import { VSwitch, VAvatar, VImg, VIcon, VAutocomplete } from 'vuetify/lib'
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
          value: 'image',
          sortable: true,
          render: (item) => {
            return this.$createElement(
              VAvatar,
              {
                class: 'ma-2 rounded',
                props: {
                  size: 48,
                },
              },
              [this.$createElement(VImg, { props: { src: item.image } })]
            )
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
          text: 'Category',
          value: 'category.name',
          sortable: false,
        },
        {
          text: 'Posts',
          value: 'posts_count',
          sortable: false,
        },
        {
          text: 'Active',
          value: 'is_active',
          sortable: false,
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
    ...mapGetters(['getCmsCategories']),
    filterItems() {
      return [
        {
          cols: 6,
          element: VAutocomplete,
          transform: (val) => {
            return val ? parseInt(val) : null
          },
          props: {
            label: 'Category',
            name: 'category_id',
            hideDetails: true,
            outlined: true,
            items: this.getCmsCategories,
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
  watch: {},
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
          : item.tags.map((item) => item.name).join(', '),
        meta_description: meta_description
          ? meta_description
          : item.description,
      }
    },
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
    handleEditSeo(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormSeo,
        data: {
          item: this.setSeo(item),
          action: (data) => {
            return this.$store.dispatch('updateNews', data)
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
