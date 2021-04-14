<template>
  <v-combobox
    v-model="inputValue"
    :label="label"
    :placeholder="placeholder"
    outlined
    :items="getTagsByType(type)"
    :loading="isLoading"
    :search-input.sync="searchName"
    item-text="text"
    item-value="name"
    deletable-chips
    multiple
    small-chips
    :return-object="false"
    @change="handleChange"
  >
    <template #no-data>
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
    label: String,
    placeholder: String,
    value: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'fiber',
    },
  },
  data() {
    return {
      searchName: '',
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters(['getTagsByType']),
    inputValue() {
      return this.value
    },
  },
  watch: {
    searchName(val) {
      if (val || this.isLoading) return
      this.$store.dispatch('fetchTags', {
        pageSize: -1,
      })
    },
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val)
    },
  },
}
</script>

<style></style>
