<template>
  <div>
    <v-img
      v-if="item"
      class="ma-3"
      :src="item.cloud_url"
      width="50"
      height="50"
      @click="showLightbox = true"
    />
    <vue-easy-lightbox
      :visible="showLightbox"
      :imgs="images"
      @hide="showLightbox = false"
    />
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    item: Object,
  },
  data() {
    return {
      showLightbox: false,
    }
  },
  computed: {
    images() {
      return this.items.map((item) => {
        return {
          src: item.cloud_url,
          titel: item.filename,
        }
      })
    },
  },
}
</script>

<style></style>
