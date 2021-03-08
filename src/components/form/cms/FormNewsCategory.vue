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
      <v-btn @click="handleSubmit()" :loading="loading" tile color="primary">
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
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormNewsCategory',
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
        description: null,
        slug: null
      }
    }
  },
  computed: {
    ...mapGetters(['getCmsCategories']),
    formTitle() {
      return this.item ? 'Edit News' : 'Create News'
    },
    entity() {
      return {
        model: 'App\\Models\\CMS\\Category',
        id: this.item ? this.item.id : 0
      }
    }
  },
  watch: {
    item: {
      handler(item) {
        this.assignModel(item)
      },
      immediate: true
    }
  },
  methods: {
    assignModel(data) {
      if (data) {
        for (let key in this.formModel) {
          this.formModel[key] = data[key]
        }
      } else {
        this.formModel = {
          name: null,
          description: null,
          slug: null
        }
      }
    },
    handleSubmit() {
      this.loading = true

      if (this.item.id) {
        this.$store
          .dispatch('updateNewsCategory', {
            id: this.item.id,
            data: this.formModel
          })
          .then(() => {
            this.loading = false
          })
      } else {
        this.$store
          .dispatch('createNewsCategory', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/cms/categories/item/${data.id}`
            })
          })
          .catch(() => {
            this.loading = false
          })
      }
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
