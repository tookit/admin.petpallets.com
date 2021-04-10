<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    show-header
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  />
</template>

<script>
import { VSwitch } from 'vuetify/lib'
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
    ...mapGetters(['getNestedCategories']),
    formTitle() {
      return 'Import Product - ' + this.item.name
    },
    formItems() {
      return [
        {
          cols: 12,
          element: 'VCascader',
          props: {
            name: 'category_id',
            label: 'Category',
            items: this.getNestedCategories,
            outlined: true,
            clearable: true,
            itemText: 'name',
            itemValue: 'id',
          },
        },
        {
          cols: 12,
          element: VSwitch,
          props: {
            name: 'image',
            required: true,
            outlined: true,
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
        this.$store
          .dispatch('linkProduct', { id: this.item.id, data: this.formModel })
          .then(() => {
            this.handleRefreshItem()
            this.loading = false
          })
          .catch(() => (this.loading = false))
      }
    },
  },
}
</script>
