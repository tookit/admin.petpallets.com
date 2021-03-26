<template>
  <div class="mall-quote__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <list-grid
            ref="grid"
            :headers="headers"
            :filter-items="filterItems"
            :actions="actions"
            action="fetchQuotes"
            search-field="name"
          />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ListGrid from '@/components/list/ListGrid'
export default {
  name: 'PageQuote',
  components: {
    ListGrid,
  },
  data() {
    return {
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Username',
          value: 'username',
        },
        {
          text: 'Email',
          value: 'email',
        },
        {
          text: 'Phone',
          value: 'mobile',
        },
        {
          text: 'Product',
          value: 'product',
          render: (item) => {
            return this.$createElement(
              'a',
              {
                domProps: {
                  href: item.product.href,
                  target: '_blank',
                },
              },
              item.product.id
            )
          },
        },
        {
          text: 'Remark',
          value: 'remark',
        },
        {
          text: 'Ip',
          value: 'ip',
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
      items: [],
      actions: [
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
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteQuote', id).then(() => {
          this.$refs.grid.fetchRecords()
        })
      }
    },
  },
}
</script>
