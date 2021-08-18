<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    :show-header="showHeader"
    tile
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  >
    <v-btn v-if="id" slot="toolbar" icon>
      <v-icon @click="fetchRecord(id)">mdi-refresh</v-icon>
    </v-btn>
  </v-form-builder>
</template>

<script>
import VEditor from '@/components/editor/VEditor'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
export default {
  props: {
    id: [Number, String],
    showHeader: Boolean,
  },
  data() {
    return {
      loading: false,
      item: null,
      formModel: {},
    }
  },
  computed: {
    formTitle() {
      return this.item
        ? 'Edit Product Detail - ' + this.item.name
        : 'Create Product'
    },
    formItems() {
      return [
        {
          cols: 12,
          element: VEditor,
          default: 'type',
          props: {
            name: 'body',
            outlined: true,
          },
        },
      ]
    },
  },
  watch: {
    id: {
      handler(id) {
        return id ? this.fetchRecord(id) : null
      },
      immediate: true,
    },
  },
  methods: {
    fetchRecord(id) {
      this.loading = true
      this.formModel = {}
      this.$store
        .dispatch('getProductById', id)
        .then((resp) => {
          this.item = resp.data
          this.formModel = this.assignModel(resp.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    assignModel(value) {
      const temp = {}
      this.formItems
        .map((item) => item.props.name)
        .forEach((prop) => {
          temp[prop] = getObjectValueByPath(value, prop)
        })
      return temp
    },
    computeTags(tags, type) {
      const filtered = tags.filter((item) => item.type === type)
      return filtered.map((item) => item.name)
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
              this.$emit('form:success')
              this.loading = false
            })
            .catch(() => {
              this.$emit('form:fail')
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
    handleNameChange(e) {
      this.formModel.meta_title = e
    },
  },
}
</script>
