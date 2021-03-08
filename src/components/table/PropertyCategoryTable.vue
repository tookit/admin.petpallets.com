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
      </v-toolbar>
      <v-divider />
      <v-card v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row>
            <v-col cols="6">
              <v-switch
                v-model="filter['filter[searchable]']"
                label="Searchable"
                true-value="1"
              />
            </v-col>
            <v-col>
              <v-btn-toggle v-model="filter['filter[type]']">
                <v-btn value="sku"> SKU </v-btn>
                <v-btn value="spu"> SPU </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
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
          dense
          @update:page="handlePageChanged"
          @update:items-per-page="handlePageSizeChanged"
        >
          <template #[`item.searchable`]="{ item }">
            <v-switch
              v-model="item.searchable"
              @change="
                handleUpdateField('searchable', item.searchable, item.id)
              "
            />
          </template>
          <template #[`item.options`]="{ item }">
            <v-chip
              v-for="option in item.options"
              :key="option.slug"
              class="ma-1"
              small
              label
            >
              {{ option.value }}
            </v-chip>
          </template>
          <template #[`item.type`]="{ item }">
            <v-select
              v-model="item.type"
              dense
              :items="['sku', 'spu']"
              @change="handleUpdateProperty('type', item.type, item.id)"
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
    <v-dialog v-model="showAttachDialog" scrollable width="860px">
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>Attach property for cateogry </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showAttachDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-category-property
            :category-id="categoryId"
            :property-id="
              selectedItem ? parseInt(selectedItem.property_id) : null
            "
            :options="selectedOptions"
            @attach="fetchRecords(filter)"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FormCategoryProperty from '@/components/form/product/FormCategoryProperty'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
export default {
  components: { FormCategoryProperty },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    categoryId: [Number, String],
  },
  data() {
    return {
      submiting: false,
      showAttachDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[category_id]': this.categoryId,
        'filter[name]': null,
        'filter[searchable]': null,
        'filter[type]': null,
      },
      // table
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: 'Name',
          value: 'property.name',
          width: 200,
        },
        {
          text: 'Option',
          value: 'options',
          width: 200,
        },
        {
          text: 'Searchable',
          value: 'searchable',
        },
        {
          text: 'Type',
          value: 'type',
          width: 100,
        },
        {
          text: 'Action',
          value: 'action',
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
    ...mapGetters(['getLocales']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Property',
        id: this.selectedItem ? this.selectedItem.id : 0,
      }
    },
    selectedOptions() {
      return this.selectedItem
        ? this.selectedItem.options.map((item) => item.value)
        : []
    },
  },
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
        'filter[category_id]': this.categoryId,
        'filter[name]': null,
        'filter[searchable]': null,
        'filter[type]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchCategoryProperty', query)
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
      this.submiting = true
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateCategoryProperty', {
          id: id,
          data: data,
        })
        .then(() => {
          this.submiting = false
        })
    },
    handleUpdateProperty(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateCategoryProperty', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showAttachDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteCategoryProperty', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showAttachDialog = true
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
      this.fetchRecords(this.filter)
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
