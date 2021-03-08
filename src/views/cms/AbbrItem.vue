<template>
  <div class="page-news-item view">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <form-abbr :item="item" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormAbbr from '@/components/form/cms/FormAbbr'
export default {
  name: 'NewsItem',
  props: {
    id: [Number, String]
  },
  components: {
    FormAbbr
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
      this.$store.dispatch('getAbbrById', id).then(({ data }) => {
        this.item = data
      })
    }
  }
}
</script>

<style></style>
