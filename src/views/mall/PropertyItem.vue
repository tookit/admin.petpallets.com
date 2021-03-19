<template>
  <div class="page-property-item">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-tabs v-model="defaultTab" class="route-tab border-bottom">
            <v-tab
              v-for="(tab, key) in tabs"
              v-show="showTab(tab)"
              :key="key"
              :href="'#' + tab.value"
            >
              {{ tab.text }}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="defaultTab">
            <v-tab-item key="general" value="general">
              <form-property :item="item" />
            </v-tab-item>
            <v-tab-item key="value" value="value">
              <property-value-table :property-id="id" />
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FormProperty from '@/components/form/product/FormProperty'
import PropertyValueTable from '@/components/table/PropertyValueTable'
export default {
  components: {
    FormProperty,
    PropertyValueTable,
  },
  props: {
    id: [Number, String],
  },
  data() {
    return {
      loading: false,
      item: null,
      defaultTab: 'general',
      tabs: [
        {
          text: 'General',
          value: 'general',
        },
        {
          text: 'Value',
          value: 'value',
        },
      ],
    }
  },
  computed: {
    formTitle() {
      return this.item ? `Edit Category - ${this.item.name}` : 'Create Category'
    },
  },
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
      this.$store.dispatch('getPropertyById', id).then(({ data }) => {
        this.item = data
        this.loading = false
      })
    },
    fetchValueById(id) {
      return this.$store.dispatch('fetchValueById', id)
    },
    showTab({ value }) {
      if (this.id) {
        return true
      } else {
        return value === 'general'
      }
    },
  },
}
</script>

<style></style>
