<template>
  <v-card>
    <v-toolbar v-show="inDialog" dark tile color="primary">
      <v-toolbar-title> {{ title }} - {{ product.name }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon>
        <v-icon @click="fetchRecords(product.id)">mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="handleAddProperty()">mdi-plus</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="$emit('close:dialog')">mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text :style="{ height: height }">
      <v-data-table
        v-model="selectedItems"
        :items="items"
        :loading="loading"
        :headers="headers"
        show-select
        item-key="name"
        hide-default-footer
        disable-pagination
        dense
      >
        <template #[`item.property_name`]="{ item }">
          <v-combobox
            :key="item.property_name"
            v-model="item.property_name"
            label="Name"
            :items="getProperties"
            placeholder="Property Name"
            item-text="text"
            item-value="text"
            dense
            hide-details
            :return-object="false"
          >
            <template #no-data>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    No results matching "<strong>{{ searchName }}</strong
                    >". Press <kbd>enter</kbd> to create a new one
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-combobox>
        </template>
        <template #[`item.property_value`]="{ item }">
          <v-text-field v-model="item.property_value" dense hide-details />
        </template>
        <template #[`item.unit`]="{ item }">
          <v-text-field v-model="item.unit" dense hide-details></v-text-field>
        </template>
        <template #[`item.seperator`]="{ item }">
          <v-combobox v-model="item.seperator" :items="seperators" />
        </template>
      </v-data-table>
    </v-card-text>
    <v-divider />
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit">
        save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormSpecImport',
  props: {
    product: Object,
    inDialog: Boolean,
    height: {
      type: String,
      default: '500px',
    },
    title: {
      type: String,
      default: 'Import Spec',
    },
  },
  data() {
    return {
      loading: false,
      searchName: null,
      seperators: ['/', '-', ',', 'to'],
      headers: [
        {
          text: 'Raw Name',
          value: 'name',
        },
        {
          text: 'Raw value',
          value: 'value',
        },
        {
          text: 'Import Name',
          value: 'property_name',
        },
        {
          text: 'Import Value',
          value: 'property_value',
        },
        {
          text: 'Unit',
          value: 'unit',
          width: 50,
        },
        {
          text: 'Seperator',
          value: 'seperator',
          width: 50,
        },
      ],
      items: [],
      selectedItems: [],
    }
  },
  computed: {
    ...mapGetters(['getProperties', 'getPropertyName']),
  },
  watch: {
    product: {
      handler(product) {
        if (product) this.fetchRecords(product.id)
      },
      immediate: true,
    },
  },
  created() {
    this.$store.dispatch('fetchProductCategoryTree')
  },
  methods: {
    handleAddProperty() {},
    fetchRecords(id) {
      this.loading = true
      this.items = []
      this.$store
        .dispatch('fetchRawSpec', id)
        .then(({ data }) => {
          this.items = data.map((item) => {
            return {
              ...item,
              unit: null,
              seperator: null,
              property_value: item.value,
              property_name: this.getPropertyName(item.name) || item.name,
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSubmit() {
      this.loading = true
      const selected = this.selectedItems.map((item) => item.name)
      const options = this.items.filter((item) => selected.includes(item.name))
      const data = {
        id: this.product.id,
        data: {
          options: options,
        },
      }
      this.$store
        .dispatch('importRawSpec', data)
        .then(() => {
          this.loading = false
          this.$emit('form:success')
        })
        .catch(() => {
          this.loading = false
          this.$emit('form:failed')
        })
    },
  },
}
</script>
