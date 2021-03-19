<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :items="formItems"
    :loading="loading"
    color="primary"
    @form:submit="handleSubmit"
  />
</template>

<script>
import VFormBuilder from '@/components/builder/VFormBuilder'
import VJsonEditor from '@/components/editor/VJsonEditor'
export default {
  name: 'FormItemMap',
  components: {
    VFormBuilder,
  },
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
    formItems() {
      return [
        {
          cols: 12,
          element: VJsonEditor,
          props: {
            name: 'product_map',
          },
        },
      ]
    },
    countires() {
      return this.getCountries.map((item) => {
        return {
          text: item.country,
          value: item.country,
        }
      })
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
        const data = this.transformData(this.formModel)
        return this.$store
          .dispatch('updateVendor', {
            id: this.item.id,
            data: data,
          })
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
