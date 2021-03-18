<template>
  <v-card :loading="loading">
    <v-toolbar dark color="primary" flat>
      <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form-builder ref="builder" v-model="formModel" :items="formItems" />
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit"
        >save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import { URL } from '@/utils/regex'
import { mapGetters } from 'vuex'
import VFormBuilder from '@/components/form-builder/VFormBuilder'
import { VTextarea, VTextField, VAutocomplete } from 'vuetify/lib'
export default {
  name: 'FormVendor',
  components: { VFormBuilder },
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {},
      formItems: [
        {
          element: VTextField,
          cols: 12,
          props: {
            name: 'name',
            outlined: true,
            rules: [(v) => !!v || 'Name is required'],
          },
        },
        {
          element: VTextarea,
          cols: 6,
          props: {
            name: 'description',
            outlined: true,
          },
        },
        {
          element: VTextarea,
          cols: 6,
          props: {
            name: 'address',
            outlined: true,
          },
        },
        {
          element: VAutocomplete,
          cols: 6,
          props: {
            name: 'country',
            outlined: true,
          },
        },
        {
          element: VTextField,
          cols: 6,
          props: {
            name: 'website',
            outlined: true,
            rules: [
              (v) => {
                return URL.test(v) || 'Website is not a valid URL'
              },
            ],
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getCountries']),
    formTitle() {
      return this.item ? `Edit Vendor - ${this.item.name} ` : 'Create Vendor'
    }
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
      console.log(this.$refs.builder)
    },
  },
}
</script>
