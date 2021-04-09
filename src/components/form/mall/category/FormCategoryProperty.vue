<template>
  <v-card>
    <v-toolbar v-show="showHeader" tile flat height="48">
      <v-toolbar-title>{{ id }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="fetchRecords(id)">
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
      <v-data-table
        v-model="selectedItems"
        :loading="loadingItems"
        :headers="headers"
        :items="items"
        dense
        show-select
        single-select
        item-key="property_id"
        hide-default-footer
        disable-pagination
        @click:row="handleRowClick"
      >
        <template #[`item.options`]="{ item }">
          <v-autocomplete
            v-model="item.values"
            class="my-1"
            :items="getPropertyValuesById(item.property_id)"
            item-text="value"
            item-value="id"
            hide-details
            outlined
            dense
            multiple
            small-chips
            deletable-chips
          />
        </template>
        <template #[`item.action`]="{ item }">
          <v-icon small @click="handleDeleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
      <v-divider />
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn :loading="loading" color="primary" @click="handleAttachProperty"
        >Save</v-btn
      >
    </v-card-actions>
    <v-dialog v-model="showAttachDialog" scrollable width="860px">
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>Attach property for product </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showAttachDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-direct-property :product-id="id" @attach="fetchRecords(id)" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import FormDirectProperty from '@/components/form/product/FormDirectProperty'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import { mapGetters } from 'vuex'
export default {
  components: { FormDirectProperty },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    id: [Number, String], // category id
    showHeader: Boolean,
  },
  data() {
    return {
      showAttachDialog: false,
      loading: false,
      selectedItems: [],
      loadingItems: false,
      headers: [
        {
          text: 'name',
          value: 'property_name',
          width: 200,
        },
        {
          text: 'value',
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
      items: [],
    }
  },
  computed: {
    ...mapGetters(['getPropertyValuesById']),
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
    computeValue(item, itemProps) {
      const find = itemProps.find(
        (prop) => item.property_id === prop.property_id
      )
      return find ? find.options.map((item) => item.property_value_id) : null
    },
    computeItemOptions(options) {
      return options.map((option) => option.value).join(',')
    },
    fetchRecords(id) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('getCategoryPropertyById', id)
        .then(({ data }) => {
          this.items = data
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },

    handleCreateItem() {
      this.showAttachDialog = true
    },
    handleDeleteItem(item) {
      this.productProps = this.productProps.filter(
        (prop) => prop.property_id !== item.property_id
      )
      this.handleAttachProperty()
    },
    handleAttachProperty() {
      const values = this.productProps.map((item) => item.values).flat()
      const payload = {
        id: this.product.id,
        data: values,
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
    handleRowClick(row) {
      this.selectedItems = [row]
    },
  },
}
</script>
