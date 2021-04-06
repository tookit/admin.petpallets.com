<template>
  <v-card>
    <v-img
      aspect-ratio="1"
      contain
      height="300"
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
          label="Title"
          placeholder="Title"
          @change="handleTitleChange"
        />
        <v-combobox
          v-model="formModel.directory"
          label="Directory"
          placeholder="Move to new directory"
          outlined
          :items="getMediaDir"
          :return-object="false"
        >
        </v-combobox>
        <v-text-field
          v-model="formModel.fingerprint"
          name="fingerprint"
          outlined
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
import { mapGetters } from 'vuex'
import { getObjectValueByPath } from 'vuetify/lib/util/helpers'

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
        directory: null,
        fingerprint: null,
        filename: null,
        custom_properties: {
          title: '',
          featured: false,
        },
      },
    }
  },
  computed: {
    ...mapGetters(['getMediaDir']),
  },
  watch: {
    item: {
      handler(item) {
        this.initModel(item)
      },
      immediate: true,
    },
  },
  methods: {
    initModel(item) {
      for (let key in this.formModel) {
        if (key === 'custom_properties') {
          this.formModel['custom_properties'] = {
            title: getObjectValueByPath(item, 'custom_properties.title'),
            featured: getObjectValueByPath(item, 'custom_properties.featured'),
          }
        } else {
          this.formModel[key] = getObjectValueByPath(item, key)
        }
      }
    },
    handleTitleChange(val) {
      this.formModel.fingerprint = val
    },
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
