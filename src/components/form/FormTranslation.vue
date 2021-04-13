<template>
  <v-card :loading="loading">
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-col v-for="item in getLocales" :key="item.value" :cols="12">
              <v-text-field
                v-model="formModel[item.value]"
                :label="item.text"
                :placeholder="item.text"
                :append-icon="
                  item.value === getLocale ? '' : 'mdi-google-translate'
                "
                outlined
                hide-details
                @click:append="handleAutoTranslate(item.value)"
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
    text: String,
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      formModel: {},
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getLocale']),
    formTitle() {
      return 'Translation - ' + this.text
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
        this.formModel = data
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
    handleSubmit() {
      const data = {
        ...this.entity,
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
