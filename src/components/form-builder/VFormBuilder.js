import {
  VContainer,
  VRow,
  VCol,
  VForm,
  VCard,
  VCardActions,
  VToolbar,
  VToolbarTitle,
  VBtn,
  VDivider,
  VSpacer,
} from 'vuetify/lib'
import { getSlot } from 'vuetify/lib/util/helpers'
export default {
  name: 'v-form-builder',
  props: {
    ...VCard.options.props,
    showHeader: Boolean,
    title: {
      type: String,
      default: 'Form',
    },
    saveText: {
      type: String,
      default: 'Save',
    },
    cancelText: {
      type: String,
      default: 'Cancel',
    },
    items: {
      type: Array,
    },
    value: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      formData: {},
    }
  },
  watch: {
    value: {
      handler(val) {
        this.formData = val || {}
      },
      immediate: true,
    },
  },
  methods: {
    reset() {
      console.log(this)
    },
    genFormItem(item) {
      const { name } = item.props
      const VNode = this.$createElement(item.element, {
        model: {
          value: this.formData[name],
          callback: (newValue) => {
            this.formData[name] = newValue
          },
        },
        props: {
          ...item.props,
          label: item.props.label ? item.props.label : name.toUpperCase(),
          placeholder: item.props.placeholder
            ? item.props.placeholder
            : name.toUpperCase(),
          // inputValue: this.formData[name],
          value: this.formData[name],
        },
        on: {
          ...item.on,
        },
      })

      return this.$createElement(
        VCol,
        {
          props: {
            cols: item.cols ? item.cols : 12,
          },
        },
        [VNode]
      )
    },
    genFormItems() {
      return this.items.map((item) => {
        return this.genFormItem(item)
      })
    },
    genFormWrapper() {
      return this.$createElement(
        VForm,
        { ref: 'form', class: 'v-card__text' },
        [
          this.$createElement(
            VContainer,
            {
              props: {
                fluid: true,
              },
              on: {
                submit: this.$emit('submit'),
              },
            },
            [this.$createElement(VRow, [this.genFormItems()])]
          ),
        ]
      )
    },
    genFormTitle() {
      return this.$createElement(
        VToolbar,
        {
          props: {
            color: this.color,
            tile: true,
            flat: true,
          },
        },
        [
          this.$createElement(
            VToolbarTitle,
            {
              props: {},
            },
            this.title
          ),
          this.$createElement(VSpacer),
          getSlot(this, 'toolbar'),
        ]
      )
    },
    genFormFooter() {
      return this.$createElement(
        VCardActions,
        {
          class: 'justify-end',
          props: {},
        },
        [
          this.$createElement(
            VBtn,
            {
              props: {
                text: true,
                tile: true,
              },
              on: {
                click: () => {
                  this.$refs.form.reset()
                  this.$emit('form:cancel')
                },
              },
            },
            this.cancelText
          ),
          this.$createElement(
            VBtn,
            {
              props: {
                color: this.color,
                loading: this.loading,
                tile: true,
              },
              on: {
                click: () => {
                  this.$emit('form:submit')
                },
              },
            },
            this.saveText
          ),
        ]
      )
    },
    genDivider() {
      return this.$createElement(VDivider)
    },
  },
  render(h) {
    const nodes = [
      this.genFormTitle(),
      this.genDivider(),
      this.genFormWrapper(),
      this.genDivider(),
      this.genFormFooter(),
    ]
    if (!this.showHeader) nodes.shift()
    return h(
      VCard,
      {
        props: {
          loading: this.loading,
          tile: this.tile,
          flat: this.flat,
          color: this.color,
        },
      },
      nodes
    )
  },
}
