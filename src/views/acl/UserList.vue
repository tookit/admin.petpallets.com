<template>
  <div class="acl-user__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            :headers="headers"
            action="fetchUsers"
            search-field="username"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import FormUser from '@/components/form/acl/FormUser'
import ListGrid from '@/components/list/ListGrid'
import { VAvatar, VImg } from 'vuetify/lib'
export default {
  name: 'PageUser',
  components: {
    ListGrid,
  },
  mixins: [ResizeMixin, TooltipMixin],
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
  computed: {},
  watch: {},
  methods: {
    //action
    handleCreateItem() {
      this.$root.$dialog.show({
        component: FormUser,
        data: {
          item: null,
        },
      })
    },
    handleEditItem(item) {
      this.$root.$dialog.show({
        component: FormUser,
        data: {
          item: item,
        },
      })
    },

    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteUser', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
</script>
