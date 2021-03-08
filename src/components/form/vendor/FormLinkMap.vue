<template>
  <v-form ref="form" v-model="valid">
    <v-container fluid>
      <v-row>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.selector"
            :rules="formRules.selector"
            label="Link Selector"
            name="Link Selector"
            placeholder="Link selector"
            outlined
          />
        </v-col>
        <v-col :cols="6">
          <v-text-field
            v-model="formModel.range"
            :rules="formRules.range"
            label="Range"
            name="Range"
            placeholder="Range selector"
            outlined
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  name: 'FormLinkMap',
  components: {},
  props: {
    item: Object
  },
  data() {
    return {
      loading: false,
      valid: true,
      formModel: {
        range: null,
        selector: null
      },
      formRules: {
        range: [(v) => !!v || 'Range is required'],
        selector: [(v) => !!v || 'Selector is required']
      }
    }
  },
  computed: {},
  watch: {
    item: {
      handler(item) {
        item && item.link_map
          ? this.assignModel(item.link_map)
          : this.initModel()
      },
      immediate: true
    }
  },
  methods: {
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key] || null
      }
    },
    initModel() {
      this.formModel = {
        range: null,
        selector: null
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
              link_map: data
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
  },
  created() {}
}
</script>

<style></style>
