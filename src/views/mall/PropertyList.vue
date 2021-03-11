<template>
  <div class="mall-property-list">
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
                @update:page="handlePageChanged"
                @update:items-per-page="handlePageSizeChanged"
              >
                <template #[`item.name`]="{ item }">
                  <div>
                    <span>{{ item.name }}</span>
                    <v-icon
                      class="mx-2"
                      size="18"
                      @click.stop="handleShowTranslation('name', item)"
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
                <template #[`item.values`]="{ item }">
                  <v-chip
                    v-for="val in item.values.slice(0, 3)"
                    :key="val.slug"
                    class="mr-1"
                    x-small
                    label
                  >
                    {{ val.value }}
                  </v-chip>
                  <v-icon small @click="handleEditValue(item)">
                    {{
                      item.values.length > 0
                        ? 'mdi-dots-horizontal'
                        : 'mdi-plus'
                    }}</v-icon
                  >
                </template>
                <template #[`item.type`]="{ item }">
                  <v-select
                    v-model="item.type"
                    dense
                    :items="['sku', 'spu']"
                    @change="handleItemStatus('type', item.type, item.id)"
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
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showTranslation" width="640" scrollable>
      <form-translation
        style="height: 80vh"
        :field="translationField"
        :text="translationText"
        :entity="entity"
        @form:cancel="showTranslation = false"
        @form:success="handleTranslated"
      />
    </v-dialog>
    <v-dialog v-model="showPropertyDialog" scrollable width="800">
      <form-property
        :item="selectedItem"
        @click:close="showPropertyDialog = false"
      />
    </v-dialog>
    <v-dialog v-model="showValueDialog" scrollable width="800">
      <v-card>
        <v-toolbar flat dark color="primary">
          <v-toolbar-title> Value </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showValueDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <property-value-table v-if="selectedItem" :property="selectedItem" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import FormTranslation from '@/components/form/FormTranslation'
import FormProperty from '@/components/form/product/FormProperty'
import PropertyValueTable from '@/components/table/PropertyValueTable'
export default {
  name: 'PropertyList',
  components: {
    FormTranslation,
    FormProperty,
    PropertyValueTable,
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showValueDialog: false,
      showPropertyDialog: false,
      // trans
      showTranslation: false,
      translationText: '',
      translationField: 'name',
      translatable: ['name'],
      //
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
          width: 50,
        },
        {
          text: 'Name',
          value: 'name',
        },
        {
          text: 'Value',
          value: 'values',
        },
        {
          text: 'Type',
          value: 'type',
          width: 100,
        },
        {
          text: 'Unit',
          value: 'unit',
          width: 100,
        },
        {
          text: 'Action',
          value: 'action',
          width: 100,
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
        'filter[name]': null,
        'filter[type]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchProperty', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta.total
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleEditValue(item) {
      this.selectedItem = item
      this.showValueDialog = true
    },
    handleItemStatus(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateProperty', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showPropertyDialog = true
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showPropertyDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteProperty', id).then(() => {
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
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.filter,
          t: Date.now(),
        },
      })
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: {
          ...this.filter,
          t: Date.now(),
        },
      })
    },
    handleClear() {
      this.resetFilter()
      this.$router.replace({
        path: this.$route.path,
      })
    },
    //trans
    handleShowTranslation(field, item) {
      this.translationField = field
      this.translationText = item[field]
      this.selectedItem = item
      this.showTranslation = true
    },
    hasTranslation(locale, translations) {
      const grey = translations[locale] ? false : true
      return {
        'grey-bg': grey,
      }
    },
    handleTranslated() {
      this.showTranslation = false
      this.fetchRecord(this.filter)
    },
  },
}
</script>
