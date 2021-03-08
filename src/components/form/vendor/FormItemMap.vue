<template>
  <v-form ref="form" v-model="valid">
    <v-container fluid>
      <v-row>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.title"
            outlined
            label="Title"
            name="Title"
            placeholder="Title selector"
            :rules="formRules.title"
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.description"
            :rules="formRules.description"
            label="Description"
            name="Description"
            placeholder="Description selector"
            outlined
          />
        </v-col>
        <v-col :cols="12">
          <v-text-field
            v-model="formModel.specs"
            :rules="formRules.specs"
            label="Specs"
            name="Specs"
            placeholder="Specs selector"
            outlined
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.image"
            :rules="formRules.image"
            label="Image "
            name="Image "
            placeholder="Image selector"
            outlined
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.image_range"
            :rules="formRules.image_range"
            label="Image Range"
            name="Image Range"
            placeholder="Image Range"
            outlined
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormItemMap',
  components: {},
  props: {
    item: Object
  },
  data() {
    return {
      loading: false,
      valid: true,
      formModel: {
        title: null,
        description: null,
        specs: null,
        image: null,
        image_range: null
      },
      formRules: {
        title: [(v) => !!v || 'Title is required']
      }
    }
  },
  computed: {
    ...mapGetters(['getCountries'])
  },
  watch: {
    item: {
      handler(item) {
        console.log(item)
        this.item && item.product_map
          ? this.assignModel(item.product_map)
          : this.initModel()
      },
      immediate: true
    }
  },
  methods: {
    assignModel(data) {
      console.log(data)
      for (let key in this.formModel) {
        this.formModel[key] = data[key] || null
      }
    },
    initModel() {
      this.formModel = {
        title: null,
        description: null,
        specs: null,
        image: null,
        image_range: null
      }
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        return this.$store
          .dispatch('updateVendor', {
            id: this.item.id,
            data: {
              product_map: data
            }
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    transformData(data) {
      return data
    }
  }
}
</script>
