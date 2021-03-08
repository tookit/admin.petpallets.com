<template>
  <v-card :loading="loading">
    <v-card-title>{{ formTitle }}</v-card-title>
    <v-divider />
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-col :cols="12" v-for="item in getLocales" :key="item.value">
              <v-text-field
                v-model="formModel[item.value]"
                :label="item.text"
                :placeholder="item.text"
                :append-icon="
                  item.value === getLocale ? '' : 'mdi-google-translate'
                "
                @click:append="handleAutoTranslate(item.value)"
                outlined
                hide-details
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn text @click="$emit('form:cancel')">
        cancel
      </v-btn>
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
    field: String,
    text: String
  },
  data() {
    return {
      loading: false,
      btnLoading: false,
      formModel: {}
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getLocale']),
    formTitle() {
      return 'Translation - ' + this.text
    }
  },
  watch: {
    entity: {
      handler(item) {
        this.initModel()
        this.fetchFieldTranslation(item)
      },
      deep: true,
      immediate: true
    },
    field: {
      handler(val) {
        this.initModel()
        this.fetchFieldTranslation(this.entity)
      }
    }
  },
  methods: {
    initModel() {
      this.formModel = {
        en: this.text
      }
    },
    fetchFieldTranslation(item) {
      const { model, id } = item
      this.$store
        .dispatch('fetchFieldTranslation', {
          model,
          id,
          field: this.field
        })
        .then(({ data }) => {
          this.formModel = data
        })
    },
    handleAutoTranslate(target) {
      this.loading = true
      this.$store
        .dispatch('fetchTranslation', {
          target: target,
          text: this.text
        })
        .then(({ data }) => {
          this.formModel[target] = data.text
          this.loading = false
        })
    },
    handleSubmit() {
      const data = {
        model: this.entity.model,
        id: this.entity.id,
        field: this.field,
        translations: this.formModel
      }
      this.btnLoading = true
      this.$store.dispatch('updateFieldTranslation', data).then(({ data }) => {
        this.btnLoading = false
        this.$emit('form:success')
      })
    }
  }
}
</script>

<style></style>
