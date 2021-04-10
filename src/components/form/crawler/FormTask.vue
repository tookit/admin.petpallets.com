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
import { VTextField, VAutocomplete, VSelect } from 'vuetify/lib'
import { mapGetters } from 'vuex'
import VJsonEditor from '@/components/editor/VJsonEditor'
export default {
  name: 'FormTask',
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
    ...mapGetters(['getVendors']),
    formTitle() {
      return this.item ? 'Edit Task - ' + this.item.link : 'Create Task'
    },
    formItems() {
      return [
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'vendor_id',
            items: this.getVendors,
            required: true,
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VSelect,
          props: {
            name: 'type',
            items: ['link', 'item'],
            required: true,
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'link',
            required: true,
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'name',
            required: true,
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VJsonEditor,
          props: {
            name: 'rule',
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VJsonEditor,
          props: {
            name: 'raw_data',
            outlined: true,
          },
        },
      ]
    },
  },
  watch: {
    item: {
      handler(item) {
        this.formModel = item || { raw_data: {}, rule: {} }
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
        if (this.item && this.item.id) {
          return this.$store
            .dispatch('updateCrawlerTask', {
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
            .dispatch('createCrawlerTask', data)
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
