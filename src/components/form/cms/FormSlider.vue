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
import VFormBuilder from '@/components/builder/VFormBuilder'
import { VTextField, VSwitch } from 'vuetify/lib'
import ImagePicker from '@/components/image/ImagePicker'
export default {
  name: 'FormSlider',
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
    formTitle() {
      return this.item ? 'Edit Slider - ' + this.item.name : 'Create Slider'
    },
    entity() {
      return {
        model: 'App\\Models\\CMS\\Slider',
        id: this.item ? this.item.id : 0,
      }
    },
    formItems() {
      return [
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'name',
            required: true,
            outlined: true,
            rules: [(v) => !!v || 'Name is required'],
          },
        },
        {
          cols: 6,
          element: VSwitch,
          props: {
            name: 'is_active',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'url',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'order_number',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: ImagePicker,
          props: {
            name: 'img',
            entity: this.entity,
            tag: 'post',
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
        const data = this.transformData(this.formModel)
        if (this.item && this.item.id) {
          return this.$store
            .dispatch('updateSlider', {
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
            .dispatch('createSlider', data)
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
