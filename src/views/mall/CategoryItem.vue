<template>
  <div class="page-mall-category view">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-tabs
            v-model="defaultTab"
            class="border-bottom"
            @change="onTabChange"
          >
            <v-tab
              v-for="tab in tabs"
              v-show="showTab(tab)"
              :key="tab.value"
              :href="'#' + tab.value"
            >
              {{ tab.text }}
            </v-tab>
            <v-spacer />
            <a v-if="item" class="v-tab" :href="item.href" target="_blank">
              Products
            </a>
          </v-tabs>
          <v-tabs-items v-model="defaultTab">
            <v-tab-item key="general" value="general">
              <form-product-category :item="item" />
            </v-tab-item>
            <v-tab-item key="property" value="property">
              <property-category-table :category-id="id" />
            </v-tab-item>
            <v-tab-item key="media" value="media">
              <media-table
                v-model="selectedItems"
                :directory="directory"
                single-select
                show-select
              />
            </v-tab-item>
            <v-tab-item key="seo" value="seo">
              <form-seo
                :item="item"
                :loading="loading"
                action="updateProductCategory"
              />
            </v-tab-item>
            <v-tab-item key="sku" value="sku">
              <category-product-table :category="item" />
            </v-tab-item>
            <v-tab-item key="spec" value="spec">
              <form-category-spec :category="item" />
            </v-tab-item>
            <v-tab-item key="landing" value="landing">
              <form-category-landing :category="item" />
            </v-tab-item> 
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormProductCategory from '@/components/form/product/FormProductCategory'
import FormSeo from '@/components/form/FormSeo'
import FormCategorySpec from '@/components/form/product/FormCategorySpec'
import FormCategoryLanding from '@/components/form/product/FormCategoryLanding'
import CategoryProductTable from '@/components/table/CategoryProductTable'
import PropertyCategoryTable from '@/components/table/PropertyCategoryTable'
import MediaTable from '@/components/table/MediaTable'
export default {
  components: {
    FormSeo,
    FormCategorySpec,
    FormCategoryLanding,
    CategoryProductTable,
    MediaTable,
    PropertyCategoryTable,
    FormProductCategory,
  },
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      productLink: null,
      showDialog: false,
      selectedItems: [],
      defaultTab: this.$route.query.tab || 'general',
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
          text: 'SKU',
          value: 'sku',
        },
        {
          text: this.__('media'),
          value: 'media',
        },
        {
          text: 'Spec',
          value: 'spec',
        },
        {
          text: 'Landing',
          value: 'landing',
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
      return `${process.env.VUE_APP_BASE_API_HOST}/api/mall/category/${this.id}/image`
    },
    directory() {
      return `category/${this.id}`
    },
    formTitle() {
      return this.item ? `Edit Category - ${this.item.name}` : 'Create Category'
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
    fetchRecord(id) {
      this.loading = true
      this.$store.dispatch('getProductCategoryById', id).then(({ data }) => {
        this.item = data
        this.loading = false
        this.$store.commit('APPEND_BREADCRUMB', {
          text: this.item.name,
          href: this.item.href,
          exact: true,
          disabled: false,
        })
      })
    },
    onTabChange(tab) {
      this.$router.push({
        path: this.$route.path,
        query: {
          tab: tab,
          t: Date.now(),
        },
      })
      this.$store.commit('APPEND_BREADCRUMB', {
        text: this.item.name,
        exact: true,
        disabled: false,
      })
    },
    showTab({ value }) {
      if (this.id) {
        return true
      } else {
        return value === 'general'
      }
    },
    handleSelectMedia() {},
    handleAddProp() {},
  },
}
</script>

<style></style>
