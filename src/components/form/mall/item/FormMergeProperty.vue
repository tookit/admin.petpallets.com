<template>
  <v-card>
    <v-toolbar flat dark color="primary">
      <v-toolbar-title>{{ product.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="fetchRecords(product)">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon @click="handleCreateItem">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="handleInheritedProp">
        <v-icon>mdi-set-merge</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-card-text class="pa-0">
      <v-subheader>Category Prop</v-subheader>
      <v-data-table
        :loading="loadingItems"
        :headers="headers"
        :items="catProps"
        dense
        show-select
        hide-default-footer
        disable-pagination
      >
        <template #[`item.options`]="{ item }">
          <v-autocomplete
            class="my-1"
            :items="item.options"
            item-text="value"
            item-value="property_value_id"
            hide-details
            outlined
            dense
            multiple
            :value="computeValue(item, productProps)"
            @change="handleAttachProperty"
          />
        </template>
        <template #[`item.action`]="{ item }">
          <v-icon small @click="attachPropForProduct(item)"
            >mdi-arrow-down</v-icon
          >
        </template>
      </v-data-table>
      <v-divider />
      <v-subheader>Product Prop</v-subheader>
      <v-data-table
        :loading="loadingItems"
        :headers="headers"
        :items="productProps"
        item-key="id"
        dense
        show-select
        hide-default-footer
        disable-pagination
      >
        <template #[`item.options`]="{ item }">
          <span>{{ computeItemOptions(item.options) }}</span>
        </template>
        <template #[`item.action`]="{ item }">
          <v-icon small @click="attachForCategory(item)">mdi-arrow-up</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="showAttachDialog" scrollable width="860px">
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>Attach property for product </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showAttachDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-direct-property
            :product-id="product.id"
            @attach="fetchRecords(filter)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import FormDirectProperty from '@/components/form/product/FormDirectProperty'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
export default {
  components: { FormDirectProperty },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    product: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      showAttachDialog: false,
      // table
      selectedItem: null,
      loadingItems: false,
      headers: [
        {
          text: 'Name',
          value: 'property_name',
          width: 200,
        },
        {
          text: 'Value',
          value: 'options',
          width: 300,
          sortable: false,
        },

        {
          text: 'Action',
          value: 'action',
          width: 50,
        },
      ],
      catProps: [],
      itemProps: [],
      productProps: [],
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
    filteredProps() {
      const props = this.catProps.map((item) => item.property_id)
      return this.productProps.filter((item) => {
        return !props.includes(item.property_id)
      })
    },
  },
  watch: {
    product: {
      handler(item) {
        this.fetchRecords(item)
      },
      immediate: true,
    },
  },
  methods: {
    computeValue(item, itemProps) {
      const find = itemProps.find(
        (prop) => item.property_id === prop.property_id
      )
      return find ? find.options.map((item) => item.property_value_id) : null
    },
    computeItemOptions(options) {
      return options.map((option) => option.value).join(',')
    },
    fetchRecords(item) {
      this.loadingItems = true
      this.catProps = this.productProps = []

      return this.$store
        .dispatch('getPropertyValuesByProductId', item.id)
        .then(({ data }) => {
          this.catProps = data.category
          this.productProps = data.item
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },

    handleCreateItem() {
      this.showAttachDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteProductProperty', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
    handleAttachProperty(val) {
      const payload = {
        id: this.product.id,
        data: val,
      }
      this.$store.dispatch('attachPropsForProduct', payload)
    },
    attachForCategory(item) {
      const data = {
        category_id: this.product.category_id,
        property_id: item.property_id,
        options: item.options.map((option) => option.value),
      }
      this.$store.dispatch('createCategoryProperty', data).then(() => {
        this.productProps = this.productProps.filter(
          (prop) => prop.property_id !== item.property_id
        )
      })
    },
    attachPropForProduct(item) {
      console.log(item)
    },
    handleInheritedProp() {
      const category_id = this.product.category_id
      this.$store.dispatch('importCategoryProp', category_id)
    },
  },
}
</script>
