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
    ...mapGetters(['getProductCategories']),
    formTitle() {
      return this.item ? 'Merge Category - ' + this.item.name : 'Merge Category'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: 'v-cascader',
          props: {
            name: 'target',
            items: this.getProductCategories,
            itemText: 'name',
            itemValue: 'id',
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
        if (this.item && this.formModel.target) {
          return this.$store
            .dispatch('mergeMallCategory', {
              source: this.item.id,
              target: this.formModel.target,
            })
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
  },
}
</script>
