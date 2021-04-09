<template>
  <div class="page-item view">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-tabs v-model="defaultTab" class="border-bottom">
            <v-tab v-for="tab in tabs" :key="tab.value" :href="'#' + tab.value">
              {{ tab.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="defaultTab"> </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    id: {
      type: [Number, String],
      default: 0,
    },
  },
  data() {
    return {
      productLink: null,
      showDialog: false,
      selectedItems: [],
      defaultTab: 'general',
      tabs: [],
      loading: false,
      item: null,
      images: [],
    }
  },
  computed: {},
  watch: {
    id: {
      immediate: true,
    },
  },
  methods: {},
}
</script>

<style></style>
