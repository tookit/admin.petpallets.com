<template>
  <v-card :loading="loading">
    <v-toolbar color="primary" tile dark>
      <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon @click="$emit('click:close')"
        ><v-icon>mdi-close</v-icon></v-btn
      >
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.name"
                outlined
                label="Name"
                name="Name"
                placeholder="name"
                :rules="formRules.name"
                append-icon="mdi-translate"
                @click:append="handleShowTranslation('name')"
                @input="handleNameChange"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.slug"
                readonly
                label="Slug"
                outlined
                placeholder="slug"
                append-icon="mdi-eye"
              />
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.unit"
                outlined
                name="unit"
                placeholder="Unit"
                label="Unit"
              />
            </v-col>
            <v-col :cols="6">
              <v-select
                v-model="formModel.type"
                :items="['sku', 'spu']"
                outlined
                name="type"
                placeholder="Type"
                label="Type"
              />
            </v-col>
            <v-col :cols="12">
              <v-combobox
                v-model="formModel.tags"
                :items="getTagsByType('prop')"
                :search-input.sync="searchTag"
                hide-selected
                label="Property Group"
                multiple
                persistent-hint
                small-chips
                outlined
                deletable-chips
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>{{ search }}</strong
                        >". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>
            <v-col :cols="12">
              <v-combobox
                v-model="formModel.values"
                :items="items"
                :search-input.sync="search"
                hide-selected
                label="Property Value"
                multiple
                persistent-hint
                small-chips
                outlined
                deletable-chips
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>{{ search }}</strong
                        >". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
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
import SlugifyMixin from '@/mixins/Slugify'
import FormTranslation from '@/components/form/FormTranslation'
export default {
  name: 'FormProperty',
  components: {
    FormTranslation,
  },
  mixins: [SlugifyMixin],
  props: {
    item: Object,
  },
  data() {
    return {
      showTranslation: false,
      translationField: 'name',
      translationText: null,
      loading: false,
      loadingTags: false,
      search: null,
      searchTag: null,
      items: [],
      formModel: {
        name: null,
        type: 'spu',
        unit: null,
        slug: null,
        values: [],
      },
      formRules: {
        name: [(v) => !!v || 'Name is required'],
      },
    }
  },
  computed: {
    ...mapGetters(['getPropUnits', 'getPropTypes', 'getTagsByType']),
    entity() {
      return {
        model: 'App\\Models\\Mall\\Property',
        id: this.item ? this.item.id : 0,
      }
    },
    formTitle() {
      return this.item ? `Edit Property - ${this.item.name}` : 'Create Property'
    },
  },
  watch: {
    item: {
      handler(item) {
        this.assignModel(item)
      },
      immediate: true,
    },
  },
  methods: {
    assignModel(data) {
      if (data) {
        for (let key in this.formModel) {
          this.formModel[key] = data[key] || null
        }
        this.formModel.values = data.values.map((item) => item.value)
      } else {
        this.initModel()
      }
    },
    initModel() {
      this.formModel = {
        name: null,
        type: 'spu',
        unit: null,
        slug: null,
        values: [],
      }
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.item) {
          this.$store
            .dispatch('updateProperty', {
              id: this.item.id,
              data: this.formModel,
            })
            .then(() => {
              this.loading = false
              this.$emit('form:success')
            })
            .catch(() => {
              this.loading = false
              this.$emit('form:failed')
            })
        } else {
          this.$store
            .dispatch('createProperty', this.formModel)
            .then(() => {
              this.loading = false
              this.$emit('form:success')
            })
            .catch(() => {
              this.loading = false
              his.$emit('form:failed')
            })
        }
      }
    },

    handleNameChange(val) {
      this.formModel.slug = this.slugify(val.toLowerCase())
    },
    handleShowTranslation(field) {
      this.translationField = field
      this.translationText = this.formModel[field]
      this.showTranslation = true
    },
  },
}
</script>
