<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-form ref="form">
        <v-container fluid>
          <v-row>
            <v-col :cols="4">
              <v-autocomplete
                v-model="formModel.property_id"
                outlined
                :readonly="propertyId !== null"
                label="Name"
                :items="getProperties"
                :loading="isLoading"
                :search-input.sync="searchName"
                placeholder="Property Name"
                item-text="text"
                item-value="id"
                @change="handlePropertyChange"
              >
              </v-autocomplete>
            </v-col>
            <v-col :cols="8">
              <v-combobox
                v-model="formModel.options"
                label="Value"
                outlined
                :items="values"
                :loading="isLoading"
                :search-input.sync="searchValue"
                placeholder="Property Value"
                item-text="value"
                item-value="value"
                :return-object="false"
                small-chips
                deletable-chips
                multiple
                clearable
              >
                <template #no-data>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        No results matching "<strong>{{ searchValue }}</strong
                        >". Press <kbd>enter</kbd> to create a new one
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-combobox>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer></v-spacer>
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit()">
        save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FormCategoryProperty',
  components: {},
  props: {
    categoryId: [Number, String],
    propertyId: {
      type: [Number, String],
      default: null,
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      isLoading: false,
      searchName: null,
      searchValue: null,
      values: [],
      formModel: {
        category_id: this.categoryId,
        property_id: this.propertyId,
        options: this.options,
      },
    }
  },
  computed: {
    ...mapGetters(['getProperties']),
  },
  watch: {
    searchName(val) {
      // Items have already been loaded
      if (!val || this.getProperties.length > 0) return
      // Items have already been requested
      if (this.isLoading) return
      this.$store.dispatch('fetchProperty', {
        pageSize: -1,
      })
    },
    propertyId: {
      handler(id) {
        this.formModel.property_id = id
        this.formModel.options = this.options
        this.handlePropertyChange(id)
      },
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.loading = true
      this.$store
        .dispatch('createCategoryProperty', this.formModel)
        .then(() => {
          this.loading = false
          this.$emit('attach:success')
        })
        .catch(() => {
          this.$emit('attach:failed')
          this.loading = false
        })
    },
    handlePropertyChange(id) {
      console.log(id)
      this.$store
        .dispatch('fetchPropertyValue', {
          'filter[property_id]': id,
        })
        .then((resp) => {
          this.values = resp.data
          this.$emit('change', this.formModel)
        })
    },
  },
}
</script>

<style></style>
