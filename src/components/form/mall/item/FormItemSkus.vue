<template>
  <v-card>
    <v-toolbar v-show="showHeader" tile flat height="48">
      <v-toolbar-title>{{ name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="fetchRecords(id)">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <!-- Sku Property -->
    <!-- Sku Table -->
    <v-data-table
      v-model="selectedItems"
      :loading="loadingItems"
      :headers="computedHeaders"
      :items="items"
      :footer-props="{ itemsPerPageOptions: [15, 30, 50] }"
      item-key="id"
      :show-select="showSelect"
      single-select
    >
      <template #[`item.quantity_price`]="{ item }">
        <span>{{ item.quantity_price[0] }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'FormItemSkus',
  props: {
    id: [Number, String],
    showHeader: Boolean,
    name: String,
  },
  data() {
    return {
      //
      loadingItems: false,
      showSelect: false,
      selectedItems: [],
      headers: [
        {
          text: 'Sku',
          value: 'sku_code',
        },
        {
          text: 'Image',
          value: 'url',
        },
        {
          text: 'Stock',
          value: 'stock',
        },
        {
          text: 'Price',
          value: 'price',
        },
        {
          text: 'Batch Price',
          value: 'quantity_price',
        },
      ],
      sku_definition: [],
      items: [],
      serverItemsLength: 0,
    }
  },

  computed: {
    computedHeaders() {
      const headers = this.sku_definition.map((item) => {
        return {
          text: item.property_name,
          value: item.property_name,
        }
      })
      return [...headers, ...this.headers]
    },
  },
  watch: {
    id: {
      handler(id) {
        this.fetchRecords(id)
      },
      immediate: true,
    },
  },
  methods: {
    initState() {
      this.loadingItems = true
      this.items = []
    },

    fetchRecords(id) {
      this.initState()
      this.$store
        .dispatch('fetchSkuByProductId', id)
        .then(({ data }) => {
          const { sku_definition, skus } = data
          this.items = skus
          this.sku_definition = sku_definition
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
  },
}
</script>
