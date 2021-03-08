<template>
  <v-app-bar dark color="primary" flat app>
    <v-app-bar-nav-icon @click="$emit('drawer:toggle')"></v-app-bar-nav-icon>
    <v-spacer></v-spacer>
    <v-toolbar-items class="align-center">
      <v-btn icon href="https://theopticalfiber.com" target="_blank">
        <v-icon>mdi-target</v-icon>
      </v-btn>
      <v-menu offset-y origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon text slot="activator" v-on="on">
            <v-avatar size="24">
              <v-img :src="locale.svg" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            v-for="item in getLocales"
            @click="handleChangeLocale(item)"
            :key="item.value"
          >
            <v-list-item-avatar size="30" tile>
              <v-img :height="18" :src="item.svg"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu offset-y origin="center center" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon text slot="activator" v-on="on">
            <v-avatar>
              <v-icon dark>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in profileMenus"
            :to="!item.href ? { name: item.name } : null"
            @click="item.click ? item.click() : null"
            :key="index"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>
<script>
import Utils from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'AppToolbar',
  components: {},
  data() {
    return {
      showHelpDialog: false,
      showProjectDiaog: false,
      profileMenus: [
        {
          icon: 'mdi-account-circle',
          href: '#',
          title: 'Profile',
          click: this.handleProfile
        },
        {
          icon: 'mdi-cog',
          href: '#',
          title: 'Settings',
          click: this.handleSetting
        },
        {
          icon: 'mdi-logout',
          href: '#',
          title: 'Logout',
          click: this.handleLogout
        }
      ],
      selectedCategories: [],
      selectedProject: null
    }
  },
  computed: {
    ...mapGetters(['getLocales', 'getLocale']),
    toolbarColor() {
      return this.$vuetify.options.extra.mainNav
    },
    locale() {
      return this.getLocales.find((item) => item.value === this.getLocale)
    }
  },
  methods: {
    handleViewJob() {
      this.$router.push({
        name: 'Pipelines',
        query: {
          tab: 'history',
          crontab_id: this.getRunNowJob._source.job_id
        }
      })
    },
    handleFullScreen() {
      Utils.toggleFullScreen()
    },
    handleLogout() {
      if (window.confirm('Are you sure to logout?')) {
        this.$store.dispatch('logout')
        window._VMA.$emit('SHOW_SNACKBAR', {
          show: true,
          text: 'Logout successfull',
          color: 'success'
        })
        this.$router.push('/auth/login')
      }
    },
    handleSetting() {
      window._VMA.openThemeSettings()
    },
    handleProfile() {},
    handleChangeLocale(locale) {
      this.$store.dispatch('changeLocale', locale.value)
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped></style>
