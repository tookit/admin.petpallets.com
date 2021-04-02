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
import { VTextField, VAutocomplete } from 'vuetify/lib'
import { mapGetters } from 'vuex'
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
    ...mapGetters(['getEntityList']),
    formTitle() {
      return 'Attach Entity'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'entity',
            required: true,
            outlined: true,
            items: this.getEntityList,
            rules: [(v) => !!v || 'Entity is required'],
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'tag',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Entity ID is required'],
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'entityId',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Entity ID is required'],
          },
        },
      ]
    },
  },
  methods: {
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        data.id = this.item.id
        console.log(data)
        this.$store
          .dispatch('attachEntityForMedia', data)
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
