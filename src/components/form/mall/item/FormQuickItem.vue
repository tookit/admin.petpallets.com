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
import TagSelect from '@/components/tag/TagSelect'
import { VTextField, VTextarea, VAutocomplete } from 'vuetify/lib'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
import { mapGetters } from 'vuex'
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
    ...mapGetters(['getNestedCategories', 'getTagsByType', 'getProductFlags']),
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
          cols: 12,
          element: 'v-cascader',
          props: {
            name: 'mall_category_id',
            items: this.getNestedCategories,
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
          cols: 6,
          element: TagSelect,
          props: {
            name: 'tags',
            type: 'fiber',
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
