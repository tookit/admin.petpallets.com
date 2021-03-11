<template>
  <div class="mall-vendor-list">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-toolbar flat>
              <v-text-field
                v-model="filter['filter[name]']"
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
import FormVendor from '@/components/form/vendor/FormVendor'
import FormLinkMap from '@/components/form/vendor/FormLinkMap'
import FormItemMap from '@/components/form/vendor/FormItemMap'
export default {
  components: {
    VGrid,
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[name]': null,
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
          value: 'name',
        },
        {
          text: 'City',
          value: 'city',
        },
        {
          text: 'Website',
          value: 'website',
        },
        {
          text: 'Task',
          value: 'tasks_count',
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
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      items: [],
      actions: [
        {
          text: 'View Item',
          icon: 'mdi-eye',
          click: this.handleViewItem,
        },
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
  computed: {
    ...mapGetters(['getLocales']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Property',
        id: this.selectedItem ? this.selectedItem.id : 0,
      }
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
        'filter[name]': null,
        'filter[type]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchVendors', query)
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
      this.$root.$dialog.show({
        title: 'Create Vendor',
        component: FormVendor,
        data: {
          item: null,
        },
      })
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
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
