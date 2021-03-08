<template>
  <v-navigation-drawer
    v-model="showDrawer"
    app
    class="app--drawer"
    :width="drawerWidth"
  >
    <v-toolbar color="primary darken-1" class="app-drawer__toolbar" dark flat>
      <img
        :src="computeLogo"
        :width="drawerWidth === 64 ? 64 : 256"
        alt="Kame"
      />
    </v-toolbar>
    <v-list class="pa-0">
      <template v-for="(item, key) in computeMenu">
        <template v-if="item.children && item.children.length > 0">
          <v-list-group
            :key="key"
            :prepend-icon="item.meta.icon"
            :to="item.path"
            :value="computeGroupExpanded(item, $route)"
            no-action
          >
            <template #activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.meta.title" />
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="subItem in item.children"
              v-show="!subItem.meta.hiddenInMenu"
              :key="subItem.name"
              :class="drawerWidth === 64 ? 'pl-4' : ''"
              :to="subItem.path"
            >
              <template v-if="drawerWidth === 64">
                <v-list-item-icon>
                  <v-icon v-text="subItem.meta.icon"></v-icon>
                </v-list-item-icon>
              </template>
              <template v-else>
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.meta.title" />
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-group>
        </template>
        <template v-else>
          <v-list-item
            v-show="!item.meta.hiddenInMenu"
            :key="key"
            :to="item.path"
          >
            <v-list-item-icon>
              <v-icon v-text="item.meta.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.meta.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </template>
    </v-list>
    <template #append>
      <template v-if="drawerWidth === 64">
        <div class="d-flex">
          <v-btn
            width="64"
            icon
            tile
            class="mx-auto"
            @click="handleDrawerToggle"
          >
            <v-icon>mdi-arrow-collapse-right</v-icon>
          </v-btn>
        </div>
      </template>
      <template v-else>
        <div class="d-flex">
          <v-spacer></v-spacer>
          <v-btn icon tile class="mr-2" @click="handleDrawerToggle">
            <v-icon>mdi-arrow-collapse-left</v-icon>
          </v-btn>
        </div>
      </template>
    </template>
  </v-navigation-drawer>
</template>
<script>
import { protectedRoute as routes } from '@/router/config'
export default {
  name: 'AppDrawer',
  components: {},
  props: {
    expanded: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      mini: false,
      showDrawer: true,
      drawerWidth: 256,
      scrollSettings: {
        maxScrollbarLength: 160,
      },
    }
  },

  computed: {
    computeMenu() {
      return routes[0].children
    },

    computeGroupActive() {
      return true
    },
    computeLogo() {
      return this.drawerWidth === 256 ? '/img/logo_text.png' : '/img/logo.png'
    },
  },
  created() {},

  methods: {
    handleDrawerToggle() {
      if (this.drawerWidth === 64) {
        this.drawerWidth = 256
      } else {
        this.drawerWidth = 64
      }
    },
    computeGroupExpanded(item, $route) {
      return $route.matched.map((item) => item.path).includes(item.path)
    },
  },
}
</script>

<style lang="sass" scoped>
.app--drawer
  overflow: hidden !important

  .drawer-menu--scroll
    height: calc(100vh - 48px)
    overflow: auto
</style>
