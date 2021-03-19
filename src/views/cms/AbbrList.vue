<template>
  <div class="cms-abbr__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            ref="grid"
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchAbbr"
            search-field="name"
            @create="handleCreateItem"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormAbbr from '@/components/form/cms/FormAbbr'
import ListGrid from '@/components/list/ListGrid'
import ImageViewer from '@/components/image/ImageViewer'
export default {
  name: 'PageAbbr',
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
          text: 'Media',
          value: 'media',
          sortable: false,
          render: (item) => {
            return this.$createElement(ImageViewer, {
              props: {
                items: item,
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
        this.$store.dispatch('deleteUser', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
</script>
