<template>
  <div>
    <template v-if="!image">
      <div class="image-holder" @click="showDialog = true">
        <v-icon size="24">mdi-plus</v-icon>
      </div>
    </template>
    <template v-else>
      <div class="image-holder">
        <v-hover v-slot="{ hover }">
          <v-img height="128" width="128" :src="image">
            <div v-if="hover" class="image-remove primary" style="height: 100%">
              <v-icon color="white" class="mr-1" @click="showLightbox = true"
                >mdi-eye</v-icon
              >
              <v-icon color="white" @click="handleDetachMedia"
                >mdi-close</v-icon
              >
            </div>
          </v-img>
        </v-hover>
      </div>
    </template>
    <v-dialog v-model="showDialog" scrollable>
      <v-card>
        <v-toolbar color="primary">
          <v-spacer />
          <v-btn icon @click="handleAttachMedia">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon @click="showDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <media-table
            ref="table"
            v-model="selectedItems"
            show-select
            single-select
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="images"
      @hide="showLightbox = false"
    />
  </div>
</template>

<script>
import MediaTable from '@/components/table/MediaTable'
export default {
  components: {
    MediaTable,
  },
  props: {
    value: String,
    entity: Object,
    tag: {
      type: String,
      default: 'upload',
    },
  },
  data() {
    return {
      selectedItems: null,
      image: null,
      showDialog: false,
      showLightbox: false,
    }
  },
  computed: {
    images() {
      return this.value ? this.value : ''
    },
  },
  watch: {
    value: {
      handler(val) {
        this.image = val
      },
      immediate: true,
    },
  },

  methods: {
    handleAttachMedia() {
      const media = this.selectedItems[0]
      this.$emit('input', media.cloud_url)
    },
    handleDetachMedia() {
      ;(this.image = null), this.$emit('input', '')
    },
  },
}
</script>

<style lang="scss">
.image-holder {
  display: flex;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  height: 128px;
  width: 128px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.image-remove {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
