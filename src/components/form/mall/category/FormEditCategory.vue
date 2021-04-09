<template>
  <v-card>
    <v-tabs
      v-model="defaultTab"
      background-color="primary"
      class="border-bottom"
      dark
    >
      <v-tab v-for="tab in tabs" :key="tab.value" :href="'#' + tab.value">
        {{ tab.text }}
      </v-tab>
      <v-spacer />
    </v-tabs>
    <v-card-text>
      <v-tabs-items v-model="defaultTab">
        <template v-for="tab in tabs">
          <v-tab-item :key="tab.value" :value="tab.value">
            <component :is="tab.element" v-bind="tab.bind" />
          </v-tab-item>
        </template>
      </v-tabs-items>
    </v-card-text>
  </v-card>
</template>

<script>
import FormMallCategory from '@/components/form/mall/category/FormMallCategory'
import FormSeo from '@/components/form/seo/FormSeo'
export default {
  props: {
    item: Object,
  },
  data() {
    return {
      defaultTab: 'general',
      tabs: [
        {
          text: 'General',
          value: 'general',
          element: FormMallCategory,
          bind: {
            item: this.item,
          },
        },
        {
          text: 'Property',
          value: 'property',
        },
        {
          text: 'SEO',
          value: 'seo',
          element: FormSeo,
          bind: {
            item: this.item,
          },
        },
      ],
    }
  },
}
</script>
