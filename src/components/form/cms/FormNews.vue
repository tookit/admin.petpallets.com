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
import { VTextField, VTextarea, VAutocomplete, VSwitch } from 'vuetify/lib'
import ImageHolder from '@/components/image/ImageHolder'
import { mapGetters } from 'vuex'
export default {
  name: 'FormNews',
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
    ...mapGetters(['getCmsCategories', 'getTagsByType']),
    formTitle() {
      return this.item ? 'Edit Post - ' + this.item.name : 'Create Post'
    },
    entity() {
      return {
        model: 'App\\Models\\CMS\\Post',
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
          element: VTextField,
          props: {
            name: 'slug',
            outlined: true,
          },
        },
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'category_id',
            outlined: true,
            items: this.getCmsCategories,
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
          element: ImageHolder,
          props: {
            name: 'featured_img',
            entity: this.entity,
            tag: 'post',
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VAutocomplete,
          props: {
            name: 'tags',
            outlined: true,
            multiple: true,
            smallChips: true,
            clearable: true,
            items: this.getTagsByType('fiber'),
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'description',
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
            .dispatch('updateNews', {
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
            .dispatch('createNews', data)
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
