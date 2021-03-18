<template>
  <v-dialog v-model="visible" :width="width" scrollable>
    <component :is="component" v-bind="data" ref="comp" />
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
