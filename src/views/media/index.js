import FormUpload from '@/components/form/media/FormUpload.vue'
import FormMedia from '@/components/form/media/FormMedia.vue'
import ImageViewer from '@/components/image/ImageViewer'
import { VAutocomplete } from 'vuetify/lib'
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
          text: 'Image',
          value: 'cloud_url',
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: [item],
              },
            })
          },
        },
        {
          text: 'Fingerprint',
          value: 'fingerprint',
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {},
                on: {
                  click: () => {
                    this.handleEditItem(item)
                  },
                },
              },
              item.fingerprint ?? '#'
            )
          },
        },
        {
          text: 'Size',
          value: 'size',
        },
        {
          text: 'Directory',
          value: 'directory',
        },
        {
          text: 'Disk',
          value: 'disk',
        },
        {
          text: 'Featured',
          value: 'custom_properties.featured',
        },
        {
          text: 'Created',
          value: 'created_at',
        },
        {
          text: 'Action',
          value: 'action',
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
    ...mapGetters(['getMediaDir']),
    filterItems() {
      return [
        {
          cols: 4,
          element: VAutocomplete,
          props: {
            name: 'directory',
            items: this.getMediaDir,
            outlined: true,
            hideDetails: true,
            itemText: 'directory',
            itemValue: 'directory',
          },
        },
      ]
    },
    uploadAction() {
      return `${process.env.VUE_APP_BASE_API_HOST}/api/media`
    },
  },
  methods: {
    //action
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormUpload,
        data: {
          action: this.uploadAction,
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
        component: FormMedia,
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
