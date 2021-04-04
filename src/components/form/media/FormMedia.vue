<template>
  <v-card>
    <v-img
      aspect-ratio="1"
      contain
      height="500"
      class="grey lighten-3"
      :src="item.cloud_url"
    />
    <v-divider></v-divider>
    <v-card-text class="pa-3">
      <v-form>
        <v-text-field
          v-model="formModel.custom_properties.title"
          name="title"
          outlined
          dense
          label="Title"
          placeholder="Title"
        />
        <v-text-field
          v-model="formModel.filename"
          name="filename"
          outlined
          dense
          label="filename"
          placeholder="filename"
        />
        <v-text-field
          v-model="formModel.fingerprint"
          name="fingerprint"
          outlined
          dense
          label="Fingerprint"
          placeholder="Fingerprint"
        />
        <v-switch
          v-model="formModel.custom_properties.featured"
          name="featured"
          dense
          label="Featured"
          placeholder="Featured"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn text @click="$emit('form:cancel')">Cancel</v-btn>
      <v-btn :loading="loading" color="primary" @click="handleSubmit()"
        >Submit</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'FormMedia',
  components: {},
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {
        fingerprint: null,
        filename: null,
        custom_properties: {
          title: '',
          featured: false,
        },
      },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(item) {
        if (item) {
          this.formModel.fingerprint = item.fingerprint
          if (item.custom_properties !== null) {
            this.formModel.custom_properties = item.custom_properties
          }
        } else {
          this.formModel = {
            filename: '',
            fingerprint: null,
            custom_properties: {
              title: '',
              featured: false,
            },
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.loading = true
      const payload = {
        id: this.item.id,
        data: this.formModel,
      }
      this.$store
        .dispatch('updateMedia', payload)
        .then(() => {
          this.$emit('form:success')
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style scoped lang="scss">
.v-dropzone {
  border: 2px dashed #0087f7;
}
</style>
