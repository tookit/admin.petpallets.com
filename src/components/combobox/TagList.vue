<template>
  <v-combobox
    outlined
    multiple
    small-chips
    label="Tags"
    v-model="formModel.tags"
    :items="getTagsByType(type)"
    :loading="isLoading"
    :search-input.sync="searchName"
    placeholder="Tags"
    item-text="name"
    item-value="name"
    :return-object="false"
  >
    <template v-slot:no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            No results matching "<strong>{{ searchName }}</strong
            >". Press <kbd>enter</kbd> to create a new one
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    type: {
      type: String,
      required: true,
      default: 'fiber'
    }
  },
  data() {
    return {}
  },

  computed: {
    ...mapGetters(['getTagsByType'])
  },
  watch: {
    searchName(val) {
      if (this.getTagsByType('fiber').length > 0 || !val) return
      if (this.isLoading) return
      this.isLoading = true
      this.$store.dispatch('fetchTags', { pageSize: -1 }).then(() => {
        this.isLoading = false
      })
    }
  }
}
</script>

<style></style>
