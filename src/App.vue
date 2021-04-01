<template>
  <v-app>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>

    <!-- theme setting -->
    <!-- <v-btn small fab dark fixed top="top" right="right" class="setting-fab" color="primary" @click="openThemeSettings">
      <v-icon>mdi-cog</v-icon>
    </v-btn>-->
    <!-- setting drawer -->
    <v-navigation-drawer
      v-model="rightDrawer"
      width="450"
      class="setting-drawer"
      temporary
      right
      hide-overlay
      fixed
    >
      <theme-settings></theme-settings>
    </v-navigation-drawer>
    <!-- global snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      app
      top
      centered
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <template #action="{ attrs }">
        <v-btn icon v-bind="attrs" @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <dialog-loader ref="dialog" />
  </v-app>
</template>

<script>
import ThemeSettings from '@/components/ThemeSettings'
import DialogLoader from '@/components/dialog/DialogLoader'
export default {
  components: {
    ThemeSettings,
    DialogLoader,
  },
  data() {
    return {
      rightDrawer: false,
      snackbar: {
        show: false,
        text: '',
        color: '',
      },
    }
  },
  mounted() {
    if (typeof window !== undefined && window._VMA === undefined) {
      window._VMA = this
    }
    this.$root.$dialog = this.$refs.dialog
  },
  created() {
    // add app events
    this.$on('AUTH_FAILED', (e) => {
      this.snackbar = {
        show: true,
        text: e.message,
      }
      this.$router.push({
        path: '/auth/login',
        query: { redirect: this.$route.path },
      })
    })
    this.$on('API_FAILED', (e) => {
      this.snackbar = {
        show: true,
        text: e.reason,
      }
    })
    this.$on('SHOW_SNACKBAR', (e) => {
      this.snackbar = {
        show: true,
        text: e.text,
        color: e.color,
      }
    })

    // this.initWebsocket()
  },
  methods: {
    openThemeSettings() {
      this.$vuetify.goTo(0)
      this.rightDrawer = !this.rightDrawer
    },
  },
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  min-height: calc(50% - 500px);
}
</style>
