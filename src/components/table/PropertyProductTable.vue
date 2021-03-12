<template>
  <div class="mall-property-list">
    <v-card>
      <v-toolbar flat>
        <v-text-field
          v-model="filter['filter[property.name]']"
          text
          solo
          flat
          :prepend-icon="
            showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'
          "
          append-icon="mdi-magnify"
          :placeholder="__('search')"
          hide-details
          clearable
          @keyup.enter="handleApplyFilter"
          @click:append="handleApplyFilter"
          @click:prepend="showFilter = !showFilter"
          @click:clear="handleClear"
        />
        <v-btn icon @click="handleRefreshItem">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn icon @click="handleCreateItem">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn icon @click="showSpecDialog = true">
          <v-icon>mdi-cloud</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row> </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="handleResetFilter">{{ __('reset') }}</v-btn>
          <v-btn tile color="primary" @click="handleApplyFilter">{{
            __('apply')
          }}</v-btn>
        </v-card-actions>
      </v-card>
      <v-card-text class="pa-0">
        <v-data-table
          :loading="loadingItems"
          :headers="headers"
          :items="items"
          :footer-props="{ itemsPerPageOptions: [15, 30, 50] }"
          :server-items-length="serverItemsLength"
          :items-per-page.sync="filter['pageSize']"
          :page.sync="filter['page']"
          item-key="id"
          show-select
          @update:page="handlePageChanged"
          @update:items-per-page="handlePageSizeChanged"
        >
          <template #[`item.type`]="{ item }">
            <v-select
              v-model="item.type"
              :items="['spu', 'sku']"
              dense
              @change="handleUpdateField('type', item)"
            />
          </template>
          <template #[`item.action`]="{ item }">
            <v-menu>
              <template #activator="{ on: menu }">
                <v-tooltip bottom>
                  <template #activator="{ on: tooltip }">
                    <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ __('action') }}</span>
                </v-tooltip>
              </template>
              <v-list class="pa-0" dense>
                <v-list-item
                  v-for="action in actions"
                  :key="action.text"
                  @click="action.click(item)"
                >
                  <v-list-item-icon class="mr-2">
                    <v-icon small>{{ action.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title>{{ action.text }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="showAttachDialog" scrollable width="860px">
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>Attach property for product </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showAttachDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-direct-property
            :product-id="productId"
            @attach="fetchRecords(filter)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showSpecDialog" scrollable width="1024px">
      <form-spec-import
        in-dialog
        height="500px"
        :product-id="productId"
        @form:success="fetchRecords(filter)"
        @dialog:close="showSpecDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import FormDirectProperty from '@/components/form/product/FormDirectProperty'
import FormSpecImport from '@/components/form/product/FormSpecImport'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
export default {
  components: { FormDirectProperty, FormSpecImport },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    productId: [Number, String],
    categoryId: [Number, String],
  },
  data() {
    return {
      showSpecDialog: false,
      showAttachDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[product_id]': this.productId,
        'filter[name]': null,
      },
      // table
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id',
          width: 50,
        },
        {
          text: this.__('name'),
          value: 'property_value.property_name',
          width: 250,
        },
        {
          text: this.__('value'),
          value: 'property_value.value',
        },

        {
          text: this.__('type'),
          value: 'type',
          width: 100,
        },
        {
          text: this.__('action'),
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
  computed: {},
  watch: {
    '$route.query': {
      handler(data) {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          this.resetFilter()
          this.fetchRecords()
        } else {
          const query = this.updateFilterQuery(data)
          this.fetchRecords(query)
        }
      },
      immediate: true,
    },
    productId: {
      handler(id) {
        this.filter['filter[product_id]'] = id
        this.fetchRecords(this.filter)
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      filter.page = parseInt(filter.page)
      filter.pageSize = parseInt(filter.pageSize)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        pageSize: 30,
        'filter[product_id]': this.productId,
        'filter[name]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchProductProperty', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta ? meta.total : data.length
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleUpdateField(field, item) {
      let data = {}
      data[field] = item[field]
      this.$store
        .dispatch('updateProductProperty', {
          id: item.id,
          data: data,
        })
        .then(() => {})
    },
    //action
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
    handleEditValue(item) {
      this.selectedItem = item
      this.showPropertyDialog = true
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    // filter
    handlePageChanged(page) {
      this.filter.page = page
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handlePageSizeChanged(size) {
      this.filter.pageSize = size
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleResetFilter() {
      this.resetFilter()
      this.fetchRecords()
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
  },
}
</script>
