<template>
  <div class="property-value-list">
    <v-card>
      <v-toolbar flat>
        <v-text-field
          text
          solo
          flat
          :prepend-icon="
            showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'
          "
          append-icon="mdi-magnify"
          :placeholder="__('search')"
          v-model="filter['filter[property.name]']"
          hide-details
          clearable
          @keyup.enter="handleApplyFilter"
          @click:append="handleApplyFilter"
          @click:prepend="showFilter = !showFilter"
          @click:clear="handleClear"
        />
        <v-btn @click="handleRefreshItem" icon>
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn @click="handleCreateItem" icon>
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row> </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="handleResetFilter" text>{{
            __('$vuetify.reset')
          }}</v-btn>
          <v-btn tile @click="handleApplyFilter" color="primary">{{
            __('$vuetify.apply')
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
          @update:page="handlePageChanged"
          @update:items-per-page="handlePageSizeChanged"
          item-key="id"
          show-select
        >
          <template v-slot:[`item.products`]="{ item }">
            <div class="my-2">
              <v-chip
                target="_blank"
                label
                :href="p.href"
                class="mr-1"
                x-small
                v-for="p in item.products"
                :key="p.id"
              >
                {{ p.id }}
              </v-chip>
            </div>
          </template>
          <template v-slot:[`item.action`]="{ item }">
            <v-menu>
              <template v-slot:activator="{ on: menu }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }">
                    <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ __('$vuetify.action') }}</span>
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
    <v-dialog v-model="showValueDialog" width="640">
      <v-card>
        <v-toolbar dark flat color="primary">
          Property Value
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-property-value
            :propertyId="propertyId"
            :item="selectedItem"
            @form:success="handleFormSuccess"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import FormPropertyValue from '@/components/form/product/FormPropertyValue'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
export default {
  components: { FormPropertyValue },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    propertyId: [Number, String]
  },
  data() {
    return {
      showValueDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[name]': null
      },
      // table
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id'
        },
        {
          text: this.__('name'),
          value: 'property_name',
        },
        {
          text: this.__('value'),
          value: 'value',
          sortable: true,
          width: 250
        },

        {
          text: this.__('Products'),
          value: 'products'
        },
        {
          text: this.__('action'),
          value: 'action'
        }
      ],
      items: [],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem
        }
      ]
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
      immediate: true
    }
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
        'filter[name]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchValueById', { id: this.propertyId, query: query })
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta ? meta.total : data.length
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleUpdateField(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateCategoryProperty', {
          id: id,
          data: data
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showValueDialog = true
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showValueDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deletePropertyValue', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
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
        query: this.filter
      })
    },
    handlePageSizeChanged(size) {
      this.filter.pageSize = size
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
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
        query: this.filter
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    handleFormSuccess() {
      this.showValueDialog = false
      this.fetchRecords()
    }
  }
}
</script>
