<template>
  <div class="cms-post__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            ref="grid"
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchNews"
            search-field="name"
            @create="handleCreateItem"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormNews from '@/components/form/cms/FormNews'
import ListGrid from '@/components/list/ListGrid'
import { VSwitch, VAvatar, VImg } from 'vuetify/lib'
export default {
  name: 'PagePost',
  components: {
    ListGrid,
  },
  data() {
    return {
      headers: [
        {
          text: this.__('id'),
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
                class: 'ma-2',
                props: {
                  size: 48,
                },
              },
              [this.$createElement(VImg, { props: { src: item.image } })]
            )
          },
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
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
          text: 'Edit Content',
          icon: 'mdi-pencil',
          click: this.handleEditContent,
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
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditConent(item) {},
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
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteNews', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
</script>
