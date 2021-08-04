<template>
  <div>
    <v-img
      v-if="items.length > 0"
      class="ma-3"
      :src="items[0].url ? items[0].url : items[0]"
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
          src: item.url ? item.url : item,
        }
      })
    },
  },
}
</script>

<style></style>
