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
                v-model="formModel.uri"
                readonly
                label="Href"
                outlined
                placeholder="uri"
                append-icon="mdi-eye"
                @click:append="handleViewItem"
              />
            </v-col>
            <v-col :cols="6">
              <v-switch
                name="Active"
                label="Active"
                placeholder="Active"
                v-model="formModel.is_active"
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
      <form-translation :field="translationField" :text="translationText" :entity="entity" @form:cancel="showTranslation = false" @form:success="showTranslation = false" />
    </v-dialog>
  </v-card>
</template>

<script>
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormNews',
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
        uri: null,
        is_active: false,
      }
    }
  },
  computed: {
    directory() {
      return this.item ? `news/${this.item.id}` : `news`
    },
    entity() {
      return {
        model: "App\\Models\\CMS\\Post",
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
          slug: null,
          content: '',
          img: null,
          is_actvie: false,
          category_id: 0
        }
      }
    },
    handleSubmit() {
      this.loading = true

      if (this.item.id) {
        this.$store
          .dispatch('updateMenu', {
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
          .dispatch('createMenu', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/cms/menu/item/${data.id}`
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
    handleShowTranslation(field){
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation  = true
    }
  },
  created() {}
}
</script>

<style></style>
