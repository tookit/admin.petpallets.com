<template>
  <v-card :loading="loading">
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
              <v-autocomplete
                v-model="formModel.category_id"
                outlined
                :items="getCmsCategories"
                name="Category"
                label="Category"
                placeholder="Category"
              />
            </v-col>
            <v-col :cols="6">
              <v-switch
                v-model="formModel.is_active"
                name="Active"
                label="Active"
                placeholder="Active"
              />
            </v-col>
            <v-col :cols="12">
              <v-combobox
                outlined
                multiple
                small-chips
                label="Tags"
                v-model="formModel.tags"
                :items="getTagsByType('post')"
                :loading="isLoading"
                :search-input.sync="searchName"
                placeholder="Tags"
                item-text="name"
                item-value="name"
                :return-object="false"
              >
                <template v-slot:no-data>
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
            <v-col v-if="item" :cols="6">
              <label>Featured Image</label>
              <image-holder
                v-model="selectedMedia"
                :entity="entity.model"
                :entity-id="item.id"
                tag="news"
                @detached="selectedMedia = null"
                @attached="handleAttached"
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
              <label for="">Content</label>
              <v-editor
                v-model="formModel.content"
                @click:image="showTranslation = true"
              />
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
import VEditor from '@/components/editor/Jodit'
import FormTranslation from '@/components/form/FormTranslation'
import ImageHolder from '@/components/image/ImageHolder'

export default {
  name: 'FormNews',
  components: {
    VEditor,
    ImageHolder,
    FormTranslation
  },
  props: {
    item: Object
  },
  data() {
    return {
      searchName: '',
      //
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      isLoading: false,
      //
      selectedMedia: null,
      loading: false,
      formModel: {
        name: null,
        description: null,
        img: null,
        slug: null,
        content: '',
        is_active: false,
        tags: [],
        category_id: 0
      }
    }
  },
  computed: {
    ...mapGetters(['getCmsCategories', 'getTagsByType']),
    formTitle() {
      return this.item ? 'Edit News' : 'Create News'
    },
    directory() {
      return this.item ? `news/${this.item.id}` : `news`
    },
    entity() {
      return {
        model: 'App\\Models\\CMS\\Post',
        id: this.item ? this.item.id : 0
      }
    }
  },
  watch: {
    item: {
      handler(item) {
        return item ? this.assignModel(item) : this.initModel()
      },
      immediate: true
    },
    searchName(val) {
      if (this.getTagsByType('fiber').length > 0 || !val) return
      if (this.isLoading) return
      this.isLoading = true
      this.$store.dispatch('fetchTags', { pageSize: -1 }).then(() => {
        this.isLoading = false
      })
    }
  },
  methods: {
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key]
      }
      if (data.media.length > 0) {
        this.selectedMedia = data.media[0]
      }
    },
    initModel() {
      this.formModel = {
        name: null,
        description: null,
        slug: null,
        content: '',
        img: null,
        is_actvie: false,
        tags: [],
        category_id: 0
      }
    },
    handleSubmit() {
      this.loading = true
      if (this.item && this.item.id) {
        this.$store
          .dispatch('updateNews', {
            id: this.item.id,
            data: this.formModel
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createNews', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/cms/news/item/${data.id}`
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    fetchNewsCategory() {
      if (this.getCmsCategories.length === 0) {
        this.$store.dispatch('fetchNewsCategory', { pageSize: -1 })
      }
    },
    handleViewItem() {
      if (this.item) {
        window.open(this.item.href, '_blank')
      }
    },
    handleAttached(media) {
      this.selectedMedia = media
    },

    handleShowTranslation(field) {
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation = true
    }
  }
}
</script>

<style lang="scss"></style>
