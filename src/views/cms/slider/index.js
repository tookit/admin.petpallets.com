import FormSlider from '@/components/form/cms/FormSlider'
import ImageViewer from '@/components/image/ImageViewer'
import { VSwitch } from 'vuetify/lib'
export default {
  data() {
    return {
      headers: [
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: 'Image',
          value: 'img',
          sortable: true,
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: [
                  {
                    cloud_url: item.img,
                  },
                ],
              },
            })
          },
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
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
    handleStatusChange(id, field, value) {
      const data = {}
      data[field] = value
      this.$store
        .dispatch('updateSlider', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    handleCreateItem() {
      const dialog = this.$root.$dialog
      dialog.loadComponent({
        component: FormSlider,
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
        component: FormSlider,
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
        this.$store.dispatch('deleteSlider', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
