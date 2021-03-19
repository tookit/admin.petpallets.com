<template>
  <div class="mall-vendor__list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-sheet class="grid-filter">
            <v-toolbar flat>
              <v-text-field
                v-model="filter.name"
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
            <v-sheet v-show="showFilter" flat class="grey lighten-4">
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="handleResetFilter">{{ __('reset') }}</v-btn>
                <v-btn tile color="primary" @click="handleApplyFilter">{{
                  __('apply')
                }}</v-btn>
              </v-card-actions>
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
            <template #[`item.website`]="{ item }">
              <a :href="item.website" target="_blank">{{ item.website }}</a>
            </template>
            <template #[`item.tasks_count`]="{ item }">
              <v-chip
                small
                label
                @click.stop="
                  () => {
                    selectedItem = item
                    showMapDialog = true
                  }
                "
              >
                {{ item.tasks_count }}
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import FormVendor from '@/components/form/vendor/FormVendor'
import FormLinkMap from '@/components/form/vendor/FormLinkMap'
import FormItemMap from '@/components/form/vendor/FormItemMap'
export default {
  name: 'PageVendor',
  components: {
    VGrid,
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      //filter section
      search: '',
      showFilter: true,
      filter: {
        name: null,
      },
      //grid
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      sortBy: [],
      gridOptions: {
        page: 1,
        itemsPerPage: 30,
        sortBy: [],
        sortDesc: [],
      },
      headers: [
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: 'Name',
          value: 'name',
          sortable: true,
        },
        {
          text: 'City',
          value: 'city',
          sortable: true,
        },
        {
          text: 'Website',
          value: 'website',
          sortable: true,
        },
        {
          text: 'Task',
          value: 'tasks_count',
          sortable: false,
        },
        {
          text: 'Products',
          value: 'products_count',
          render: (item) => {
            return this.$createElement(
              'span',
              {
                class: {
                  'v-chip': true,
                  'v-chip--outlined': true,
                },
                props: {
                  text: true,
                  small: true,
                },
              },
              item
            )
          },
        },
        {
          text: 'Created',
          value: 'created_at',
          sortable: true,
        },
        {
          text: 'Action',
          value: 'action',
          sortable: false,
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
          text: 'Edit Link Rule',
          icon: 'mdi-hammer',
          click: this.handleEditLink,
        },
        {
          text: 'Edit Item Rule',
          icon: 'mdi-hammer',
          click: this.handleEditItemMap,
        },
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
      handler(query) {
        this.updatePageConfig(query)
        this.fetchRecords()
      },
      immediate: true,
    },
  },
  methods: {
    //
    updatePageConfig(query) {
      const { page, pageSize, name } = query
      this.gridOptions.page = page ? parseInt(page) : 1
      this.gridOptions.itemsPerPage = pageSize ? parseInt(pageSize) : 30
      this.filter.name = name || null
    },
    buildApiQuery() {
      return {
        sort: this.gridOptions.sortBy[0],
        page: this.gridOptions.page,
        pageSize: this.gridOptions.itemsPerPage,
        'filter[name]': this.filter.name,
      }
    },
    buildRouteQuery() {
      return {
        ...this.filter,
        sort: this.gridOptions.sortBy[0],
        page: this.gridOptions.page,
        pageSize: this.gridOptions.itemsPerPage,
      }
    },
    fetchRecords() {
      const params = this.buildApiQuery()
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchVendors', params)
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
    //action
    handleCreateItem() {
      this.$root.$dialog.show({
        title: 'Create Vendor',
        component: FormVendor,
        data: {
          item: null,
        },
      })
    },
    handleEditItem(item) {
      this.$root.$dialog.show({
        title: 'Edit Vendor',
        component: FormVendor,
        data: {
          item: item,
        },
      })
    },
    handleEditLink(item) {
      this.$root.$dialog.show({
        title: `Edit Link Map - ${item.website}`,
        component: FormLinkMap,
        data: {
          item: item,
        },
      })
    },
    handleEditItemMap(item) {
      this.$root.$dialog.show({
        title: `Edit Data Map - ${item.website}`,
        component: FormItemMap,
        data: {
          item: item,
        },
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteVendor', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
</script>
