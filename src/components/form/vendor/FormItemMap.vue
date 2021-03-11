<template>
  <v-form ref="form" v-model="valid">
    <AceEditor
      v-model="rawData"
      lang="json"
      theme="monokai"
      width="100%"
      height="500px"
      :options="{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        fontSize: 14,
        highlightActiveLine: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        showPrintMargin: false,
        showGutter: true,
      }"
      :commands="[
        {
          name: 'save',
          bindKey: { win: 'Ctrl-s', mac: 'Command-s' },
          readOnly: true,
        },
      ]"
      @init="editorInit"
    />
  </v-form>
</template>

<script>
import AceEditor from 'vuejs-ace-editor'
export default {
  name: 'FormItemMap',
  components: { AceEditor },
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      valid: true,
      formModel: {
      },
      formRules: {
        title: [(v) => !!v || 'Title is required'],
      },
    }
  },
  computed: {
    rawData: {
      get() {
        return this.item
          ? JSON.stringify(this.item.product_map, undefined, 2)
          : ''
      },
      set(val) {
        this.assignModel(val)
      },
    },
  },
  watch: {
    item: {
      handler(item) {
        this.item && item.product_map
          ? this.assignModel(item.product_map)
          : this.initModel()
      },
      immediate: true,
    },
  },
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/json') //language
      require('brace/mode/less')
      require('brace/theme/monokai')
    },
    assignModel(data) {
      // const obj = JSON.parse(data)
      try {
        const obj = JSON.parse(data)
        this.formModel = obj
      } catch (e) {
      }
    },
    initModel() {
      this.formModel = null
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = this.transformData(this.formModel)
        return this.$store
          .dispatch('updateVendor', {
            id: this.item.id,
            data: {
              product_map: data,
            },
          })
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    transformData(data) {
      return data
    },
  },
}
</script>
