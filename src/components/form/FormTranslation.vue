<template>
  <v-card :loading="loading">
    <v-toolbar tile flat>
      <v-toolbar-items>
        <v-autocomplete
          v-model="field"
          class="align-center"
          :items="computeTranslable"
          label="Translable"
          hide-details
          dense
          @change="handleFieldChange"
        />
      </v-toolbar-items>
    </v-toolbar>
    <v-divider />
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-col v-for="locale in getLocales" :key="locale.value" :cols="12">
              <v-text-field
                v-model="formModel[locale.value]"
                :label="locale.text"
                :placeholder="locale.text"
                :append-icon="
                  locale.value === getLocale ? '' : 'mdi-google-translate'
                "
                outlined
                hide-details
                @click:append="handleAutoTranslate(locale.value)"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn text @click="$emit('form:cancel')"> cancel </v-btn>
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit"
        >save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormTranslation',
  props: {
    entity: Object,
    item: Object,
    fields: Array,
  },
  data() {
    return {
      field: 'name',
      loading: false,
      btnLoading: false,
      translations: {},
      formModel: {},
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getLocale']),
    text() {
      return this.item[this.field]
    },
    formTitle() {
      return 'Translation - ' + this.text
    },
    computeTranslable() {
      return this.fields.map((field) => {
        return {
          text: field,
          value: field,
        }
      })
    },
  },
  watch: {
    entity: {
      handler(item) {
        this.initModel()
        this.fetchFieldTranslation(item)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initModel() {
      this.formModel = {
        en: this.text,
      }
    },
    fetchFieldTranslation(item) {
      this.$store.dispatch('fetchFieldTranslation', item).then(({ data }) => {
        this.translations = data
        this.formModel = data[this.field]
      })
    },
    handleAutoTranslate(target) {
      this.loading = true
      this.$store
        .dispatch('fetchTranslation', {
          target: target,
          text: this.text,
        })
        .then(({ data }) => {
          this.formModel[target] = data.text
          this.loading = false
        })
    },
    handleFieldChange(field) {
      this.formModel = this.translations[field]
    },
    handleSubmit() {
      const data = {
        ...this.entity,
        field: this.field,
        translations: this.formModel,
      }
      this.btnLoading = true
      this.$store.dispatch('updateFieldTranslation', data).then(({ data }) => {
        this.btnLoading = false
        this.$emit('form:success')
      })
    },
  },
}
</script>
