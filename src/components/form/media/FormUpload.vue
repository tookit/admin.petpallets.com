<template>
  <v-card>
    <v-tabs v-model="defaultTab">
      <v-tab v-for="(item, key) in tabs" :key="key" :href="'#' + item.value">
        {{ item.text }}
      </v-tab>
    </v-tabs>
    <v-card-text class="pa-3">
      <v-tabs-items v-model="defaultTab">
        <v-tab-item value="upload">
          <v-dropzone
            class="v-dropzone"
            :option="option"
            @success="handleSuccess"
          >
          </v-dropzone>
        </v-tab-item>
        <v-tab-item value="network">
          <v-text-field
            v-model="fileUrl"
            outlined
            name="URL"
            placeholder="Url"
            label="Url"
          />
          <v-btn :loading="submiting" color="primary" @click="handleUpload"
            >Upload</v-btn
          >
        </v-tab-item>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
import VDropzone from '@/components/dropzone'
export default {
  name: 'FormUpload',
  components: {
    VDropzone,
  },
  props: {
    entityId: [Number, String],
    entity: String,
    action: String,
  },
  data() {
    return {
      submiting: false,
      fileUrl: null,
      attrs: {
        accept: 'image/*',
      },
      //tabs
      defaultTab: 'upload',
      tabs: [
        {
          text: 'Upload',
          value: 'upload',
        },
        {
          text: 'Network',
          value: 'network',
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['getAccessToken']),
    option() {
      return {
        url: this.action,
        headers: {
          Authorization: 'Bearer ' + this.getAccessToken,
          entityId: this.entityId,
          entity: this.entity,
        },
        testChunks: false,
      }
    },
  },
  watch: {},
  methods: {
    handleUpload() {
      this.submiting = true
      const data = {
        file: this.fileUrl,
        entityId: this.entityId,
        entity: this.entity,
      }
      this.$store
        .dispatch('uploadMedia', data)
        .then((resp) => {
          this.submiting = false
          this.$emit('form:success', resp)
        })
        .catch(() => {
          this.submiting = false
        })
    },
    handleSuccess(e) {
      this.$emit('form:success', JSON.parse(e.xhr.response))
    },
  },
}
</script>

<style scoped lang="scss">
.v-dropzone {
  border: 2px dashed #0087f7;
}
</style>
