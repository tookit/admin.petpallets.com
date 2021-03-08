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
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormVendor from '@/components/form/vendor/FormVendor'
export default {
  components: {
    FormVendor,
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
      ],
      loading: false,
      item: null,
      images: [],
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
