<template>
  <v-dialog v-model="visible" :width="width" scrollable>
    <v-card>
      <v-toolbar flat dark color="primary">
        <v-toolbar-title> {{ title }} </v-toolbar-title>
        <v-spacer />
        <v-icon @click="visible = false">mdi-close</v-icon>
      </v-toolbar>
      <v-card-text v-if="component" style="max-height: 500px">
        <div>
          <component :is="component" v-bind="data" ref="comp" />
        </div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="py-3">
        <v-spacer />
        <v-btn :loading="submiting" tile color="primary" @click="handleSubmit">
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'CDialog',
  props: {
    width: {
      type: String,
      default: '960px',
    },
  },
  data() {
    return {
      submiting: false,
      visible: false,
      title: null,
      data: null,
      on: {},
      component: null,
    }
  },
  methods: {
    show({ title, component, data }) {
      this.component = component
      this.title = title
      this.data = data
      this.visible = true
    },
    hide() {
      ;(this.title = null), (this.component = null)
    },
    handleSubmit() {
      this.$refs.comp
        .handleSubmit()
        .then(() => {
          this.submiting = false
        })
        .catch(() => (this.submiting = false))
    },
  },
}
</script>
