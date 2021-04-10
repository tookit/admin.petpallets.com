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
                label="Name"
                :items="getProperties"
                :loading="isLoading"
                :search-input.sync="searchName"
                placeholder="Property Name"
                item-text="text"
                item-value="id"
                @change="handleNameChange"
              >
              </v-autocomplete>
            </v-col>
            <v-col :cols="8">
              <v-autocomplete
                v-model="formModel.values"
                label="Value"
                outlined
                :items="values"
                :loading="isLoading"
                :search-input.sync="searchValue"
                placeholder="Property Value"
                multiple
                item-text="value"
                item-value="id"
                :append-outer-icon="formModel.property_id ? 'mdi-refresh' : ''"
                @click:append-outer="handleNameChange(formModel.property_id)"
              >
              </v-autocomplete>
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
  components: {},
  props: {
    id: [Number, String],
    entity: {
      type: String,
      default: 'item',
    },
  },
  data() {
    return {
      loading: false,
      isLoading: false,
      searchName: null,
      searchValue: null,
      items: [],
      values: [],
      formModel: {
        property_id: null,
        values: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getProperties']),
  },
  watch: {
    searchName(val) {
      if (val || this.items.length > 0) return
      if (this.isLoading) return
      this.$store.dispatch('fetchProperty', {
        pageSize: -1,
      })
    },
  },
  methods: {
    handleSubmit() {
      this.loading = true
      const data = {
        id: this.id,
        data: {
          values: this.formModel.values,
          withoutDetach: true,
        },
      }
      const action =
        this.entity === 'category'
          ? 'attachPropertyForCategory'
          : 'attachPropertyForProduct'
      this.$store
        .dispatch(action, data)
        .then(() => {
          this.loading = false
          this.$emit('attach')
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleNameChange(id) {
      this.isLoading = true
      this.$store
        .dispatch('fetchPropertyValue', {
          'filter[property_id]': id,
        })
        .then((resp) => {
          this.values = resp.data
          this.isLoading = false
        })
    },
  },
}
</script>
