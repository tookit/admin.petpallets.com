<template>
  <div class="app dashboard">
    <app-drawer ref="drawer" class="app--drawer" />
    <app-toolbar class="app--toolbar" @drawer:toggle="handleToggleDrawer" />
    <v-main>
      <div class="white">
        <v-breadcrumbs :items="getBreadcrumbs" />
      </div>
      <router-view class="route-wrapper" />
      <!-- App Footer -->
      <v-footer class="pa-3 app--footer">
        <span>Netpune UI &copy; {{ new Date().getFullYear() }}</span>
        <v-spacer />
        <span class="caption mr-1">Remember All The Things &trade;</span>
      </v-footer>
    </v-main>
    <!-- Go to top -->
    <app-fab />
  </div>
</template>

<script>
import AppDrawer from '@/components/AppDrawer'
import AppToolbar from '@/components/AppToolbar'
import AppFab from '@/components/AppFab'
import { mapGetters } from 'vuex'

export default {
  components: {
    AppDrawer,
    AppToolbar,
    AppFab,
  },

  data() {
    return {}
  },
  computed: {
    ...mapGetters(['getBreadcrumbs']),
  },
  created() {
    this.$store.dispatch('fetchProductCategoryTree')
    this.$store.dispatch('fetchNewsCategory', { pageSize: -1 })
    this.$store.dispatch('fetchCountries')
    this.$store.dispatch('fetchVendors', { pageSize: -1 })
    this.$store.dispatch('fetchTags', { pageSize: -1 })
    this.$store.dispatch('fetchProperty', { pageSize: -1 })
    this.$store.dispatch('fetchMediaExt')
    this.$store.dispatch('fetchMediaDir')
  },
  methods: {
    handleToggleDrawer() {
      const drawer = this.$refs.drawer
      drawer.showDrawer = !drawer.showDrawer
    },
  },
}
</script>

<style lang="scss" scoped>
.route-wrapper {
  min-height: calc(100vh - 64px);
}
</style>
