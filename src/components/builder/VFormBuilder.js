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
} from 'vuetify/lib'

import { getObjectValueByPath } from 'vuetify/lib/util/helpers'
export default {
  name: 'v-form-builder',
  props: {
    showHeader: Boolean,
    title: {
      type: String,
      default: 'Form',
    },
    loading: Boolean,
    color: {
      type: String,
      default: 'white',
    },
    items: {
      type: Array,
      default: () => [],
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
        this.formData = val ?? {}
      },
      immediate: true,
    },
  },
  methods: {
    genFormItem(item) {
      const { name } = item.props
      const value = getObjectValueByPath(this.formData, item.props.name) ?? null
      return this.$createElement(
        VCol,
        {
          props: {
            cols: item.cols ?? 12,
          },
        },
        [
          this.$createElement(item.element, {
            props: {
              ...item.props,
              label: item.props.label ?? name.toUpperCase(),
              placeholder: item.props.placeholder ?? name.toUpperCase(),
              value: value,
            },
            on: {
              input: (e) => {
                this.formData[name] = e
                this.$emit('input', this.formData)
              },
            },
          }),
        ]
      )
    },
    genFormItems() {
      return this.items.map((item) => {
        return this.genFormItem(item)
      })
    },
    genFormWrapper() {
      return this.$createElement(VForm, { ref: 'form' }, [
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
      ])
    },
    genFormTitle() {
      return this.$createElement(
        VToolbar,
        {
          props: {
            color: this.color,
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
              },
              on: {
                click: () => {
                  this.$emit('form:cancel')
                },
              },
            },
            'cancel'
          ),
          this.$createElement(
            VBtn,
            {
              props: {
                color: this.color,
                loading: this.loading
              },
              on: {
                click: () => {
                  this.$emit('form:submit')
                },
              },
            },
            'save'
          ),
        ]
      )
    },
  },
  render(h) {
    const nodes = [
      this.genFormTitle(),
      this.genFormWrapper(),
      this.genFormFooter(),
    ]
    if (!this.showHeader) nodes.shift()
    return h(VCard, { props: { loading: this.loading } }, nodes)
  },
}
