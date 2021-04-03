<template>
  <div class="property-value-table">
    <v-toolbar flat>
      <v-text-field
        text
        solo
        flat
        append-icon="mdi-magnify"
        :placeholder="__('search')"
        hide-details
        clearable
      />
      <v-btn icon @click="handleCreateItem">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn icon @click="fetchRecords(property.id)">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-data-table
      :loading="loadingItems"
      :headers="headers"
      :items="items"
      item-key="id"
      disable-pagination
      show-select
      hide-default-footer
    >
      <template #[`item.action`]="{ item }">
        <v-menu>
          <template #activator="{ on: menu }">
            <v-tooltip bottom>
              <template #activator="{ on: tooltip }">
                <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <span>{{ __('$vuetify.action') }}</span>
            </v-tooltip>
          </template>
          <v-list class="pa-0" dense>
            <v-list-item
              v-for="action in actions"
              :key="action.text"
              @click="action.click(item)"
            >
              <v-list-item-icon class="mr-2">
                <v-icon small>{{ action.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ action.text }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>
    <v-dialog v-model="showFormDialog" scrollable width="800">
      <form-property-value :item="selectedItem" :property-id="property.id" />
    </v-dialog>
    <v-dialog v-model="showMergeDialog" scrollable width="800">
      <form-merge-value :source="selectedItem" />
    </v-dialog>
  </div>
</template>

<script>
import ResizeMixin from '@/mixins/Resize'
import TooltipMixin from '@/mixins/Tooltip'
import FormPropertyValue from '@/components/form/mall/property/FormPropertyValue'
import FormMergeValue from '@/components/form/mall/property/FormMergeValue'
export default {
  name: 'PropertyValueTable',
  components: { FormPropertyValue, FormMergeValue },
  mixins: [ResizeMixin, TooltipMixin],
  props: {
    property: Object,
  },
  data() {
    return {
      // table
      merging: false,
      targetId: null,
      showMergeDialog: false,
      showFormDialog: false,
      selectedItem: null,
      loadingItems: false,
      serverItemsLength: 0,
      headers: [
        {
          text: this.__('id'),
          value: 'id',
        },
        {
          text: this.__('name'),
          value: 'property_name',
        },
        {
          text: this.__('value'),
          value: 'value',
          sortable: true,
          width: 250,
        },
        {
          text: 'Products',
          value: 'products_count',
          sortable: true,
          width: 50,
        },
        {
          text: this.__('action'),
          value: 'action',
          width: 50,
        },
      ],
      items: [],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Merge Value',
          icon: 'mdi-pencil',
          click: this.handleShowMerge,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
    }
  },
  watch: {
    property: {
      handler(property) {
        if (property) this.fetchRecords(property.id)
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    fetchRecords(property_id) {
      this.loadingItems = true
      this.items = []
      return this.$store
        .dispatch('fetchValueById', property_id)
        .then(({ data }) => {
          this.items = data
          this.loadingItems = false
        })
        .catch(() => {
          this.loadingItems = false
        })
    },
    //action
    handleCreateItem() {
      this.selectedItem = null
      this.showFormDialog = true
    },
    handleEditItem(item) {
      this.selectedItem = item
      this.showFormDialog = true
    },
    handleShowMerge(item) {
      this.selectedItem = item
      this.showMergeDialog = true
    },
    handleDeleteItem({ id }) {
      if (window.confirm('Are you sure to delete this item ?')) {
        this.$store.dispatch('deletePropertyValue', id).then(() => {
          this.items = this.items.filter((item) => item.id !== id)
        })
      }
    },
  },
}
</script>
