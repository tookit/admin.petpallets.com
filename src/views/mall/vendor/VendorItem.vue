<template>
  <div class="page-mall-vendor view">
    <v-container fluid>
      <v-row>
        <v-col>
          <v-tabs v-model="defaultTab" class="route-tab">
            <v-tab
              v-for="(tab, key) in tabs"
              v-show="showTab(tab)"
              :key="key"
              :href="'#' + tab.value"
            >
              {{ item.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="defaultTab">
            <v-tab-item key="general" value="general">
              <form-vendor :item="item" />
            </v-tab-item>
            <v-tab-item key="link" value="link">
              <form-link-map :item="item" />
            </v-tab-item>
            <v-tab-item key="item" value="item">
              <form-item-map :item="item" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormVendor from '@/components/form/vendor/FormVendor'
import FormLinkMap from '@/components/form/vendor/FormLinkMap'
import FormItemMap from '@/components/form/vendor/FormItemMap'
export default {
  components: {
    FormVendor,
    FormLinkMap,
    FormItemMap,
  },
  props: {
    id: [Number, String],
  },
  data() {
    return {
      defaultTab: 'general',
      tabs: [
        {
          text: 'General',
          value: 'general',
        },
        {
          text: 'Link',
          value: 'link',
        },
        {
          text: 'Item',
          value: 'item',
        },
      ],
      loading: false,
      item: null,
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
      immediate: true,
    },
  },
  methods: {
    fetchRecord(id) {
      this.loading = true
      this.$store
        .dispatch('getVendorById', id)
        .then(({ data }) => {
          this.item = data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showTab({ value }) {
      if (this.id) {
        return true
      } else {
        return value === 'general'
      }
    },
    handleSelectMedia() {},
  },
}
</script>
