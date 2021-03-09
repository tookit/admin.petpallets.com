<template>
  <div>
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
          hide-details
          clearable
          @click:prepend="showFilter = !showFilter"
        />
        <v-btn icon @click="fetchRecords(category)">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-divider />
      <v-card v-show="showFilter" flat class="grey lighten-4">
        <v-card-text>
          <v-row v-if="category">
            <v-col v-for="prop in skuSet" :key="prop.id" cols="4">
              <v-autocomplete
                :label="prop.name"
                :items="prop.options"
                item-text="value"
                multiple
                deletable-chips
                chips
                outlined
                hide-details
                return-object
                @change="handleSkuChange"
              >
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
      <v-card-text class="pa-0">
        <v-data-table
          v-model="selectedItems"
          :loading="loadingItems"
          :headers="headers"
          :items="items"
          disable-pagination
          item-key="id"
          show-select
          single-select
          fixed-header
        >
          <template #[`item.vendor.name`]="{ item }">
            <a :href="item.reference_url" target="_blank">
              {{ item.vendor ? item.vendor.name : '' }}</a
            >
          </template>
          <template #[`item.media`]="{ item }">
            <v-img
              v-if="item.media && item.media.length > 0"
              class="ma-3"
              :src="item.media[0].tiny_image"
              width="50"
              height="50"
              @click="handleShowLightBox(item)"
            />
          </template>
          <template #[`item.flag`]="{ item }">
            <v-select
              v-model="item.flag"
              dense
              :items="getProductFlags"
              @change="handleFlagChange(item)"
            />
          </template>
          <template #[`item.name`]="{ item }">
            <a :href="item.href" target="_blank"> {{ item.name }} </a>
            <br />
            <v-icon small @click="handleEditProp(item)">mdi-hammer</v-icon>
          </template>
          <template #[`item.is_active`]="{ item }">
            <v-switch
              v-model="item.is_active"
              @change="handleItemStatus('is_active', item.is_active, item.id)"
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
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="imgs"
      @hide="showLightbox = false"
    />
    <v-dialog
      v-if="selectedItem"
      v-model="showFormProperty"
      width="800"
      scrollable
    >
      <v-card max-height="600">
        <v-toolbar dark color="primary" tile>
          <v-toolbar-title v-text="formTitle" />
          <v-spacer />
          <v-icon @click="showFormProperty = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-product-property :product="selectedItem" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import { mapGetters } from 'vuex'
import FormProductProperty from '../form/product/FormProductProperty.vue'
export default {
  name: 'CategoryProductTable',
  components: {
    FormProductProperty,
  },
  mixins: [TooltipMixin],
  props: {
    category: Object,
  },
  data() {
    return {
      showSpec: true,
      showFormProperty: false,
      // lightbox
      images: [],
      showLightbox: false,
      //filter
      search: '',
      showFilter: true,
      // table
      loadingItems: false,
      selectedItems: [],
      selectedItem: null,
      serverItemsLength: 0,
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: this.__('image'),
          value: 'media',
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
          text: this.__('flag'),
          value: 'flag',
          width: 150,
        },
        {
          text: this.__('active'),
          value: 'is_active',
          width: 100,
        },
        {
          text: this.__('action'),
          value: 'action',
          width: 50,
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
    entity() {
      return {
        model: 'App\\Models\\Mall\\Product',
        id: this.selectedItem ? this.selectedItem.id : 0,
      }
    },
    formTitle() {
      return this.selectedItem ? this.selectedItem.name : ''
    },
    skuSet() {
      return this.category.properties ? this.category.properties.filter(item => item.options.length > 1) : []
    }
  },
  watch: {
    category: {
      handler(val) {
        if (val) this.fetchRecords(val)
      },
      immediate: true,
    },
  },
  methods: {
    fetchRecords(item) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('getProductByCategoryId', { id: item.id })
        .then(({ data }) => {
          this.items = data
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
        .dispatch('updateProduct', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    //action
    handleEditProp(item) {
      this.selectedItem = item
      this.selectedItems = [item]
      this.showFormProperty = true
    },
    handleViewSpec() {
      this.showSpec = true
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/mall/product/item/${item.id}`,
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this ?')) {
        this.$store.dispatch('deleteProduct', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
    // filter
    handleSkuChange() {},
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
