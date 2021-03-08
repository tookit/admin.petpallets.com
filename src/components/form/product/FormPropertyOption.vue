<template>
  <v-card :loading="loading">
    <v-card-text>
      <v-form>
        <v-container fluid>
          <v-row>
            <v-col :cols="12">
              <v-combobox
                v-model="selectedItem.options"
                label="Value"
                class="mt-3"
                outlined
                :items="[]"
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
export default {
  name: 'FormPropertyOption',
  components: {},
  props: {
    categoryId: [Number, String],
    propertyId: [Number, String],
  },
  data() {
    return {
      loading: false,
      loadingTags: false,
      search: null,
      tags: [],
      formModel: {
        options: null,
      },
    }
  },
  computed: {
    formTitle() {
      return 'Property Value'
    },
  },
  watch: {
    propertyId: {
      handler(item) {},
      immediate: true,
    },
  },
  methods: {
    handleSubmit() {
      this.loading = true
      const data = { id: this.propertyId, data: this.formModel }
      this.$store
        .dispatch('attachValueForProperty', data)
        .then(() => {
          this.loading = false
          this.$emit('form:success')
        })
        .catch(() => {
          this.loading = false
          this.$emit('form:error')
        })
    },
  },
}
</script>

<style></style>
