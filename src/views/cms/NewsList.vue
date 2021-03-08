<template>
  <div class="cms-news-list">
    <v-container>
      <v-row>
        <v-col cols="12">
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
                v-model="filter['filter[name]']"
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
                <v-row>
                  <v-col cols="6">
                    <v-switch
                      label="Active"
                      v-model="filter['filter[is_active]']"
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-autocomplete
                      v-model="filter['filter[category_id]']"
                      label="Category"
                      placeholder="Category"
                      clearable
                      :items="getCmsCategories"
                      :return-object="false"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleResetFilter" text>{{ __('reset') }}</v-btn>
                <v-btn tile @click="handleApplyFilter" color="primary">{{
                  __('apply')
                }}</v-btn>
              </v-card-actions>
            </v-card>
            <v-card-text class="pa-0">
              <v-grid
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
                <template v-slot:[`item.is_active`]="{ item }">
                  <v-switch
                    v-model="item.is_active"
                    @change="
                      handleItemStatus('is_active', item.is_active, item.id)
                    "
                  />
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
              </v-grid>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
export default {
  components: {
    VGrid
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showPropertyDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[is_active]': null,
        'filter[category_id]': null
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
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Category',
          value: 'category.name'
        },
        {
          text: 'Active',
          value: 'is_active'
        },
        {
          text: 'Created',
          value: 'created_at'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      items: [],
      actions: [
        {
          text: 'View Item',
          icon: 'mdi-eye',
          click: this.handleViewItem
        },
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Edit Value',
          icon: 'mdi-pencil',
          click: this.handleEditValue
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getCmsCategories']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Property',
        id: this.selectedItem ? this.selectedItem.id : 0
      }
    }
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
      immediate: true
    }
  },
  created() {},
  methods: {
    //
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      const category_id = filter['filter[category_id]']
      filter['filter[category_id]'] = category_id ? parseInt(category_id) : null
      filter.page = parseInt(filter.page)
      filter.pageSize = parseInt(filter.pageSize)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        pageSize: 30,
        'filter[is_active]': null,
        'filter[category_id]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchNews', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta.total
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleItemStatus(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateNews', {
          id: id,
          data: data
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: `/cms/news/create`
      })
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/cms/news/item/${item.id}`
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteNews', id).then(() => {
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
      this.$router.replace({
        path: this.$route.path
      })
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
    }
  }
}
</script>
