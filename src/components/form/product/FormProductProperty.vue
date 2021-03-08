<template>
  <div>
    <v-card :loading="loading">
      <v-card-text>
        <v-form v-if="!loading">
          <v-toolbar flat>
            <v-spacer />
            <v-btn icon @click="fecthPropertyValues(item)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn text @click="handleCreateItem">create</v-btn>
          </v-toolbar>
          <v-divider />
          <v-data-table
            :headers="headers"
            :items="property_values"
            :items-per-page="20"
          >
            <template #[`item.property.inherited`]="{ item }">
              <v-switch v-model="item.property.inherited"> </v-switch>
            </template>
            <template #[`item.action`]="{ item }">
              <v-menu>
                <template #activator="{ on: menu }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-btn icon v-on="onTooltip({ ...tooltip, ...menu })">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <span>Action</span>
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
        </v-form>
      </v-card-text>
      <v-card-actions class="py-3">
        <v-spacer></v-spacer>
        <!-- <v-btn @click="handleSubmit()" :loading="loading" tile color="primary">
          save
        </v-btn> -->
      </v-card-actions>
    </v-card>
    <v-dialog v-if="!loading" v-model="showDialog">
      <v-card>
        <v-card-title dark tile color="primary"
          >Add direct property
          <v-spacer />
          <v-icon @click="showDialog = false">mdi-close</v-icon>
        </v-card-title>
        <v-card-text v-if="item" class="pa-0">
          <form-direct-property
            :product-id="item.id"
            @attach="handleAttached"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TooltipMixin from '@/mixins/Tooltip'
export default {
  name: 'FormProductProperty',
  mixins: [TooltipMixin],
  props: {
    item: Object,
  },
  data() {
    return {
      // table
      loading: false,
      property_values: [],
      headers: [
        {
          text: 'Id',
          value: 'id',
        },
        {
          text: 'Key',
          value: 'property_name',
        },
        {
          text: 'Value',
          value: 'value',
        },
        {
          text: 'Inherited From Category',
          value: 'property.inherited',
        },
        {
          text: 'Type',
          value: 'property.type',
        },
        {
          text: 'Action',
          value: 'action',
        },
      ],
      actions: [
        {
          text: 'Edit Item',
          icon: 'mdi-pencil',
          click: this.handleEditItem,
        },
        {
          text: 'Delete Item',
          icon: 'mdi-close',
          click: this.handleDeleteItem,
        },
      ],
      //
      isLoading: false,
      showDialog: false,
      items: [],
    }
  },
  computed: {
    ...mapGetters(['getSpuProperties', 'getPropUnits', 'getPropTypes']),
    inheritedProps() {
      const { property_values } = this.item
      return property_values && property_values.length > 0
        ? property_values.filter((item) => {
            return item.property.inherited === true
          })
        : []
    },
    directProps() {
      const { property_values } = this.item
      return property_values && property_values.length > 0
        ? property_values.filter((item) => {
            return item.property.inherited === false
          })
        : []
    },
  },
  watch: {
    item: {
      handler(item) {
        if (item) {
          if (item && item.categories.length > 0) {
            this.fecthPropertyValues(item)
          }
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    fecthPropertyValues(item) {
      this.loading = true
      this.$store
        .dispatch('getPropertyValuesByProductId', item.id)
        .then(({ data }) => {
          this.property_values = data
          this.loading = false
          this.$store.commit('APPEND_BREADCRUMB', {
            text: this.item.name,
            exact: true,
            disabled: false,
          })
        })
    },
    handleCreateItem() {
      this.showDialog = true
    },
    handleEditItem() {},
    handleDeleteItem(item) {
      if (window.confirm('Are you sure to delet this')) {
        const data = {
          id: this.item.id,
          property_value_id: item.id,
        }
        this.$store.dispatch('detachPropsForProduct', data).then(() => {
          this.fetchPropertyValues(this.item)
        })
      }
    },

    handleAttached() {
      this.fecthPropertyValues(this.item)
    },
  },
}
</script>

<style></style>
