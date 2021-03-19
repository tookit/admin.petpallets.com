<template>
  <div class="mall-vendor__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchVendors"
            search-field="name"
            @create="handleCreateItem"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import FormVendor from '@/components/form/vendor/FormVendor'
import ListGrid from '@/components/list/ListGrid'
import { VSelect } from 'vuetify/lib'
export default {
  name: 'PageVendor',
  components: {
    ListGrid,
  },
  mixins: [ResizeMixin, TooltipMixin],
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
          text: 'City',
          value: 'city',
          sortable: true,
        },
        {
          text: 'Website',
          value: 'website',
          sortable: true,
        },
        {
          text: 'Task',
          value: 'tasks_count',
          sortable: false,
        },
        {
          text: 'Products',
          value: 'products_count',
          render: (item) => {
            return this.$createElement(
              'span',
              {
                class: {
                  'v-chip': true,
                  'v-chip--outlined': true,
                },
                props: {
                  text: true,
                  small: true,
                },
              },
              item
            )
          },
        },
        {
          text: 'Created',
          value: 'created_at',
          sortable: true,
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
          text: 'Edit Link Rule',
          icon: 'mdi-hammer',
          click: this.handleEditLink,
        },
        {
          text: 'Edit Item Rule',
          icon: 'mdi-hammer',
          click: this.handleEditItemMap,
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
          element: VSelect,
          props: {
            name: 'city',
            items: ['shenzhen'],
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
        component: FormVendor,
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
        component: FormVendor,
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
        this.$store.dispatch('deleteVendor', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
</script>
