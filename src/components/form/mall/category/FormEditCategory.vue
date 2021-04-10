<template>
  <v-sheet>
    <v-tabs v-model="defaultTab" class="border-bottom">
      <v-tab v-for="tab in tabs" :key="tab.value" :href="'#' + tab.value">
        {{ tab.text }}
      </v-tab>
      <v-spacer />
    </v-tabs>
    <v-tabs-items v-model="defaultTab">
      <template v-for="tab in tabs">
        <v-tab-item :key="tab.value" :value="tab.value">
          <component :is="tab.element" v-bind="tab.bind" />
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-sheet>
</template>

<script>
import FormMallCategory from './FormMallCategory'
import FormCategoryProperty from './FormCategoryProperty'
import MediaTable from '@/components/table/MediaTable'
export default {
  props: {
    id: [Number, String],
    name: String,
  },
  data() {
    return {
      defaultTab: 'general',
    }
  },
  computed: {
    tabs() {
      return [
        {
          text: 'General',
          value: 'general',
          element: FormMallCategory,
          bind: {
            id: this.id,
            showHeader: true,
          },
        },
        {
          text: 'Property',
          value: 'property',
          element: FormCategoryProperty,
          bind: {
            id: this.id,
            name: this.name,
            showHeader: true,
          },
        },
        {
          text: 'Image',
          value: 'image',
          element: MediaTable,
          bind: {
            entityId: this.id,
            entity: 'App\\Models\\Mall\\Category',
            directory: `category/${this.id}`,
            showSelect: true,
          },
        },
      ]
    },
  },
}
</script>
