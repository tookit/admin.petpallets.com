<template>
  <div class="crawler-task-list">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-toolbar flat>
              <v-text-field
                v-model="filter['filter[link]']"
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
                  <v-col :cols="6">
                    <v-autocomplete
                      v-model="filter['filter[vendor_id]']"
                      label="Vendor"
                      placeholdder="Vendor"
                      clearable
                      :items="getVendors"
                      :return-object="false"
                    >
                      <template #item="data">
                        <v-list-item-content>
                          <v-list-item-title v-text="data.item.text" />
                          <v-list-item-subtitle v-text="data.item.url" />
                        </v-list-item-content>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="6">
                    <v-btn-toggle v-model="filter['filter[imported]']">
                      <v-btn
                        v-for="item in ['Y', 'N']"
                        :key="item"
                        :value="item"
                      >
                        {{ item }}
                      </v-btn>
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
              <v-grid
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
                <template #[`item.link`]="{ item }">
                  <a :href="item.link" target="_blank">{{ item.link }}</a>
                </template>
                <template #[`item.raw_data`]="{ item }">
                  <v-icon
                    :disabled="!item.raw_data"
                    small
                    @click="handleViewRawData(item)"
                    >mdi-database</v-icon
                  >
                </template>
                <template #[`item.status`]="{ item }">
                  <v-chip small :color="getTaskStatusColor(item.status)">
                    {{ item.status }}
                  </v-chip>
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
                        :disabled="computeDisabled(action, item)"
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
          <v-btn icon @click="showFormDialog = false">
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
    <v-dialog v-model="showDataDialog" scrollable width="840px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Data</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="showDataDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <AceEditor
            v-model="rawData"
            lang="json"
            theme="monokai"
            width="100%"
            height="500px"
            :options="{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              fontSize: 14,
              highlightActiveLine: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              showPrintMargin: false,
              showGutter: true,
            }"
            :commands="[
              {
                name: 'save',
                bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
                readOnly: true,
              },
            ]"
            @init="editorInit"
          />
        </v-card-text>
        <v-card-actions class="py-3">
          <v-spacer />
          <v-btn tile color="primary"> save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showRuleDialog" scrollable width="840px">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Rule</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="showRuleDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-item-map />
        </v-card-text>
        <v-card-actions class="py-3">
          <v-spacer />
          <v-btn tile color="primary">save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import FormTask from '@/components/form/crawler/FormTask'
import FormItemMap from '@/components/form/vendor/FormItemMap'
import AceEditor from 'vuejs-ace-editor'
export default {
  name: 'TaskList',
  components: {
    VGrid,
    FormTask,
    AceEditor,
    FormItemMap,
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showRuleDialog: false,
      showDataDialog: false,
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
          text: 'Link',
          value: 'link',
        },
        {
          text: 'Product',
          value: 'product_id',
        },        
        {
          text: 'Type',
          value: 'type',
        },
        {
          text: 'Data',
          value: 'raw_data',
        },
        {
          text: 'Http Status',
          value: 'http_status',
        },
        {
          text: 'Status',
          value: 'status',
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
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Run Task',
          icon: 'mdi-hammer',
          click: this.handleRunTask,
        },
        {
          text: 'Import',
          icon: 'mdi-database-import',
          click: this.handleLinkProduct,
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
    ...mapGetters(['getVendors', 'getTaskStatusColor']),
    formTitle() {
      return !this.selectedItems ? 'Create Task' : 'Edit Task'
    },
    rawData: {
      get() {
        return this.selectedItem
          ? JSON.stringify(this.selectedItem.raw_data, undefined, 2)
          : ''
      },
      set() {},
    },
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
      immediate: true,
    },
  },
  methods: {
    //
    computeDisabled(action, item) {
      switch (action.text) {
        case 'Run Task':
          return !item.rule ? true : false
          break
        case 'Import':
          return !item.raw_data ? true : false
          break
        default:
          return false
          break
      }
    },
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/json') //language
      require('brace/mode/less')
      require('brace/theme/monokai')
      require('brace/snippets/javascript') //snippet
    },
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
        'filter[type]': null,
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
    handleViewRawData(item) {
      this.selectedItem = item
      this.showDataDialog = true
    },
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
            this.handleRefreshItem()
            this.showOverlay = false
          })
          .catch(() => {
            this.showOverlay = false
          })
      }
    },
    handleLinkProduct({ id, status, type }) {
      if (type === 'item' && status === 'finished') {
        this.showOverlay = true
        this.$store
          .dispatch('linkProduct', id)
          .then(() => {
            this.handleRefreshItem()
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
