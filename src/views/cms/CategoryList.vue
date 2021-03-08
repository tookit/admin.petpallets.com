<template>
  <div class="cms-category-list">
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
                <v-row>
                  <v-col cols="6">
                    <v-switch
                      v-model="filter['filter[is_active]']"
                      label="Active"
                    />
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
                <template #[`item.name`]="{ item }">
                  <div>
                    <span>{{ item.name }}</span>
                    <v-icon
                      class="mx-2"
                      size="18"
                      @click="handleShowTranslation('name', item)"
                      >mdi-translate</v-icon
                    >
                  </div>
                  <div>
                    <v-avatar
                      v-for="locale in getLocales"
                      :key="locale.value"
                      class="mr-1"
                      tile
                      size="16"
                    >
                      <img
                        :src="locale.svg"
                        :class="
                          hasTranslation(locale.value, item.translations.name)
                        "
                      />
                    </v-avatar>
                  </div>
                </template>
                <template #[`item.is_active`]="{ item }">
                  <v-switch
                    v-model="item.is_active"
                    @change="
                      handleItemStatus('is_active', item.is_active, item.id)
                    "
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
              </v-grid>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showTranslationDialog">
      <form-translation
        :field="translationField"
        :text="translationText"
        :entity="entity"
        @form:cancel="showTranslationDialog = false"
        @form:success="handleTranslated"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import FormTranslation from '@/components/form/FormTranslation'
export default {
  components: {
    VGrid,
    FormTranslation,
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showTranslationDialog: false,
      translationText: '',
      translationField: 'name',
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[is_active]': null,
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
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Posts',
          value: 'posts_count',
        },
        {
          text: 'Active',
          value: 'is_active',
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
          text: 'Edit Value',
          icon: 'mdi-pencil',
          click: this.handleEditValue,
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
        model: 'App\\Models\\CMS\\Category',
        id: this.selectedItem ? this.selectedItem.id : 0,
      }
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
        'fitler[is_active]': null,
        'filter[name]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchNewsCategory', query)
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
        .dispatch('updateNewsCategory', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: `/cms/category/create`,
      })
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/cms/category/item/${item.id}`,
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteNewsCategory', id).then(() => {
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
      this.$router.replace({
        path: this.$route.path,
      })
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
    //
    hasTranslation(locale, translations) {
      const grey = translations[locale] ? false : true
      return {
        'grey-bg': grey,
      }
    },
    handleShowTranslation(field, item) {
      this.translationField = field
      this.translationText = item[field]
      this.selectedItem = item
      this.showTranslationDialog = true
    },
    handleTranslated() {
      this.showTranslationDialog = false
      this.fetchRecord(this.filter)
    },
  },
}
</script>
