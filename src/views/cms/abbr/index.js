import FormAbbr from '@/components/form/cms/FormAbbr'
import ImageViewer from '@/components/image/ImageViewer'
export default {
  data() {
    return {
      headers: [
        {
          text: 'Id',
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
        },
        {
          text: 'Media',
          value: 'media',
          sortable: false,
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: item.media,
                item: item.media[0],
              },
            })
          },
        },
        {
          text: 'Short for',
          value: 'short_for',
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
        component: FormAbbr,
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
        component: FormAbbr,
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
        this.$store.dispatch('deleteAbbr', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
