<template>
  <div class="cms-slider__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            ref="grid"
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchSlider"
            search-field="name"
            @create="handleCreateItem"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormSlider from '@/components/form/cms/FormSlider'
import ListGrid from '@/components/list/ListGrid'
import ImageViewer from '@/components/image/ImageViewer'
export default {
  name: 'PageSlider',
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
</script>
