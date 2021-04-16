<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :title="formTitle"
    :items="formItems"
    :loading="loading"
    :show-header="showHeader"
    @form:submit="handleSubmit"
    @form:cancel="$emit('form:cancel')"
  >
    <v-btn v-if="id" slot="toolbar" icon>
      <v-icon @click="fetchRecord(id)">mdi-refresh</v-icon>
    </v-btn>
  </v-form-builder>
</template>

<script>
import { VTextField, VTextarea, VAutocomplete } from 'vuetify/lib'
import VEditor from '@/components/editor/VEditor'
import { mapGetters } from 'vuex'
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
    ...mapGetters(['getNestedCategories', 'getProductFlags']),
    formTitle() {
      return this.item
        ? 'Edit Mall Category - ' + this.item.name
        : 'Create Mall Category'
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
            rules: [(v) => !!v || 'name is required'],
          },
        },
        {
          cols: 12,
          element: 'v-cascader',
          props: {
            name: 'parent_id',
            items: this.getNestedCategories,
            itemText: 'name',
            itemValue: 'id',
            required: true,
            outlined: true,
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
          element: VEditor,
          default: 'type',
          props: {
            name: 'raw_spec',
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'meta_title',
            required: true,
            outlined: true,
          },
        },

        {
          cols: 12,
          element: VTextField,
          props: {
            name: 'meta_keywords',
            required: true,
            outlined: true,
          },
        },
        {
          cols: 12,
          element: VTextarea,
          props: {
            name: 'meta_description',
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
        .dispatch('getProductCategoryById', id)
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
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        if (this.item && this.item.id) {
          return this.$store
            .dispatch('updateProductCategory', {
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
            .dispatch('createProductCategory', data)
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
