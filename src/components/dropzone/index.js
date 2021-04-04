import Dropzone from 'dropzone'
Dropzone.autoDiscover = false
export default {
  name: 'v-dropzone',
  props: {
    option: Object,
  },
  data() {
    return {
      dropzone: null,
    }
  },

  watch: {
    option: {
      handler(val) {
        this.updateOption(val)
      },
      immediate: true,
    },
  },
  mounted() {
    this.dropzone = new Dropzone(
      this.$refs.dropzone,
      Object.assign(this.option, { addRemoveLinks: true })
    )

    this.dropzone.on('success', (e) => {
      this.$emit('success', e)
    })
  },
  beforeDestroy() {},
  methods: {
    updateOption(val) {
      this.$nextTick(() => {
        this.dropzone.options.url = val.url
      })
    },
  },
  render(h) {
    const data = {
      staticClass: 'dropzone',
      class: this.classes,
      ref: 'dropzone',
      attrs: { tabindex: this.disabled ? -1 : 0 },
      on: this.$listeners,
    }
    return h('div', data, [this.$slots.default])
  },
}
