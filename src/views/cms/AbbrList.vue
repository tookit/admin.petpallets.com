<template>
  <div class="cms-abbr-list">
    <v-container>
      <v-row>
        <v-col cols="12">
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
                v-model="filter['filter[name]']"
                hide-details
                clearable
                @keyup.enter="handleApplyFilter"
                @click:append="handleApplyFilter"
                @click:prepend="showFilter = !showFilter"
                @click:clear="handleClear"
              />
              <v-btn @click="handleRefreshItem" icon>
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn @click="handleCreateItem" icon>
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-divider />
            <v-card v-show="showFilter" flat class="grey lighten-4">
              <v-card-text>
                <v-row>
                  <v-col cols="6"> </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleResetFilter" text>{{ __('reset') }}</v-btn>
                <v-btn tile @click="handleApplyFilter" color="primary">{{
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
                @update:page="handlePageChanged"
                @update:items-per-page="handlePageSizeChanged"
                item-key="id"
                show-select
              >
                <template v-slot:[`item.media`]="{ item }">
                  <v-img
                    v-if="item.media && item.media.length > 0"
                    class="ma-3"
                    :src="item.media[0].tiny_image"
                    width="50"
                    height="50"
                    @click="handleShowLightBox(item)"
                  />
                </template>
                <template v-slot:[`item.short_for`]="{ item }">
                  <div>
                    <span>{{ item.short_for }}</span>
                    <v-icon
                      class="mx-2"
                      @click="handleShowTranslation('short_for', item)"
                      size="18"
                      >mdi-translate</v-icon
                    >
                  </div>
                  <div>
                    <v-avatar
                      class="mr-1"
                      tile
                      size="16"
                      v-for="locale in getLocales"
                      :key="locale.value"
                    >
                      <img
                        :src="locale.svg"
                        :class="
                          hasTranslation(
                            locale.value,
                            item.translations.short_for
                          )
                        "
                      />
                    </v-avatar>
                  </div>
                </template>
                <template v-slot:[`item.action`]="{ item }">
                  <v-menu>
                    <template v-slot:activator="{ on: menu }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on: tooltip }">
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
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="images"
      @hide="showLightbox = false"
    />
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
    FormTranslation
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      showLightbox: false,
      images: [],
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
        'filter[name]': null
      },
      // table
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id'
        },
        {
          text: 'Media',
          value: 'media'
        },
        {
          text: 'Name',
          value: 'name'
        },
        {
          text: 'Short For',
          value: 'short_for'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      items: [],
      actions: [
        {
          text: 'View Item',
          icon: 'mdi-eye',
          click: this.handleViewItem
        },
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getTagTypes']),
    entity() {
      return {
        model: 'App\\Models\\Abbreviationable\\Abbreviation',
        id: this.selectedItem ? this.selectedItem.id : 0
      }
    }
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
      immediate: true
    }
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
        'filter[name]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchAbbr', query)
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
        .dispatch('updateAbbr', {
          id: id,
          data: data
        })
        .then(() => {})
    },
    //action
    handleCreateItem() {
      this.$router.push({
        path: `/cms/abbrs/create`
      })
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/cms/abbrs/item/${item.id}`
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteAbbr', id).then(() => {
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
        query: this.filter
      })
    },
    handlePageSizeChanged(size) {
      this.filter.pageSize = size
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    handleResetFilter() {
      this.resetFilter()
      this.$router.replace({
        path: this.$route.path
      })
    },
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    //
    hasTranslation(locale, translations) {
      const grey = translations[locale] ? false : true
      return {
        'grey-bg': grey
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
    //lightbox
    handleShowLightBox(item) {
      console.log(item)
      this.images = [
        {
          src: item.image,
          title: item.name
        }
      ]
      this.showLightbox = true
    }
  }
}
</script>
