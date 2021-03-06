import FormUser from '@/components/form/acl/FormUser'
import { VAvatar, VImg, VSelect } from 'vuetify/lib'
export default {
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Avatar',
          value: 'avatar',
          sortable: false,
          render: (item) => {
            return this.$createElement(
              VAvatar,
              {
                props: {
                  size: 32,
                },
              },
              [this.$createElement(VImg, { props: { src: item } })]
            )
          },
        },
        {
          text: 'Username',
          value: 'username',
          sortable: true,
        },
        {
          text: 'Email',
          value: 'email',
          sortable: true,
        },
        {
          text: 'Mobile',
          value: 'mobile',
          sortable: false,
        },
        {
          text: 'Gender',
          value: 'gender',
          sortable: false,
        },
        {
          text: 'Active',
          value: 'active',
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
          _act: 'delete',
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
            name: 'gender',
            items: ['male', 'female', 'other'],
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
        component: FormUser,
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
        component: FormUser,
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
        this.$store.dispatch('deleteUser', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
