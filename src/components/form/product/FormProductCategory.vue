<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-cascader
                v-if="getProductCategories.length > 0"
                v-model="formModel.parent_id"
                label="Parent Category"
                :items="getProductCategories"
                item-text="name"
                item-value="id"
                outlined
                @clear:click="handleClear"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                label="Name"
                name="name"
                placeholder="Name"
                append-icon="mdi-translate"
                @click:append="handleShowTranslation('name')"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                readonly
                label="Slug"
                outlined
                placeholder="Slug"
                append-icon="mdi-eye"
                @click:append="handleViewItem"
              />
            </v-col>

            <v-col :cols="6">
              <v-text-field
                v-model="formModel.icon"
                label="Icon"
                outlined
                placeholder="Icon"
                append-icon="mdi-image"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                v-model="formModel.flag"
                :items="getProductFlags"
                label="Flag"
                placeholder="Flag"
                outlined
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.reference_url"
                outlined
                label="Reference"
                append-icon="mdi-eye"
                placeholder="Reference"
                @click:append="handleViewReference"
              />
            </v-col>
            <v-col :cols="3">
              <v-text-field
                v-model="formModel.order_column"
                label="Sort Number"
                outlined
                placeholder="Larger will show on the top"
              />
            </v-col>
            <v-col :cols="3">
              <v-switch
                v-model="formModel.is_active"
                label="Active"
                outlined
                placeholder="Active"
              />
            </v-col>
            <v-col :cols="12">
              <v-textarea
                v-model="formModel.description"
                outlined
                placeholder="Description"
                label="Description"
                append-icon="mdi-translate"
                @click:append="handleShowTranslation('description')"
              />
            </v-col>
            <v-col :cols="12">
              <label for="">Spec</label>
              <v-editor v-model="formModel.raw_spec" outlined />
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
    <v-dialog
      v-model="showDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar color="primary">
          <v-spacer />
          <v-btn icon @click="handleCloseDialog">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon @click="handleCloseDialog">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <media-table :directory="directory" @selected="handleSelectMedia" />
        </v-card-text>
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
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import VCascader from '@/components/cascader/'
import MediaTable from '@/components/table/MediaTable'
import FormTranslation from '@/components/form/FormTranslation'
import VEditor from '@/components/editor/Jodit'
export default {
  name: 'FormProductCategory',
  components: { VCascader, MediaTable, FormTranslation, VEditor },
  props: {
    item: Object,
  },
  data() {
    return {
      showDialog: false,
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      loading: false,
      parent_id: this.$route.query.parent_id,
      formModel: {
        name: null,
        description: null,
        raw_spec: '',
        slug: null,
        reference_url: null,
        icon: null,
        is_active: false,
        flag: 0,
        order_column: 0,
        parent_id: null,
        categories: [],
      },
    }
  },
  computed: {
    ...mapGetters(['getProductCategories', 'getProductFlags']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Category',
        id: this.item ? this.item.id : 0,
      }
    },
    directory() {
      return this.item ? `fiber/category/${this.item.id}` : null
    },
  },
  watch: {
    item: {
      handler(item) {
        return item ? this.assignModel(item) : this.initModel()
      },
      immediate: true,
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
      const { raw_spec } = data
      this.formModel['raw_spec'] = raw_spec ? raw_spec : ''
    },
    initModel() {
      this.formModel = {
        name: null,
        description: null,
        raw_spec: '',
        slug: null,
        reference_url: null,
        icon: null,
        is_active: false,
        flag: 0,
        order_column: 0,
        parent_id: null,
      }
    },
    handleSubmit() {
      this.loading = true
      if (this.item) {
        this.$store
          .dispatch('updateProductCategory', {
            id: this.item.id,
            data: this.formModel,
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createProductCategory', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/mall/category/item${data.id}`,
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleCategoryChange(val) {
      const categories = val.filter((item) => item !== 0)
      this.formModel.parent_id = categories.pop()
    },
    handleViewItem() {
      if (this.item) {
        window.open(this.item.href, '_blank')
      }
    },
    handlePickImage() {
      this.showDialog = true
    },
    handleSelectMedia(item) {
      this.selectedMedia = item
    },
    handleCloseDialog() {
      this.showDialog = false
      if (this.selectedMedia) {
        this.formModel.img = this.selectedMedia.url
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
    handleClear() {
      this.formModel.parent_id = null
    },
  },
}
</script>
