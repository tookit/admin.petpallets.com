<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :items="formItems"
    :loading="loading"
    @form:submit="handleSubmit"
  />
</template>

<script>
import { URL } from '@/utils/regex'
import { mapGetters } from 'vuex'
import VFormBuilder from '@/components/builder/VFormBuilder'
import { VTextarea, VTextField } from 'vuetify/lib'
export default {
  name: 'FormVendor',
  components: {
    VFormBuilder,
  },
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      valid: true,
      search: null,
      formItems: [
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'name',
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'description',
          },
        },
      ],
      formModel: {
        name: null,
        description: null,
        website: null,
        country: null,
        city: null,
        address: null,
        mobile: null,
        contact: null,
        email: null,
      },
      multiLanguages: ['name', 'description', 'address', 'contact'],
      formRules: {
        name: [(v) => !!v || 'Name is required'],
        website: [
          (v) => {
            return URL.test(v) || 'Website is not a valid URL'
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['getCountries']),
  },
  watch: {
    item: {
      handler(item) {
        this.item ? this.assignModel(item) : this.initModel()
      },
      immediate: true,
    },
  },
  methods: {
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key] || null
      }
    },
    initModel() {
      this.formModel = {
        name: null,
        description: null,
        website: null,
        country: null,
        city: null,
        address: null,
        mobile: null,
        contact: null,
        email: null,
      }
    },
    handleSubmit() {
      const form = this.$refs.builder.$refs.form
      if (form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        if (this.item && this.item.id) {
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
        } else {
          return this.$store
            .dispatch('createVendor', data)
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
