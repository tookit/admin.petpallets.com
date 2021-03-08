<template>
  <div class="mall-item-list">
    <v-container fluid>
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
                  <v-col cols="8">
                    <v-cascader
                      v-model="filter['filter[categories.id]']"
                      name="categories"
                      placeholder="Category"
                      item-text="name"
                      item-value="id"
                      outlined
                      :items="getProductCategories"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-autocomplete
                      v-model="filter['filter[vendor_id]']"
                      label="Vendor"
                      placeholdder="Vendor"
                      clearable
                      outlined
                      hide-details
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
                  <v-col cols="4">
                    <v-select
                      v-model="filter['filter[flag]']"
                      label="Flag"
                      :items="getProductFlags"
                      hide-details
                      clearable
                      outlined
                    />
                  </v-col>

                  <v-col cols="4">
                    <v-btn-toggle v-model="filter['filter[is_active]']">
                      <v-btn value="1"> Online </v-btn>
                      <v-btn value="0"> Offline </v-btn>
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
                v-model="selectedItems"
                :loading="loadingItems"
                :headers="headers"
                :items="items"
                :footer-props="{ itemsPerPageOptions: [15, 30, 50] }"
                :server-items-length="serverItemsLength"
                :items-per-page.sync="filter['pageSize']"
                :page.sync="filter['page']"
                item-key="id"
                show-select
                fixed-header
                @update:page="handlePageChanged"
                @update:items-per-page="handlePageSizeChanged"
              >
                <template #[`item.media`]="{ item }">
                  <template v-if="item.media && item.media.length > 0">
                    <v-img
                      class="ma-3"
                      :src="item.media[0].tiny_image"
                      width="50"
                      height="50"
                      @click="handleShowLightBox(item)"
                    />
                  </template>
                  <template v-else>
                    <v-icon
                      size="35"
                      @click="
                        () => {
                          selectedItem = item
                          showImageDialog = true
                        }
                      "
                      >mdi-image-plus</v-icon
                    >
                  </template>
                </template>
                <template #[`item.flag`]="{ item }">
                  <v-select
                    v-model="item.flag"
                    label="Flag"
                    dense
                    :items="getProductFlags"
                    @change="handleFlagChange(item)"
                  />
                </template>
                <template #[`item.vendor.name`]="{ item }">
                  <a :href="item.reference_url" target="_blank">
                    {{ item.vendor.name }}</a
                  >
                </template>
                <template #[`item.name`]="{ item }">
                  <a :href="item.href" target="_blank"> {{ item.name }} </a>
                  <br />
                  <v-icon small @click="handleEditProp(item)"
                    >mdi-pencil</v-icon
                  >
                </template>
                <template #[`item.is_active`]="{ item }">
                  <v-switch
                    v-model="item.is_active"
                    @change="
                      handleItemStatus('is_active', item.is_active, item.id)
                    "
                  />
                </template>
                <template #[`item.categories`]="{ item }">
                  <template v-for="(c, key) in item.categories">
                    <span :key="key" class="caption">
                      {{ c.name }}
                      <template v-if="key !== item.categories.length - 1">
                        <v-icon size="12">mdi-arrow-right</v-icon>
                      </template>
                      <template v-else>
                        <br />
                        <v-icon small @click="handleViewCategory(c)"
                          >mdi-hammer</v-icon
                        >
                      </template>
                    </span>
                  </template>
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
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="imgs"
      @hide="showLightbox = false"
    />
    <v-dialog
      v-if="selectedItem"
      v-model="showFormProperty"
      width="1240"
      scrollable
    >
      <v-sheet class="d-flex flex-row">
        <div class="flex">
          <property-product-table :product-id="selectedItem.id" />
        </div>
        <div class="flex pa-3">
          // eslint-disable-next-line vue/no-v-html
          <div v-html="selectedItem.specs" />
        </div>
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import VCascader from '@/components/cascader/'
import { mapGetters } from 'vuex'
import PropertyProductTable from '../../components/table/PropertyProductTable.vue'
export default {
  name: 'ProductList',
  showFormProperty: false,
  components: { VCascader, PropertyProductTable },
  mixins: [TooltipMixin],
  data() {
    return {
      showFormProperty: false,
      showImageDialog: false,
      selectedMedias: [],
      // lightbox
      images: [],
      showLightbox: false,
      // trans
      showTranslation: false,
      translationText: '',
      translationField: 'name',
      //
      //filter
      search: '',
      showFilter: true,
      categories: [],
      filter: {
        page: 1,
        pageSize: 30,
        'filter[name]': null,
        'filter[flag]': null,
        'filter[is_active]': null,
        'filter[vendor_id]': null,
        'filter[categories.id]': null,
      },
      // table
      loadingItems: false,
      selectedItem: null,
      selectedItems: [],
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: this.__('image'),
          value: 'media',
          align: 'center',
        },
        {
          text: this.__('name'),
          value: 'name',
        },
        {
          text: this.__('vendor'),
          value: 'vendor.name',
        },
        {
          text: this.__('category'),
          value: 'categories',
          width: 250,
        },
        {
          text: this.__('flag'),
          value: 'flag',
          width: 150,
        },
        {
          text: this.__('active'),
          value: 'is_active',
        },
        {
          text: this.__('action'),
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
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  computed: {
    ...mapGetters([
      'getProductCategories',
      'getProductFlags',
      'getFlagLabel',
      'getVendors',
    ]),
    imgs() {
      let temp = []
      this.items.forEach((item) => {
        item.media.forEach((m) => {
          temp.push({
            src: m.cloud_url,
            title: item.name,
          })
        })
      })
      return temp
    },
    directory() {
      return this.selectedItem ? `fiber/${this.selectedItem.id}` : 'fiber'
    },
    entity() {
      return {
        model: 'App\\Models\\Mall\\Product',
        id: this.selectedItem ? this.selectedItem.id : 0,
      }
    },
    filtered() {
      return !(
        this.filter['filter[name]'] === null &&
        this.filter['filter[flag]'] === null &&
        this.filter['filter[is_active]'] === null
      )
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
    handleAttachMedia() {
      this.$store.dispatch('attachEntityForMedia', {
        entity: this.entity.model,
        entityId: this.entity.id,
        id: this.selectedMedias[0].id,
        tag: 'product',
      })
    },
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      const flag = filter['filter[flag]']
      const cid = filter['filter[categories.id]']
      filter['filter[categories.id]'] = cid ? parseInt(cid) : null
      filter['filter[flag]'] = flag ? parseInt(flag) : null
      filter.page = parseInt(filter.page)
      filter.pageSize = parseInt(filter.pageSize)
      return filter
    },
    resetFilter() {
      this.filter = {
        page: 1,
        pageSize: 30,
        'filter[name]': null,
        'filter[flag]': null,
        'filter[is_active]': null,
        'filter[vendor_id]': null,
        'filter[categories.id]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchProducts', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta.total
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    handleFlagChange({ id, flag }) {
      this.$store
        .dispatch('updateProduct', {
          id: id,
          data: {
            flag: flag,
          },
        })
        .then(() => {})
    },
    handleItemStatus(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateProduct', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    //action
    handleEditProp(item) {
      this.selectedItem = item
      this.showFormProperty = true
    },
    handleCreateItem() {
      this.$router.push({
        path: `/mall/product/create`,
      })
    },
    handleViewCategory(c) {
      let routeData = this.$router.resolve({
        path: `/mall/category/item/${c.id}`,
      })
      window.open(routeData.href, '_blank')
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      let routeData = this.$router.resolve({
        path: `/mall/product/item/${item.id}`,
      })
      window.open(routeData.href, '_blank')
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this ?')) {
        this.$store.dispatch('deleteProduct', id).then(() => {
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
    //lightbox
    handleShowLightBox(item) {
      this.images = [
        {
          src: item.screenshot_url,
          title: '',
        },
      ]
      this.showLightbox = true
    },
  },
}
</script>
