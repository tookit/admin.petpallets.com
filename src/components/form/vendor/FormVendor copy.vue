<template>
  <v-form ref="form" v-model="valid">
    <v-container>
      <v-row>
        <v-col :cols="12">
          <v-text-field
            v-model="formModel.name"
            outlined
            label="Name"
            name="Name"
            placeholder="name"
            :rules="formRules.name"
          />
        </v-col>
        <v-col :cols="6">
          <v-textarea
            v-model="formModel.description"
            label="Description"
            placeholder="Description"
            counter
            outlined
          />
        </v-col>
        <v-col :cols="6">
          <v-textarea
            v-model="formModel.address"
            label="Address"
            placeholder="Address"
            counter
            outlined
          />
        </v-col>
        <v-col :cols="6">
          <v-autocomplete
            v-model="formModel.country"
            label="Country"
            outlined
            placeholder="Country"
            :items="getCountries"
            item-text="country"
            item-value="code"
          >
            <template #item="data">
              <v-list-item-avatar tile>
                <img :src="data.item.flag_base64" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  v-text="data.item.country"
                ></v-list-item-title>
                <v-list-item-subtitle
                  v-text="data.item.code"
                ></v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.city"
            label="City"
            outlined
            placeholder="City"
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.website"
            :rules="formRules.website"
            label="Website"
            outlined
            placeholder="Website"
            append-icon="mdi-eye"
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.email"
            label="Email"
            outlined
            placeholder="Email"
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.contact"
            label="Contact"
            outlined
            placeholder="Contact"
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.mobile"
            label="Mobile"
            outlined
            placeholder="mobile"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { URL } from '@/utils/regex'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
import { mapGetters } from 'vuex'
export default {
  name: 'FormVendor',
  components: {},
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      valid: true,
      search: null,
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
        if (
          typeof data[key] === 'object' &&
          this.multiLanguages.includes(key)
        ) {
          this.formModel[key] = getObjectValueByPath(data[key], 'en')
        } else {
          this.formModel[key] = data[key] || null
        }
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
      if (this.$refs.form.validate()) {
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
