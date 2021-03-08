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
                placeholder="Title"
                label="Title"
                append-icon="mdi-translate"
                @click:append="handleShowTranslation('name')"
              />
            </v-col>
            <v-col :cols="6">
              <v-switch
                v-model="formModel.is_active"
                name="is_active"
                placeholder="Active"
                label="Active"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.url"
                outlined
                placeholder="Url"
                label="Url"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.img"
                outlined
                placeholder="Image"
                label="Image"
                append-icon="mdi-image"
                @click:append="handlePickImage"
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
    <v-dialog v-model="showDialog">
      <v-card>
        <v-toolbar color="primary">
          <v-spacer />
          <v-btn @click="handleAttachMedia" icon>
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn @click="showDialog = false" icon>
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <media-table
            v-model="selectedItems"
            directory="slider"
            single-select
            show-select
          />
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
import MediaTable from '@/components/table/MediaTable'
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormSlider',
  props: {
    item: Object
  },
  components: {
    FormTranslation,
    MediaTable
  },
  data() {
    return {
      showDialog: false,
      loading: false,
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      selectedItems: [],
      formModel: {
        name: null,
        url: null,
        img: null,
        is_active: false,
        description: null
      }
    }
  },
  computed: {
    entity() {
      return {
        model: 'App\\Models\\CMS\\Slider',
        id: this.item ? this.item.id : 0
      }
    }
  },
  watch: {
    item: {
      handler(item) {
        if (item) {
          this.assignModel(item)
        }
      },
      immediate: true
    }
  },
  methods: {
    assignModel(data) {
      if (data) {
        for (let key in this.formModel) {
          this.formModel[key] = data[key] || null
        }
      } else {
        this.formModel = {
          name: null,
          url: null,
          img: null,
          is_active: false,
          description: null
        }
      }
    },
    handleSubmit() {
      this.loading = true
      if (this.item) {
        this.$store
          .dispatch('updateSlider', {
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
          .dispatch('createSlider', this.formModel)
          .then(({ data }) => {
            this.loading = false
            this.$router.push({
              path: `/cms/slider/item${data.id}`
            })
          })
      }
    },
    handlePickImage() {
      this.showDialog = true
    },
    handleAttachMedia() {
      this.showDialog = false
      if (this.selectedItems.length > 0) {
        this.formModel.img = this.selectedItems[0].cloud_url
      }
    },
    fetchImage() {
      return this.$store.dispatch('fetchSlider')
    },
    handleShowTranslation(field) {
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation = true
    }
  }
}
</script>
