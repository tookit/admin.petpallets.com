<template>
  <div class="crawler-task-list">
    <v-container fluid>
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
                v-model="filter['filter[link]']"
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
                  <v-col :cols="6">
                    <v-autocomplete
                      v-model="filter['filter[vendor_id]']"
                      label="Vendor"
                      placeholdder="Vendor"
                      clearable
                      :items="getVendors"
                      :return-object="false"
                    >
                      <template v-slot:item="data">
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-item-content v-text="data.item" />
                        </template>
                        <template v-else>
                          <v-list-item-content>
                            <v-list-item-title v-text="data.item.text" />
                            <v-list-item-subtitle v-text="data.item.url" />
                          </v-list-item-content>
                        </template>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-btn-toggle v-model="filter['filter[imported]']">
                      <v-btn
                        :value="item"
                        v-for="item in ['Y', 'N']"
                        :key="item"
                      >
                        {{ item }}
                      </v-btn>
                    </v-btn-toggle>
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
                <template v-slot:[`item.link`]="{ item }">
                  <a :href="item.link" target="_blank">{{ item.link }}</a>
                </template>
                <template v-slot:[`item.status`]="{ item }">
                  <v-chip small :color="getTaskStatusColor(item.status)">
                    {{ item.status }}
                  </v-chip>
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
    <v-dialog v-model="showFormDialog" scrollable width="840px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
          <v-spacer />
          <v-btn @click="showFormDialog = false" icon>
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-task :item="selectedItem" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-overlay :value="showOverlay">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import FormTask from '@/components/form/crawler/FormTask'
export default {
  components: {
    VGrid,
    FormTask
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showOverlay: false,
      showFormDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[link]': null,
        'filter[vendor_id]': null,
        'filter[imported]': null,
        'filter[type]': null
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
          text: 'Link',
          value: 'link'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Http Status',
          value: 'http_status'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Imported',
          value: 'imported'
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
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Run Task',
          icon: 'mdi-hammer',
          click: this.handleRunTask
        },
        {
          text: 'Import',
          icon: 'mdi-database-import',
          click: this.handleLinkProduct
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
    ...mapGetters(['getVendors', 'getTaskStatusColor']),
    formTitle() {
      return !this.selectedItems ? 'Create Task' : 'Edit Task'
    }
  },
  watch: {
    '$route.query': {
      handler(data) {
        if (Object.keys(data).length === 0 && data.constructor === Object) {
          this.resetFilter()
          this.fetchRecords(this.filter)
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
      filter.page = parseInt(filter.page)
      filter.pageSize = parseInt(filter.pageSize)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        pageSize: 30,
        'filter[vendor_id]': null,
        'filter[imported]': null,
        'filter[link]': null,
        'filter[type]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchCrawlerTask', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta.total
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showFormDialog = true
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showFormDialog = true
    },
    handleRunTask({ id }) {
      if (window.confirm('Are you sure to run this task ?')) {
        this.showOverlay = true
        this.$store
          .dispatch('runCrawlerTask', id)
          .then(() => {
            this.items = this.items.filter((item) => item.id !== id)
            this.showOverlay = false
          })
          .catch(() => (this.showOverlay = false))
      }
    },
    handleLinkProduct({ id, status, type }) {
      if (type === 'item' && status === 'finished') {
        this.showOverlay = true
        this.$store
          .dispatch('linkProduct', id)
          .then(() => {
            this.showOverlay = false
          })
          .catch(() => (this.showOverlay = false))
      }
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteCrawlerTask', id).then(() => {
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
      this.fetchRecords(this.filter)
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
