import FormNews from '@/components/form/cms/FormNews'
import ImageViewer from '@/components/image/ImageViewer'
import MediaTable from '@/components/table/MediaTable'
import FormTranslation from '@/components/form/FormTranslation'
import { VAutocomplete } from 'vuetify/lib'
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
