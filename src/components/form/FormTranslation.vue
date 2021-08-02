<template>
  <v-sheet>
    <v-tabs v-model="defaultField" class="border-bottom">
      <v-tab v-for="field in fields" :key="field" :href="'#' + field">
        {{ field }}
      </v-tab>
      <v-spacer />
    </v-tabs>
    <form-field-translation
      :field="defaultField"
      :entity="entity"
      :loading="loading"
      :value="translations[defaultField]"
      :text="item[defaultField]"
      @form:cancel="$emit('form:cancel')"
    />
  </v-sheet>
</template>

<script>
import FormFieldTranslation from './FormFieldTranslation'
export default {
  name: 'FormTranslation',
  components: {
    FormFieldTranslation,
  },
  props: {
    entity: Object,
    item: Object,
    fields: Array,
  },
  data() {
    return {
      defaultField: null,
      loading: false,
      translations: {},
    }
  },
  computed: {},
  watch: {
    entity: {
      handler(item) {
        this.fetchFieldTranslation(item)
      },
      immediate: true,
    },
  },
  methods: {
    fetchFieldTranslation(item) {
      this.loading = true
      this.$store
        .dispatch('fetchFieldTranslation', item)
        .then(({ data }) => {
          this.translations = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>
