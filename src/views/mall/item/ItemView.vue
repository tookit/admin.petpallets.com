<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <form-edit-item :id="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormEditItem from '@/components/form/mall/item/FormEditItem'
export default {
  components: {
    FormEditItem,
  },
  props: {
    id: [Number, String],
  },
}
</script>

<style></style>
