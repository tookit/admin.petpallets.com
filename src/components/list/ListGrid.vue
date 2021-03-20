<template>
  <div class="list-grid">
    <v-sheet class="list-grid__filter">
      <v-toolbar flat>
        <v-text-field
          v-model="search"
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
        <v-btn icon @click="$emit('create')">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-sheet v-show="showFilter">
        <v-form-builder
          v-model="filters"
          tile
          class="grey lighten-4"
          :items="filterItems"
          color="primary"
          cancel-text="reset"
          save-text="apply"
          @form:cancel="handleResetFilter"
          @form:submit="handleApplyFilter"
        />
      </v-sheet>
    </v-sheet>
    <v-grid
      :loading="loadingItems"
      :headers="headers"
      :items="items"
      :footer-props="{ itemsPerPageOptions: [15, 30, 50] }"
      :server-items-length="serverItemsLength"
      :options.sync="gridOptions"
      item-key="id"
      show-select
      @update:items-per-page="handleApplyFilter"
      @update:page="handleApplyFilter"
      @update:sort-by="handleApplyFilter"
    >
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
              v-for="act in actions"
              :key="act.text"
              @click="handleAction(act, item)"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small>{{ act.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ act.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template
        v-for="(_, name) in $scopedSlots"
        :slot="name"
        slot-scope="slotData"
      >
        <slot :name="name" v-bind="slotData" />
      </template>
    </v-grid>
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import VFormBuilder from '@/components/builder/VFormBuilder'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
export default {
  components: {
    VGrid,
    VFormBuilder,
  },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    actions: {
      type: Array,
      default: () => [],
    },
    filterItems: {
      type: Array,
      default: () => [],
    },
    searchField: {
      type: String,
      default: 'name',
    },
    action: {
      type: String,
    },
  },
  data() {
    return {
      //filter section
      search: '',
      filters: {},
      showFilter: true,
      //grid
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      gridOptions: {
        page: 1,
        itemsPerPage: 30,
        sortBy: [],
        sortDesc: [],
      },
      items: [],
    }
  },
  computed: {},
  watch: {
    '$route.query': {
      handler(query) {
        this.updateListOption(query)
        this.fetchRecords()
      },
      immediate: true,
    },
  },
  methods: {
    updateListOption(query) {
      const { page, pageSize } = query
      this.gridOptions.page = page ? parseInt(page) : 1
      this.gridOptions.itemsPerPage = pageSize ? parseInt(pageSize) : 30
      this.search = getObjectValueByPath(query, this.searchField)
      this.filterItems.forEach((item) => {
        const key = item.props.name
        this.filters[key] = getObjectValueByPath(query, key) || null
      })
    },
    buildApiQuery() {
      const query = {
        sort: this.gridOptions.sortBy[0],
        page: this.gridOptions.page,
        pageSize: this.gridOptions.itemsPerPage,
      }
      const filterKey = `filter[${this.searchField}]`
      query[filterKey] = this.search
      for (let key in this.filters) {
        let k = [`filter[${key}]`]
        query[k] = this.filters[key]
      }
      return query
    },
    buildRouteQuery() {
      this.filters[this.searchField] = this.search
      return {
        ...this.filters,
        sort: this.gridOptions.sortBy[0],
        page: this.gridOptions.page,
        pageSize: this.gridOptions.itemsPerPage,
      }
    },
    fetchRecords() {
      const params = this.buildApiQuery()
      this.loadingItems = true
      this.items = []
      this.$store
        .dispatch(this.action, params)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta.total
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    // filter
    handleRefreshItem() {
      this.fetchRecords()
    },
    handleResetFilter() {
      this.$router.replace({
        path: this.$route.path,
        query: {},
      })
    },
    handleApplyFilter() {
      const query = this.buildRouteQuery()
      query.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: query,
      })
    },
    handleClear() {
      this.$router.replace({
        path: this.$route.path,
        query: {},
      })
    },
    handleAction(act, item) {
      act.click.apply(this, [item])
    },
  },
}
</script>
