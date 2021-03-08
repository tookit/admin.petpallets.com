<template>
  <div class="table-media">
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
          v-model="filter['filter[property.fingerprint]']"
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
            <v-col cols="4">
              <v-autocomplete
                outlined
                clearable
                name="directory"
                placeholder="Directory"
                :items="getMediaDir"
                item-text="directory"
                item-value="directory"
                v-model="filter['filter[directory]']"
              />
            </v-col>
            <v-col cols="4">
              <v-autocomplete
                outlined
                clearable
                name="disk"
                placeholder="Disk"
                :items="['local', 'oss']"
                v-model="filter['filter[disk]']"
              />
            </v-col>
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
        <v-data-table
          v-model="selectedItems"
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
          :show-select="showSelect"
          :single-select="singleSelect"
          @item-selected="handleItemSelected"
        >
          <template v-slot:[`item.cloud_url`]="{ item }">
            <div
              @click.stop="handleViewImage"
              :href="item.cloud_url"
              class="glightbox"
              target="blank"
            >
              <img class="ma-2" :src="item.tiny_image" height="50" width="50" />
            </div>
          </template>
          <template v-slot:[`item.size`]="{ item }">
            <span>{{ item.size | bytes }}</span>
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
                  <span>{{ __('$vuetify.action') }}</span>
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
    <v-dialog v-model="showEditDialog" width="800px" scrollable>
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>
            Edit Image
          </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showEditDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0" v-if="selectedItem">
          <form-media
            @form:cancel="handleFormCancel"
            @form:success="handleUploadSuccess"
            :item="selectedItem"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showUploadDialog" width="800px" scrollable>
      <v-card>
        <v-toolbar dark tile color="primary">
          <v-toolbar-title>
            Upload
          </v-toolbar-title>
          <v-spacer />
          <v-icon @click="showUploadDialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-card-text class="pa-0">
          <form-upload
            :action="uploadAction"
            :entity-id="entityId"
            :entity="entity"
            @form:cancel="handleFormCancel"
            @form:success="handleUploadSuccess"
            :item="selectedItem"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="imgs"
      :index="index"
      @hide="showLightbox = false"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import bytes from 'bytes'
import FormUpload from '../form/media/FormUpload.vue'
import FormMedia from '../form/media/FormMedia.vue'
export default {
  components: { FormUpload, FormMedia },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    directory: String,
    entityId: {
      type: [Number, String],
      default: null
    },
    entity: {
      type: String,
      default: null
    },
    showSelect: Boolean,
    singleSelect: Boolean,
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showLightbox: false,
      index: 0,
      //
      submiting: false,
      showUploadDialog: false,
      showEditDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[directory]': this.directory,
        'filter[disk]': null,
        'filter[fingerprint]': null
      },
      // table
      selectedItem: null,
      selectedItems: [],
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: 'ID',
          value: 'id'
        },
        {
          text: 'Image',
          value: 'cloud_url'
        },
        // {
        //   text: 'Filename',
        //   value: 'filename'
        // },
        {
          text: 'Fingerprint',
          value: 'fingerprint'
        },
        {
          text: 'Size',
          value: 'size'
        },
        {
          text: 'Directory',
          value: 'directory'
        },
        {
          text: 'Disk',
          value: 'disk'
        },
        {
          text: 'Featured',
          value: 'custom_properties.featured'
        },
        {
          text: 'Created',
          value: 'created_at'
        },
        {
          text: 'Action',
          value: 'action'
        }
      ],
      items: [],
      actions: [
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
  filters: {
    bytes: (val) => {
      return bytes(val)
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getMediaDir']),
    uploadAction() {
      return `${process.env.VUE_APP_BASE_API_HOST}/api/media?dir=${this.directory}`
    },
    imgs() {
      return this.items.map((item) => {
        return {
          src: item.cloud_url,
          title: item.fingerprint
        }
      })
    }
  },
  watch: {
    '$route.query': {
      handler(data) {
        if (this.$route.name === 'media.index') {
          if (Object.keys(data).length === 0 && data.constructor === Object) {
            this.resetFilter()
            this.fetchRecords()
          } else {
            const query = this.updateFilterQuery(data)
            this.fetchRecords(query)
          }
        } else {
          this.fetchRecords(this.filter)
        }
      },
      immediate: true
    },
    selectedItems: {
      handler(val) {
        this.$emit('input', val)
      },
      immediate: true
    }
  },
  created() {},
  methods: {
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
        'filter[directory]': null,
        'filter[disk]': null,
        'filter[fingerprint]': null
      }
    },
    fetchRecords(query) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchMedia', query)
        .then(({ data, meta }) => {
          this.items = data
          this.serverItemsLength = meta ? meta.total : data.length
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showUploadDialog = true
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showEditDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deleteMedia', id).then(() => {
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
      this.fetchRecords(this.filter)
    },
    handleApplyFilter() {
      if (this.$route.name === 'media.index') {
        this.filter.t = Date.now()
        this.$router.replace({
          path: this.$route.path,
          query: this.filter
        })
      } else {
        this.fetchRecords(this.filter)
      }
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter
      })
    },
    //option
    handleViewImage(e) {
      e.preventDefault()
      this.showLightbox = true
    },
    // upload
    handleFormCancel() {
      this.showDialog = false
      this.fetchRecords(this.filter)
    },
    handleUploadSuccess({ data }) {
      // attach entity
      this.selectedItem = data
      this.fetchRecords(this.filter)
    },
    handleItemSelected(e) {
      // this.$emit('input', this.selectedItems)
    }
  }
}
</script>
