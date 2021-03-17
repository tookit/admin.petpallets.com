<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-editor v-model="formModel.landing" />
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit"
        >save</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
import VEditor from '@/components/editor/VEditor'
export default {
  components: {
    VEditor,
  },
  props: {
    category: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {
        landing: 'null',
      },
    }
  },
  computed: {},
  watch: {
    category: {
      handler(item) {
        this.formModel.landing = item && item.landing ? item.landing : ''
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.$store
        .dispatch('updateProductCategory', {
          id: this.category.id,
          data: this.formModel,
        })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style></style>
