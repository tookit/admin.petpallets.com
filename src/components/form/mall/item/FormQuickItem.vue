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
import { VTextField, VTextarea, VAutocomplete } from 'vuetify/lib'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
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
    ...mapGetters(['getProductCategories', 'getProductFlags']),
    formTitle() {
      return this.item ? 'Edit Product - ' + this.item.name : 'Create Product'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'name',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Name is required'],
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'slug',
            required: true,
            outlined: true,
          },
        },
        {
          cols: 6,
          element: 'v-cascader',
          props: {
            name: 'category_id',
            items: this.getProductCategories,
            itemText: 'name',
            itemValue: 'id',
            required: true,
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'flag',
            items: this.getProductFlags,
            required: true,
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'description',
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
        this.formModel = this.assignModel(item) || {}
      },
      immediate: true,
    },
  },
  methods: {
    assignModel(value) {
      const temp = {}
      this.formItems
        .map((item) => item.props.name)
        .forEach((prop) => {
          temp[prop] = getObjectValueByPath(value, prop)
        })
      return temp
    },
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        if (this.item && this.item.id) {
          return this.$store
            .dispatch('updateProduct', {
              id: this.item.id,
              data: data,
            })
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return this.$store
            .dispatch('createProduct', data)
            .then(() => {
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
    transformData(data) {
      return data
    },
  },
}
</script>
