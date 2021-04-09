<template>
  <v-container>
    <v-row>
      <v-col :cols="12">
        <form-edit-category :id="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FormEditCategory from '@/components/form/mall/category/FormEditCategory'
export default {
  components: {
    FormEditCategory,
  },
  props: {
    id: [Number, String],
  },
}
</script>

<style></style>
