<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    color="primary"
    show-header
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  />
</template>

<script>
import { VTextField, VCombobox, VImg } from 'vuetify/lib'
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {},
    }
  },
  computed: {
    formTitle() {
      return 'Move Media'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VImg,
          props: {
            name: 'colud_url',
          },
        },
        {
          cols: 12,
          element: VCombobox,
          props: {
            name: 'directory',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Direcotry is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'filename',
            required: true,
            outlined: true,
          },
        },
      ]
    },
  },
  watch: {
    item: {
      handler(item) {
        this.formModel = item || {}
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.formModel
        data.id = this.item.id
        return this.$store
          .dispatch('moveMedia', data)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
  },
}
</script>
