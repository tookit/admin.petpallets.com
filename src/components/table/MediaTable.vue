<template>
  <v-card>
    <v-toolbar flat>
      <v-text-field
        v-model="filter['filter[property.fingerprint]']"
        text
        solo
        flat
        :prepend-icon="
          showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'
        "
        append-icon="mdi-magnify"
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
          <v-col cols="3">
            <v-combobox
              v-model="filter['filter[directory]']"
              outlined
              clearable
              name="directory"
              placeholder="Directory"
              :return-object="false"
              :items="getMediaDir"
            />
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              v-model="filter['filter[disk]']"
              outlined
              clearable
              name="disk"
              placeholder="Disk"
              :items="['local', 'oss']"
            />
          </v-col>
          <v-col cols="3">
            <v-autocomplete
              v-model="filter['filter[entity]']"
              outlined
              clearable
              name="entity"
              placeholder="Entity"
              :items="getEntityList"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model="filter['filter[entityId]']"
              outlined
              clearable
              name="Entity ID"
              placeholder="Entity ID"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="handleResetFilter">Reset</v-btn>
        <v-btn tile color="primary" @click="handleApplyFilter">Apply</v-btn>
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
        :show-select="showSelect"
        single-select
        @update:page="handlePageChanged"
        @update:items-per-page="handlePageSizeChanged"
        @item-selected="handleItemSelected"
      >
        <template #[`item.cloud_url`]="{ item }">
          <image-viewer :items="[item]" />
        </template>
        <template #[`item.fingerprint`]="{ item }">
          <a href="#" @click="handleEditItem(item)">{{
            item.fingerprint ? item.fingerprint : 'None'
          }}</a>
        </template>
        <template #[`item.size`]="{ item }">
          <span>{{ item.size | bytes }}</span>
        </template>
        <template #[`item.entity`]="{ item }">
          <span v-if="item.product.length > 0">
            {{ item.product[0].id }}
          </span>
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
      </v-data-table>
    </v-card-text>
    <v-dialog v-model="showUploadDialog" width="640">
      <form-upload
        :action="uploadAction"
        :entity-id="entityId"
        :entity="entity"
      />
    </v-dialog>
    <v-dialog v-model="showEditDialog" width="640">
      <form-media :item="selectedItem" />
    </v-dialog>
    <v-dialog v-model="showAttachDialog" width="640">
      <form-entity :item="selectedItem" />
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import ImageViewer from '@/components/image/ImageViewer'
import FormUpload from '@/components/form/media/FormUpload.vue'
import FormMedia from '@/components/form/media/FormMedia.vue'
import FormEntity from '@/components/form/media/FormEntity.vue'
import bytes from 'bytes'
export default {
  components: {
    ImageViewer,
    FormUpload,
    FormMedia,
    FormEntity,
  },
  filters: {
    bytes: (val) => {
      return bytes(val)
    },
  },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    directory: String,
    dataSource: Function,
    entityId: {
      type: [Number, String],
      default: null,
    },
    entity: {
      type: String,
      default: null,
    },
    showSelect: Boolean,
    singleSelect: Boolean,
    value: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showAttachDialog: false,
      showUploadDialog: false,
      showEditDialog: false,
      //filter
      search: '',
      showFilter: true,
      filter: {
        page: 1,
        pageSize: 30,
        'filter[directory]': null,
        'filter[entity]': null,
        'filter[entityId]': null,
        'filter[disk]': null,
        'filter[fingerprint]': null,
      },
      // table
      selectedItem: null,
      selectedItems: [],
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Image',
          value: 'cloud_url',
        },
        {
          text: 'Fingerprint',
          value: 'fingerprint',
        },
        {
          text: 'Entity',
          value: 'entity',
        },
        {
          text: 'Size',
          value: 'size',
        },
        {
          text: 'Directory',
          value: 'directory',
        },
        {
          text: 'Featured',
          value: 'custom_properties.featured',
        },
        {
          text: 'Action',
          value: 'action',
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
        {
          text: 'Attach Entity',
          icon: 'mdi-pencil',
          click: this.handleAttachEntity,
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getMediaDir', 'getEntityList']),
    uploadAction() {
      const directory = this.directory
        ? this.directory
        : this.filter['filter[directory]']
      return `${process.env.VUE_APP_BASE_API_HOST}/api/media?dir=${directory}`
    },
    imgs() {
      return this.items.map((item) => {
        return {
          src: item.cloud_url,
          title: item.fingerprint,
        }
      })
    },
  },
  watch: {
    selectedItems: {
      handler(val) {
        this.$emit('input', val)
      },
      immediate: true,
    },
    entityId: {
      handler(val) {
        this.filter['filter[entityId]'] = val
      },
      immediate: true,
    },
    directory: {
      handler() {
        this.fetchRecords()
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    resetFilter() {
      this.filter = {
        page: 1,
        pageSize: 30,
        'filter[directory]': null,
        'filter[entity]': null,
        'filter[entityId]': null,
        'filter[disk]': null,
        'filter[fingerprint]': null,
      }
    },
    fetchRecords() {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchMedia', this.filter)
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
      this.selectedItems = [item]
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
      this.fetchRecords()
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
      this.fetchRecords()
    },
    handleApplyFilter() {
      if (this.$route.name === 'media.index') {
        this.filter.t = Date.now()
        this.$router.replace({
          path: this.$route.path,
          query: this.filter,
        })
      } else {
        this.fetchRecords()
      }
    },
    handleClear() {
      this.resetFilter()
      this.filter.t = Date.now()
      this.$router.replace({
        path: this.$route.path,
        query: this.filter,
      })
    },
    // upload
    handleFormCancel() {
      this.showDialog = false
      this.fetchRecords()
    },
    handleUploadSuccess({ data }) {
      // attach entity
      this.selectedItem = data
      this.fetchRecords()
    },
    handleItemSelected() {
      // this.$emit('input', this.selectedItems)
    },
    handleAttachEntity(item) {
      this.selectedItem = item
      this.showAttachDialog = true
    },
  },
}
</script>
