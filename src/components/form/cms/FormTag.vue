<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                name="name"
                placeholder="Name"
                label="Name"
                append-icon="mdi-translate"
                @input="handleInputName"
                @click:append="handleShowTranslation('name')"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                outlined
                placeholder="Slug"
                label="Slug"
                append-icon="mdi-eye"
                @click:append="handleViewItem"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                v-model="formModel.type"
                outlined
                placeholder="Type"
                label="Type"
                :items="getTagTypes"
                item-text="text"
                item-value="value"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.reference_url"
                outlined
                placeholder="Reference"
                label="Reference"
                append-icon="mdi-eye"
                @click:append="handleViewReference(formModel.reference_url)"
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
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit"
        >save</v-btn
      >
    </v-card-actions>
    <v-dialog v-model="showTranslation" scrollable>
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
import SlugifyMixin from '@/mixins/Slugify'
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormTag',
  mixins: [SlugifyMixin],
  components: {
    FormTranslation
  },
  props: {
    item: Object
  },
  data() {
    return {
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      isLoading: false,
      loading: false,
      formModel: {
        name: null,
        slug: null,
        type: 'fiber',
        description: null
      }
    }
  },
  computed: {
    ...mapGetters(['getTagTypes']),
    entity() {
      return {
        model: 'App\\Models\\Taggable\\Tag',
        id: this.item ? this.item.id : 0
      }
    }
  },
  watch: {
    item: {
      handler(item) {
        if (item) {
          this.assignModel(item)
        } else {
          this.initForm()
        }
      },
      immediate: true
    }
  },
  methods: {
    initForm() {
      this.formModel = {
        name: null,
        slug: null,
        type: 'fiber',
        description: null,
        reference_url: null
      }
    },
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key]
      }
    },
    handleSubmit() {
      this.loading = true
      if (this.item) {
        this.$store
          .dispatch('updateTag', {
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
          .dispatch('createTag', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/cms/tags/item/${data.id}`
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleViewItem() {
      if (this.item) {
        window.open(this.item.href, '_blank')
      }
    },
    handleViewReference(url) {
      if (url) {
        window.open(url, '_blank')
      }
    },
    handleInputName(name) {
      return (this.formModel.slug = this.slugify(name))
    },
    handleShowTranslation(field) {
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation = true
    }
  }
}
</script>

<style></style>
