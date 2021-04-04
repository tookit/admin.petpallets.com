<template>
  <v-card>
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.meta_title"
                outlined
                name="meta_title"
                placeholder="Meta title"
                label="Meta title"
              ></v-text-field>
            </v-col>
            <v-col :cols="6">
              <v-text-field
                v-model="formModel.meta_keywords"
                outlined
                placeholder="Keyword"
                label="Meta Keyword"
              ></v-text-field>
            </v-col>
            <v-col :cols="12">
              <v-textarea
                v-model="formModel.meta_description"
                outlined
                placeholder="Meta description"
                label="Meta description"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-form>
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
export default {
  props: {
    item: Object,
    action: String,
  },
  data() {
    return {
      loading: false,
      formModel: {
        meta_title: null,
        meta_keywords: null,
        meta_description: null,
      },
    }
  },
  computed: {},
  watch: {
    item: {
      handler(item) {
        return item ? this.assignModel(item) : this.initModel()
      },
      immediate: true,
    },
  },
  methods: {
    assignModel(data) {
      for (let key in this.formModel) {
        this.formModel[key] = data[key]
      }
    },
    initModel() {
      this.formModel = {
        meta_title: null,
        meta_keywords: null,
        meta_description: null,
      }
    },
    handleSubmit() {
      this.$store.dispatch(this.action, {
        id: this.item.id,
        data: this.formModel,
      })
    },
  },
}
</script>

<style></style>
