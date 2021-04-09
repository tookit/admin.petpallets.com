<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    :show-header="showHeader"
    color="primary"
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  />
</template>

<script>
import { VTextField, VTextarea } from 'vuetify/lib'
export default {
  props: {
    item: Object,
    showHeader: Boolean,
    action: Function,
  },
  data() {
    return {
      loading: false,
      formModel: {},
    }
  },
  computed: {
    formTitle() {
      return 'Edit SEO - ' + this.item.name
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'meta_title',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Meta title is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'meta_keywords',
            items: [],
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Meta Keywords is required'],
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'meta_description',
            outlined: true,
          },
        },
      ]
    },
  },
  watch: {
    item: {
      handler(item) {
        this.formModel = this.initModel(item) || {}
      },
      immediate: true,
    },
  },
  methods: {
    initModel(item) {
      return item
    },
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const body = {
          id: this.item.id,
          data: this.formModel,
        }
        this.action
          .call(this, body)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    transformData(data) {
      return data
    },
  },
}
</script>
