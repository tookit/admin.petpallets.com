<template>
  <div class="cms-category__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            ref="grid"
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchNewsCategory"
            search-field="name"
            @create="handleCreateItem"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormNewsCategory from '@/components/form/cms/FormNewsCategory'
import ListGrid from '@/components/list/ListGrid'
import { VSwitch } from 'vuetify/lib'
export default {
  name: 'PageCmsCategory',
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
          text: 'Name',
          value: 'name',
          sortable: true,
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
          text: 'Edit Value',
          icon: 'mdi-pencil',
          click: this.handleEditValue,
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
        this.$store.dispatch('deleteUser', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
</script>
