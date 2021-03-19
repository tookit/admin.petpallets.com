<template>
  <div class="acl-user__list">
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
import FormUser from '@/components/form/acl/FormUser'
import { VAvatar, VImg } from 'vuetify/lib'
export default {
  name: 'PageUser',
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
        username: null,
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
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Avatar',
          value: 'avatar',
          sortable: false,
          render: (item) => {
            return this.$createElement(
              VAvatar,
              {
                props: {
                  size: 32,
                },
              },
              [this.$createElement(VImg, { props: { src: item } })]
            )
          },
        },
        {
          text: 'Username',
          value: 'username',
          sortable: true,
        },
        {
          text: 'Email',
          value: 'email',
          sortable: true,
        },
        {
          text: 'Mobile',
          value: 'mobile',
          sortable: false,
        },
        {
          text: 'Gender',
          value: 'gender',
          sortable: false,
        },
        {
          text: 'Active',
          value: 'active',
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
      const { page, pageSize, username } = query
      this.gridOptions.page = page ? parseInt(page) : 1
      this.gridOptions.itemsPerPage = pageSize ? parseInt(pageSize) : 30
      this.filter.username = username || null
    },
    buildApiQuery() {
      return {
        sort: this.gridOptions.sortBy[0],
        page: this.gridOptions.page,
        pageSize: this.gridOptions.itemsPerPage,
        'filter[username]': this.filter.name,
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
        .dispatch('fetchUsers', params)
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
        component: FormUser,
        data: {
          item: null,
        },
      })
    },
    handleEditItem(item) {
      this.$root.$dialog.show({
        component: FormUser,
        data: {
          item: item,
        },
      })
    },

    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteUser', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
</script>
