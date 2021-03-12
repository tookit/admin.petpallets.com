<template>
  <v-card :loading="loading">
    <v-card-text>
      <pdf-editor v-model="formModel.raw_spec" />
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
import PdfEditor from '@/components/editor/PdfEditor'
export default {
  components: {
    PdfEditor,
  },
  props: {
    category: Object,
  },
  data() {
    return {
      loading: false,
      formModel: {
        raw_spec: 'null',
      },
    }
  },
  computed: {},
  watch: {
    category: {
      handler(item) {
        this.formModel.raw_spec = item && item.raw_spec ? item.raw_spec : ''
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
