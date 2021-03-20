<template>
  <div class="v-editor">
    <iframe ref="editor" />
    <v-dialog v-model="showDialog" scrollable>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Media Manager</v-toolbar-title>
          <v-spacer />
          <v-btn icon @click="handleAttachMedia(selectedItems)">
            <v-icon color="white">mdi-check</v-icon>
          </v-btn>
          <v-btn icon @click="showDialog = false">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text class="pa-0">
          <media-table
            ref="table"
            v-model="selectedItems"
            show-select
            single-select
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { Jodit } from 'jodit'
import MediaTable from '@/components/table/MediaTable'

export default {
  name: 'VEditor',
  components: {
    MediaTable,
  },
  props: {
    option: {
      type: Object,
      default: () => {
        return {
          height: 600,
        }
      },
    },
    value: {
      type: [String, Object],
      required: true,
      default: 'placeholder',
    },
  },
  data() {
    return {
      selectedItems: [],
      showDialog: false,
    }
  },
  computed: {},
  watch: {
    value: {
      handler(val) {
        this.editor.value = val
      },
    },
  },
  mounted() {
    const vm = this
    const btns = [
      'source',
      'ul',
      'ol',
      'paragraph',
      {
        iconURL:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkYXRhLXN2Zz0iaW1hZ2UiIGlkPSJzdmciPjxjaXJjbGUgY3g9IjE2LjEiIGN5PSI2LjEiIHI9IjEuMSIvPjxyZWN0IGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgeD0iLjUiIHk9IjIuNSIgd2lkdGg9IjE5IiBoZWlnaHQ9IjE1Ii8+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAxIiBwb2ludHM9IjQsMTMgOCw5IDEzLDE0Ii8+PHBvbHlsaW5lIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjAxIiBwb2ludHM9IjExLDEyIDEyLjUsMTAuNSAxNiwxNCIvPjwvc3ZnPg==',
        exec: function (editor) {
          vm.showDialog = true
        },
      },
      'link',
      'video',
      'table',
      'fullsize',
      'preview',
    ]
    const base = process.env.VUE_APP_BASE_API_HOST
    const defaultOptions = {
      useSearch: false,
      height: '600',
      iframe: true,
      iframeCSSLinks: [`${base}/css/main.css`],
      uploader: {
        insertImageAsBase64URI: true,
      },
      defaultActionOnPaste: 'insert_clear_html',
      disablePlugins: 'addnewline,autofocus,color,font,indent,redoundo',
      // "buttons": "source,ul,ol,paragraph,image,file,link,video,table,fullsize"
      buttons: btns,
      buttonsSM: btns,
      buttonsMD: btns,
    }
    const jodit = new Jodit(this.$refs.editor, defaultOptions)
    this.editor = jodit
    this.editor.value = this.value
    this.editor.events.on('change', (newValue) => this.$emit('input', newValue))
  },
  beforeDestroy() {
    this.editor.destruct()
  },
  methods: {
    handleAttachMedia(selectedItems) {
      if (selectedItems.length > 0) {
        const item = selectedItems.shift()
        const image = document.createElement('image')
        image.setAttribute('src', item.cloud_url)
        image.setAttribute('alt', item.fingerprint)
        this.editor.selection.insertImage(image)
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
