<template>
  <div class="mall-item">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-tabs
            v-model="defaultTab"
            class="route-tab border-bottom"
            @change="onTabChange"
          >
            <v-tab
              v-for="(tab, key) in tabs"
              v-show="showTab(tab)"
              :key="key"
              :href="'#' + tab.value"
            >
              {{ tab.text }}
            </v-tab>
            <a
              v-if="item"
              class="v-tab flex-right"
              :href="item.href"
              target="_blank"
            >
              view
            </a>
          </v-tabs>
          <v-tabs-items v-model="defaultTab">
            <v-tab-item key="general" value="general">
              <form-product :item="item" :loading="loading" />
            </v-tab-item>
            <v-tab-item key="media" value="media">
              <media-table
                :directory="directory"
                :entity-id="id"
                entity="App\Models\Mall\Product"
                show-select
                @selected="handleSelectMedia"
              />
            </v-tab-item>
            <v-tab-item key="property" value="property">
              <property-product-table :product-id="id" />
            </v-tab-item>
            <v-tab-item key="seo" value="seo">
              <form-seo
                :item="item"
                :loading="loading"
                action="updateProduct"
              />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormProduct from '@/components/form/product/FormProduct'
import PropertyProductTable from '@/components/table/PropertyProductTable'
import FormSeo from '@/components/form/FormSeo'
import MediaTable from '@/components/table/MediaTable'
export default {
  components: {
    FormSeo,
    MediaTable,
    FormProduct,
    PropertyProductTable,
  },
  props: {
    id: [Number, String],
  },
  data() {
    return {
      defaultTab: this.$route.query ? this.$route.query.tab : 'general',
      tabs: [
        {
          text: this.__('general'),
          value: 'general',
        },
        {
          text: this.__('property'),
          value: 'property',
        },
        {
          text: this.__('media'),
          value: 'media',
        },
        {
          text: this.__('seo'),
          value: 'seo',
        },
      ],
      loading: false,
      item: null,
      images: [],
    }
  },
  computed: {
    uploadAction() {
      return `${process.env.VUE_APP_BASE_API_HOST}/api/mall/item/${this.id}/image`
    },
    directory() {
      return `fiber/${this.id}`
    },
  },
  watch: {
    id: {
      handler(id) {
        if (id) {
          this.fetchRecord(id)
        }
      },
      immediate: true,
    },
  },
  methods: {
    onTabChange(tab) {
      this.$router.push({
        path: this.$route.path,
        query: {
          tab: tab,
          t: Date.now(),
        },
      })
    },
    fetchRecord(id) {
      this.loading = true
      this.$store.dispatch('getProductById', id).then(({ data }) => {
        this.item = data
        this.loading = false
        this.$store.commit('APPEND_BREADCRUMB', {
          text: this.item.name,
          exact: true,
          disabled: false,
        })
      })
    },
    fetchImages() {
      return this.$store.dispatch('fetchImageByProductId', this.id)
    },
    showTab({ value }) {
      if (this.id) {
        return true
      } else {
        return value === 'general'
      }
    },
    handleSelectMedia() {},
  },
}
</script>

<style></style>
