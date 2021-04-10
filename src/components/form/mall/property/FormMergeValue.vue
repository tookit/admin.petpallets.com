<template>
  <v-card :loading="loading">
    <v-toolbar dark color="primary">
      <v-toolbar-title>{{ formTitle }}</v-toolbar-title>
    </v-toolbar>
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
              />
            </v-col>
            <v-col :cols="8">
              <v-autocomplete
                v-model="formModel.value"
                label="Value"
                outlined
                :items="values"
                :loading="isLoading"
                :search-input.sync="searchValue"
                placeholder="Property Value"
                :append-outer-icon="formModel.property_id ? 'mdi-refresh' : ''"
                item-text="value"
                item-value="id"
                @click:append-outer="handleNameChange(formModel.property_id)"
              />
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
  props: {
    source: Object,
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
        value: null,
      },
    }
  },
  computed: {
    ...mapGetters(['getProperties']),
    formTitle() {
      return (
        'Merge Property - ' +
        this.source.property_name +
        '---' +
        this.source.value
      )
    },
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
      this.$store
        .dispatch('mergePropertyValue', {
          sourceId: this.source.id,
          targetId: this.formModel.value,
        })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loadingloading = false
        })
    },
    handleNameChange(property_id) {
      this.isLoading = true
      this.$store.dispatch('fetchValueById', property_id).then((resp) => {
        this.values = resp.data
        this.isLoading = false
      })
    },
  },
}
</script>
