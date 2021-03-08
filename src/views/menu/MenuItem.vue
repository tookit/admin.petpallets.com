<template>
  <div class="page-menu-item view">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <form-menu :item="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormMenu from '@/components/form/menu/FormMenu'
export default {
  props: {
    id: [Number, String]
  },
  components: {
    FormMenu
  },
  data() {
    return {
      item: null
    }
  },
  computed: {},
  watch: {
    id: {
      handler(id) {
        if (id) {
          this.fetchRecord(id)
        }
      },
      immediate: true
    }
  },
  methods: {
    fetchRecord(id) {
      this.$store.dispatch('getNewsCategoryById', id).then(({ data }) => {
        this.item = data
      })
    }
  }
}
</script>

<style></style>
