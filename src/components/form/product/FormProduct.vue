<template>
  <v-card :loading="loading">
    <v-toolbar v-show="inDialog" dark tile color="primary">
      <v-toolbar-title> {{ title }}</v-toolbar-title>
      <v-spacer />
      <v-icon @click="$emit('close:dialog')">mdi-close</v-icon>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                label="Name"
                name="Name"
                placeholder="name"
                append-icon="mdi-translate"
                @click:append="handleShowTranslation('name')"
              >
              </v-text-field>
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                readonly
                label="Slug"
                outlined
                placeholder="slug"
                append-icon="mdi-eye"
                @click:append="handleViewItem"
              />
            </v-col>
            <v-col :cols="4">
              <v-select
                v-model="formModel.flag"
                :items="getProductFlags"
                label="Flag"
                outlined
                placeholder="Flag"
              />
            </v-col>
            <v-col :cols="4">
              <v-switch
                v-model="formModel.is_active"
                label="Active"
                placeholder="Active"
              />
            </v-col>
            <v-col :cols="12">
              <v-text-field
                v-model="formModel.reference_url"
                readonly
                outlined
                label="Reference"
                append-icon="mdi-eye"
                placeholder="Reference"
                @click:append="handleViewReference"
              />
            </v-col>
            <v-col :cols="12">
              <v-cascader
                v-model="formModel.categories"
                :items="getProductCategories"
                multiple
                outlined
                item-text="name"
                item-value="id"
                name="Category"
                label="Category"
                placeholder="Category"
                @change="handleCategoriesChange"
              />
            </v-col>
            <v-col :cols="12">
              <v-combobox
                v-model="formModel.tags"
                outlined
                multiple
                small-chips
                label="Applications"
                :items="getTagsByType('fiber')"
                :loading="isLoading"
                :search-input.sync="searchName"
                placeholder="Applications"
                item-text="name"
                item-value="name"
                :return-object="false"
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>{{ searchName }}</strong
                        >". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>
            <v-col :cols="12">
              <v-textarea
                v-model="formModel.description"
                label="Description"
                placeholder="Description"
                counter
                outlined
              />
            </v-col>
            <v-col :cols="12">
              <label for="">Specs</label>
              <v-editor v-model="formModel.specs" />
            </v-col>
            <v-col :cols="12">
              <label for="">Content</label>
              <v-editor v-model="formModel.body" />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit()">
        save
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="showTranslation">
      <form-translation
        :field="translationField"
        :text="translationText"
        :entity="entity"
        @form:cancel="showTranslation = false"
        @form:success="showTranslation = false"
      />
    </v-dialog>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import VEditor from '@/components/editor/VEditor'
import VCascader from '@/components/cascader/'
import HtmlFilter from '@/mixins/HtmlFilter'
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormProduct',
  components: {
    VEditor,
    FormTranslation,
    VCascader,
  },
  mixins: [HtmlFilter],
  props: {
    item: Object,
    inDialog: Boolean,
  },
  data() {
    return {
      loading: false,
      search: null,
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      isLoading: false,
      tags: [],
      searchName: '',
      formModel: {
        name: null,
        is_active: null,
        description: null,
        content: null,
        slug: null,
        flag: 1,
        reference_url: null,
        specs: '',
        body: '',
        categories: [],
        tags: [],
      },
    }
  },
  computed: {
    ...mapGetters(['getProductCategories', 'getProductFlags', 'getTagsByType']),
    title() {
      return this.item ? this.item.name : ''
    },
    entity() {
      return {
        model: 'App\\Models\\Mall\\Product',
        id: this.item ? this.item.id : 0,
      }
    },
  },
  watch: {
    item: {
      handler(item) {
        this.item ? this.assignModel(item) : this.initModel()
      },
      immediate: true,
    },
    searchName(val) {
      if (this.getTagsByType('fiber').length > 0 || !val) return
      if (this.isLoading) return
      this.isLoading = true
      this.$store.dispatch('fetchTags', { pageSize: -1 }).then(() => {
        this.isLoading = false
      })
    },
  },
  created() {
    this.$store.dispatch('fetchProductCategoryTree')
  },
  methods: {
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key]
      }
      this.formModel.body = data.content || ''
      this.formModel.tags =
        data.tags && data.tags.length > 0
          ? data.tags.map((item) => item.name)
          : []
      this.formModel.categories =
        data.categories.length > 0
          ? data.categories.map((item) => item.id)
          : null
    },
    initModel() {
      this.formModel = {
        name: null,
        is_active: null,
        description: null,
        slug: null,
        flag: 1,
        reference_url: null,
        specs: '',
        categories: [],
        tags: [],
      }
    },
    handleSubmit() {
      this.loading = true
      const data = this.formModel
      data.content = this.formModel.body
      if (this.item && this.item.id) {
        this.$store
          .dispatch('updateProduct', {
            id: this.item.id,
            data: data,
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createProduct', data)
          .then(() => {
            this.loading = false
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleCategoriesChange(categories) {
      this.formModel.categories = categories
      this.formModel.category_ids = categories.map((item) => {
        return item.id
      })
    },
    handleViewItem() {
      if (this.item) {
        window.open(this.item.href, '_blank')
      }
    },
    handleViewReference() {
      if (this.item) {
        window.open(this.item.reference_url, '_blank')
      }
    },
    handleShowTranslation(field) {
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation = true
    },
  },
}
</script>
