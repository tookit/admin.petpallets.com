<template>
  <div class="mall-category-list">
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
              <v-card-text> </v-card-text>
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
                nested
                disable-pagination
              >
                <template #[`item.products_count`]="{ item }">
                  <v-chip label :to="handleViewProduct(item)">
                    {{ item.products_count }}
                  </v-chip>
                </template>
                <!-- <template v-slot:[`item.name`]="{ item }">
                  <a :href="item.href" target="_blank"> {{ item.name }} </a>
                </template> -->
                <template #[`item.is_active`]="{ item }">
                  <v-switch
                    v-model="item.is_active"
                    @change="
                      handleItemStatus('is_active', item.is_active, item.id)
                    "
                  />
                </template>
                <template #[`item.screenshot`]="{ item }">
                  <v-img
                    v-if="item.screenshot"
                    class="ma-3"
                    :src="item.screenshot_url"
                    width="50"
                    height="50"
                    @click="handleShowLightBox(item)"
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
    <v-dialog v-model="showDialog" width="640px" scrollable>
      <v-card>
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Media Items To Target Category </v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="showDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text style="height: 350px; padding-top: 25px">
          <v-cascader
            v-model="moveTarget"
            :items="getProductCategories"
            name="Category"
            label="Category"
            placeholder="Category"
            item-text="name"
            item-value="id"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn :loading="confirming" color="primary" @click="handleConfirm">{{
            __('confirm')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showTranslation">
      <form-translation
        :field="translationField"
        :text="translationText"
        :entity="entity"
        @form:cancel="showTranslation = false"
        @form:success="showTranslation = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import TooltipMixin from '@/mixins/Tooltip'
import VGrid from '@/components/grid'
import { mapGetters } from 'vuex'
import FormTranslation from '@/components/form/FormTranslation'
import VCascader from '@/components/cascader/'
import Sortable, { Swap } from 'sortablejs'
Sortable.mount(new Swap())

export default {
  components: { VGrid, VCascader, FormTranslation },
  mixins: [TooltipMixin],
  data() {
    return {
      confirming: false,
      moveTarget: null,
      //translation
      showTranslation: false,
      translationText: '',
      translationField: 'name',
      //
      showDialog: false,
      selectedItem: null,
      search: '',
      loadingItems: false,
      serverItemsLength: 0,
      showFilter: true,
      filter: {
        'filter[name]': null,
      },
      headers: [
        {
          text: this.__('name'),
          value: 'name',
        },
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: 'Sort',
          value: 'order_column',
        },
        {
          text: this.__('status'),
          value: 'is_active',
        },
        {
          text: this.__('products'),
          value: 'products_count',
        },
        {
          text: this.__('action'),
          value: 'action',
          width: 42,
        },
      ],
      items: [],
      actions: [
        {
          text: this.__('add_child'),
          icon: 'mdi-plus',
          click: this.handleAddChild,
        },
        {
          text: this.__('view_item'),
          icon: 'mdi-eye',
          click: this.handleViewItem,
        },
        {
          text: this.__('edit_item'),
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: this.__('move_item'),
          icon: 'mdi-pencil',
          click: this.handleMoveItem,
        },
        {
          text: this.__('delete_item'),
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
        {
          text: this.__('translate_item'),
          icon: 'mdi-translate',
          click: this.handleShowTranslation,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getProductCategories', 'getProductFlags', 'getLocale']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Category',
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
  created() {
    this.$nextTick(() => {
      const sortable = new Sortable(
        document.querySelector('.v-data-table__wrapper > table > tbody'),
        {
          draggable: 'tr',
          swap: true, // Enable swap plugin
          swapClass: 'highlight', // The class applied to the hovered swap item
          animation: 150,
          onSort: (e) => {
            const { item, swapItem } = e
            const source = item.dataset.id
            const target = swapItem.dataset.id
            this.$store
              .dispatch('mallCategorySwapOrder', {
                source,
                target,
              })
              .then(() => {
                // this.fetchRecords(this.filter)
              })
          },
        }
      )
    })
  },
  methods: {
    //
    updateFilterQuery(query) {
      const filter = Object.assign(this.filter, query)
      return filter
    },
    resetFilter() {
      this.filter = {
        'filter[name]': null,
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchProductCategoryTree', query)
        .then((data) => {
          this.items = data
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },

    //action
    handleCreateItem() {
      this.$router.push({
        path: `/mall/category/create`,
      })
    },
    handleAddChild(item) {
      this.$router.push({
        path: `/mall/category/create`,
        query: {
          parent_id: item.id,
        },
      })
    },
    handleItemStatus(key, val, id) {
      let data = {}
      data[key] = val
      this.$store
        .dispatch('updateProductCategory', {
          id: id,
          data: data,
        })
        .then(() => {})
    },
    handleViewProduct(item) {
      return {
        path: `/mall/product/list?filter[categories.id]=${item.id}`,
      }
    },
    handleViewItem({ href }) {
      window.open(href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/mall/category/item/${item.id}`,
      })
    },
    handleMoveItem(item) {
      this.selectedCategory = item
      this.showDialog = true
    },
    handleDeleteItem(item) {
      if (window.confirm('Are you sure to delete this item')) {
        this.$store
          .dispatch('deleteProductCategory', item.id)
          .then(() => {
            this.fetchRecords(this.filter)
          })
          .catch(() => {
            this.fetchRecords(this.filter)
          })
      }
    },
    handleRefreshItem() {
      this.fetchRecords(this.filter)
    },
    // filter
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
    handleConfirm() {
      this.confirming = true
      this.$store
        .dispatch('moveItemsToCategory', {
          id: this.selectedCategory.id,
          data: {
            categoryId: this.moveTarget,
          },
        })
        .then(() => {
          this.confirming = false
        })
    },
    handleShowTranslation(item) {
      const field = 'name'
      this.translationField = field
      this.translationText = item[field]
      this.selectedItem = item
      this.showTranslation = true
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
