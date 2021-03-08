<template>
  <div class="page-propperty-value-list">
    <v-container>
      <v-row>
        <v-col>
          <advance-table
            :items="items"
            :headers="headers"
            :loading="loading"
            :server-items-length="serverItemsLength"
            :items-per-page="itemsPerPage"
            @update:page="handlePageChanged"
            :searchValue="filter['filter[name]']"
            @input:change="handleInputChange"
            @search="handleApplyFilter"
          >
            <div slot="filter">
              <v-card flat class="grey lighten-4">
                <v-card-text>
                  <v-row>
                    <v-col cols="6">
                      <v-btn-toggle v-model="filter['filter[type]']">
                        <v-btn value="sku">
                          SKU
                        </v-btn>
                        <v-btn value="spu">
                          SPU
                        </v-btn>
                      </v-btn-toggle>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn @click="handleResetFilter" text>Reset</v-btn>
                  <v-btn @click="handleApplyFilter" color="primary"
                    >Apply</v-btn
                  >
                </v-card-actions>
              </v-card>
            </div>
            <v-btn slot="toolbar" icon @click="handleRefreshItem">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn slot="toolbar" icon @click="handleCreateItem">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
            <template v-slot:item.name="{ item }">
              <div>
                <span>{{ item.name }}</span>
                <v-icon
                  class="mx-2"
                  @click="handleShowTranslation('name', item)"
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
                      hasTranslation(locale.value, item.translations.name)
                    "
                  />
                </v-avatar>
              </div>
            </template>
            <template v-slot:item.values="{ item }">
              <v-chip
                class="mr-1"
                x-small
                v-for="val in item.values"
                :key="val.slug"
                label
              >
                {{ val.value }}
              </v-chip>
            </template>
            <template v-slot:item.action="{ item }">
              <v-menu>
                <template v-slot:activator="{ on: menu }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on: tooltip }">
                      <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>Action</span>
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
          </advance-table>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="showTranslation">
      <form-translation
        :field="translationField"
        :text="translationText"
        :entity="entity"
        @form:cancel="showTranslation = false"
        @form:success="handleTranslated"
      />
    </v-dialog>
    <v-dialog v-model="showPropertyDialog">
      <form-property
        :item="selectedItem"
        @form:success="showPropertyDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script>
import AdvanceTable from '@/components/table/AdvanceTable'
import { mapActions, mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import FormTranslation from '@/components/form/FormTranslation'
import FormProperty from '@/components/form/product/FormProperty'

export default {
  name: 'PageProperty',
  components: {
    FormTranslation,
    FormProperty,
    AdvanceTable
  },
  mixins: [ResizeMixin, TooltipMixin],
  data() {
    return {
      //
      showLightbox: false,
      index: 0,
      loading: false,
      showTranslation: false,
      translationText: '',
      translationField: 'name',
      selectedItem: null,
      showPropertyDialog: false,
      items: [],
      filter: {
        'filter[name]': null,
        'filter[type]': null
      },
      translatable: ['name'],
      categories: [],
      headers: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'Name',
          value: 'name',
          width: 200
        },
        {
          text: 'Value',
          value: 'values'
        },
        {
          text: 'Type',
          value: 'type'
        },
        {
          text: 'Unit',
          value: 'unit'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      serverItemsLength: 0,
      itemsPerPage: 15,
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
          text: 'Edit Value',
          icon: 'mdi-pencil',
          click: this.handleEditValue
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
    ...mapGetters(['getLocales']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Property',
        id: this.selectedItem ? this.selectedItem.id : 0
      }
    }
  },
  watch: {
    '$route.query': {
      handler(query) {
        Object.assign(this.filter, query)
        this.fetchRecord(query)
      },
      immediate: true
    }
  },
  methods: {
    fetchRecord(query) {
      this.loading = true
      this.items = []
      this.$store
        .dispatch('fetchProperty', query)
        .then(({ data, meta }) => {
          this.loading = false
          this.items = data
          this.serverItemsLength = meta.total
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleCreateItem() {
      this.$router.push({
        path: `/mall/property/create`
      })
    },
    handleViewItem(item) {
      window.open(item.href, '_blank')
    },
    handleEditItem(item) {
      this.$router.push({
        path: `/mall/property/item/${item.id}`
      })
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteProperty', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
    handleEditValue(item) {
      this.selectedItem = item
      this.showPropertyDialog = true
    },
    handleRefreshItem() {
      this.fetchRecord(this.filter)
    },
    handlePageChanged(page) {
      this.filter.page = page
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    handleCategoryChange(val) {
      this.filter['filter[categories.id]'] = val
        .filter((item) => item !== 0)
        .join(',')
      this.categories = val
    },
    // filter
    handleApplyFilter() {
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },

    handleResetFilter() {
      this.filter = {
        page: 1,
        'filter[name]': null,
        'filter[type]': null
      }
      this.handleApplyFilter()
    },
    handleInputChange(val) {
      this.filter['filter[name]'] = val
    },
    handleShowTranslation(field, item) {
      this.translationField = field
      this.translationText = item[field]
      this.selectedItem = item
      this.showTranslation = true
    },
    hasTranslation(locale, translations) {
      const grey = translations[locale] ? false : true
      return {
        'grey-bg': grey
      }
    },
    handleTranslated() {
      this.showTranslation = false
      this.fetchRecord(this.filter)
    }
  }
}
</script>

<style lang="sass">
.grey-bg
  filter: grayscale(.9)
</style>
