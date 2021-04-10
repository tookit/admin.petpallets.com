<template>
  <div>
    <label for="">{{ label }}</label>
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
  </div>
</template>

<script>
import AceEditor from 'vuejs-ace-editor'
export default {
  name: 'VJsonEditor',
  components: { AceEditor },
  props: {
    value: [Object, Array],
    label: String,
  },
  data() {
    return {
      valid: true,
    }
  },
  computed: {
    rawData: {
      get() {
        return this.value ? JSON.stringify(this.value, undefined, 2) : null
      },
      set(val) {
        if (val) {
          try {
            const obj = JSON.parse(val)
            this.$emit('input', obj)
          } catch (e) {
            console.log(e)
          }
        }
      },
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
  },
}
</script>
