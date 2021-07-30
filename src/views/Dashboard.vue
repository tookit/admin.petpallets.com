<template>
  <div class="page-dashboard">
    <v-container>
      <v-row>
        <v-col :cols="3">
          <v-card tile :loading="loading" to="/mall/quote/list">
            <v-card-text class="pa-0">
              <v-row no-gutters>
                <v-col class="pa-3">
                  <div class="layout justify-center align-center">
                    <v-icon size="56px" color="primary">mdi-receipt</v-icon>
                  </div>
                </v-col>
                <v-col class="pa-3 primary">
                  <div class="white--text">Order</div>
                  <span class="white--text">{{ state.order.total }}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="3">
          <v-card
            tile
            :loading="loading"
            to="/mall/product/list?filter[flag]=7"
          >
            <v-card-text class="pa-0">
              <v-row no-gutters>
                <v-col class="pa-3">
                  <div class="layout justify-center align-center">
                    <v-icon size="56px" color="primary"
                      >mdi-format-list-checks</v-icon
                    >
                  </div>
                </v-col>
                <v-col class="pa-3 primary">
                  <div class="white--text">Uncategorized products</div>
                  <span class="white--text">{{
                    state.product.uncategorized.total
                  }}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="3">
          <v-card
            tile
            :loading="loading"
            to="/mall/product/list?filter[is_active]=1"
          >
            <v-card-text class="pa-0">
              <v-row no-gutters>
                <v-col class="pa-3">
                  <div class="layout justify-center align-center">
                    <v-icon size="56px" color="primary">mdi-database</v-icon>
                  </div>
                </v-col>
                <v-col class="pa-3 green">
                  <div class="white--text">Active products</div>
                  <span class="white--text">{{
                    state.product.online.total
                  }}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col :cols="3">
          <v-card
            tile
            :loading="loading"
            to="/mall/product/list?filter[is_active]=0"
          >
            <v-card-text class="pa-0">
              <v-row no-gutters>
                <v-col class="pa-3">
                  <div class="layout justify-center align-center">
                    <v-icon size="56px" color="primary">mdi-archive</v-icon>
                  </div>
                </v-col>
                <v-col class="pa-3 grey">
                  <div class="white--text">Archived products</div>
                  <span class="white--text">{{
                    state.product.offline.total
                  }}</span>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      state: {
        order: {
          total: 0,
        },
        product: {
          uncategorized: {
            total: 0,
          },
          online: 0,
          offline: 0,
        },
      },
    }
  },
  created() {},
  methods: {
    fetchRecord() {
      this.loading = true
      this.$store.dispatch('fetchState').then(({ data }) => {
        this.state = data
        this.loading = false
      })
    },
  },
}
</script>

<style></style>
