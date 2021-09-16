<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-col v-for="locale in getLocales" :key="locale.value" :cols="12">
              <v-text-field
                v-model="formModel[locale.value]"
                :loading="translating[locale.value]"
                :label="locale.text"
                :placeholder="locale.text"
                append-icon="mdi-google-translate"
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
  props: {
    entity: Object,
    loading: Boolean,
    value: [Object, Array],
    field: String,
    text: String,
  },
  data() {
    return {
      btnLoading: false,
      formModel: {},
      translating: {},
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getLocale']),
  },
  watch: {
    value: {
      handler(val) {
        return val ? this.initFormModel(val) : null
      },
      immediate: true,
    },
  },

  methods: {
    initFormModel(val) {
      this.formModel = {}
      for (let key in val) {
        this.formModel[key] = val[key]
      }
    },
    handleAutoTranslate(target) {
      this.$set(this.translating, target, true)
      this.$store
        .dispatch('fetchTranslation', {
          target: target,
          text: this.text,
        })
        .then(({ data }) => {
          this.$set(this.formModel, target, data.text)
          this.$set(this.translating, target, false)
        })
    },
    handleSubmit() {
      const data = {
        ...this.entity,
        field: this.field,
        translations: this.formModel,
      }
      this.btnLoading = true
      this.$store.dispatch('updateFieldTranslation', data).then(() => {
        this.btnLoading = false
        this.$emit('form:success')
      })
    },
  },
}
</script>
