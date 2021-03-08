<template>
  <v-container class="page-media" fluid>
    <v-row>
      <v-col cols="12">
        <media-table />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MediaTable from '../components/table/MediaTable.vue'
export default {
  name: 'PageMedia',
  components: {
    MediaTable
  }
}
</script>

<style></style>
