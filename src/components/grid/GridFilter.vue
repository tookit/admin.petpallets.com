<template>
  <v-sheet class="grid-filter">
    <v-toolbar flat>
      <v-select label="Search By" :items="['name']"> </v-select>
      <v-text-field
        v-model="filter.name"
        text
        solo
        flat
        :prepend-icon="
          showFilter ? 'mdi-filter-variant-plus' : 'mdi-filter-variant'
        "
        append-icon="mdi-magnify"
        :placeholder="__('search')"
        hide-details
        clearable
        @keyup.enter="handleApplyFilter"
        @click:append="handleApplyFilter"
        @click:prepend="showFilter = !showFilter"
        @click:clear="handleClear"
      />
      <v-btn icon @click="handleRefreshItem">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
      <v-btn icon @click="handleCreateItem">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-sheet v-show="showFilter" flat class="grey lighten-4">
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="handleResetFilter">{{ __('reset') }}</v-btn>
        <v-btn tile color="primary" @click="handleApplyFilter">{{
          __('apply')
        }}</v-btn>
      </v-card-actions>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  props: {
    searchField: {
      type: String,
      default: null,
    },
  },
}
</script>

<style></style>
