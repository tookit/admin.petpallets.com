<template>
  <v-form-builder
    ref="builder"
    v-model="formModel"
    :items="formItems"
    :loading="loading"
    color="primary"
    @form:submit="handleSubmit"
  />
</template>

<script>
import { URL } from '@/utils/regex'
import { mapGetters } from 'vuex'
import VFormBuilder from '@/components/builder/VFormBuilder'
import { VTextarea, VTextField, VAutocomplete } from 'vuetify/lib'
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
      formModel: {},
    }
  },
  computed: {
    ...mapGetters(['getCountries']),
    formItems() {
      return [
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'name',
            required: true,
            rules: [(v) => !!v || 'Name is required'],
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'website',
            required: true,
            rules: [(v) => URL.test(v) || 'Website is not a valid URL'],
          },
        },
        {
          cols: 6,
          element: VTextarea,
          props: {
            name: 'description',
          },
        },
        {
          cols: 6,
          element: VTextarea,
          props: {
            name: 'address',
          },
        },
        {
          cols: 6,
          element: VAutocomplete,
          props: {
            name: 'country',
            items: this.countires,
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'city',
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'mobile',
          },
        },
        {
          cols: 6,
          element: VTextField,
          props: {
            name: 'email',
          },
        },
      ]
    },
    countires() {
      return this.getCountries.map((item) => {
        return {
          text: item.country,
          value: item.country,
        }
      })
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
