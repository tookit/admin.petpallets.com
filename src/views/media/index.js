import FormUpload from '@/components/form/media/FormUpload.vue'
import FormMedia from '@/components/form/media/FormMedia.vue'
import FormEntity from '@/components/form/media/FormEntity.vue'
import ImageViewer from '@/components/image/ImageViewer'
import { VAutocomplete } from 'vuetify/lib'
import { mapGetters } from 'vuex'
import { humanReadableFileSize } from 'vuetify/lib/util/helpers'

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
                item: item,
              },
            })
          },
        },
        // {
        //   text: 'Filename',
        //   value: 'filename',
        // },
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
          text: 'Entity',
          value: 'entity',
          render: (item) => {
            let nodes = []
            this.getEntityList.filter((entity) => {
              const key = entity.text.toLowerCase()
              const model = item[key]
              if (model && model.length > 0) {
                const entity = model[0]
                nodes.push(
                  this.$createElement(
                    'a',
                    {
                      domProps: {
                        href: entity.href,
                        target: '_blank',
                      },
                    },
                    key + ':' + entity.id
                  )
                )
              }
            })
            return nodes
          },
        },
        {
          text: 'Size',
          value: 'size',
          render: (item) => {
            return this.$createElement('span', humanReadableFileSize(item.size))
          },
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
          text: 'Attach Entity',
          icon: 'mdi-pencil',
          click: this.handleAttachEntity,
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
    ...mapGetters(['getMediaDir', 'getMediaExt', 'getEntityList']),
    filterItems() {
      return [
        {
          cols: 4,
          element: VAutocomplete,
          props: {
            name: 'directory',
            items: this.getMediaDir,
            clearable: true,
            outlined: true,
            hideDetails: true,
          },
        },
        {
          cols: 4,
          element: VAutocomplete,
          props: {
            name: 'extension',
            items: this.getMediaExt,
            clearable: true,
            outlined: true,
            hideDetails: true,
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
    handleAttachEntity(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormEntity,
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
    handleMoveItem(item) {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormMoveMedia,
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
        this.$store.dispatch('deleteMedia', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
