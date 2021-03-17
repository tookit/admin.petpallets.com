<template>
  <v-card :loading="loading">
    <v-toolbar flat dark color="primary">
      <v-toolbar-title> {{ formTitle }} </v-toolbar-title>
      <v-spacer />
      <v-icon @click="$emit('close:dialog')">mdi-close</v-icon>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-container fluid>
          <v-row>
            <v-col :cols="6">
              <v-autocomplete
                v-model="formModel.vendor_id"
                :rules="formRules.vendor_id"
                label="Vendor"
                placeholdder="Vendor"
                clearable
                outlined
                :items="getVendors"
                :return-object="false"
              >
                <template #item="data">
                  <v-list-item-content>
                    <v-list-item-title v-text="data.item.text" />
                    <v-list-item-subtitle v-text="data.item.url" />
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col :cols="6">
              <v-select
                v-model="formModel.type"
                :items="['link', 'item']"
                label="Link"
                placeholder="Link"
                counter
                outlined
              />
            </v-col>
            <v-col :cols="12">
              <v-text-field
                v-model="formModel.link"
                :rules="formRules.link"
                label="Link"
                placeholder="Link"
                counter
                outlined
              />
            </v-col>
            <v-col v-if="item" :cols="12">
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
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions class="py-3">
      <v-spacer />
      <v-btn :loading="loading" tile color="primary" @click="handleSubmit()">
        save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { URL } from '@/utils/regex'
import { mergeDeep } from 'vuetify/lib/util/helpers'
import { mapGetters } from 'vuex'
import AceEditor from 'vuejs-ace-editor'
export default {
  name: 'FormTask',
  components: { AceEditor },
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
      valid: true,
      formModel: {
        vendor_id: null,
        link: null,
        rule: '',
        type: 'item',
      },
      formRules: {
        vendor_id: [(v) => !!v || 'Vendor is required'],
        link: [
          (v) => {
            return URL.test(v) || 'Link is not a valid URL'
          },
        ],
      },
    }
  },
  computed: {
    ...mapGetters(['getVendors']),
    formTitle() {
      return !this.item ? 'Create Task' : 'Edit Task'
    },
    rawData: {
      get() {
        return this.item ? JSON.stringify(this.item.rule, undefined, 2) : ''
      },
      set() {},
    },
  },
  watch: {
    item: {
      handler(item) {
        this.item ? this.assignModel(item) : this.initModel()
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    editorInit: function () {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/html')
      require('brace/mode/json') //language
      require('brace/mode/less')
      require('brace/theme/monokai')
      require('brace/snippets/javascript') //snippet
    },
    assignModel(data) {
      this.formModel = mergeDeep(this.formModel, data)
      const { vendor_id } = this.formModel
      this.formModel.vendor_id = vendor_id.toString()
    },
    initModel() {
      this.formModel = {
        vendor_id: null,
        link: null,
        type: 'item',
        rule: '',
      }
    },
    handleSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        const data = this.formModel
        data.rule = JSON.parse(this.rawData)
        if (this.item && this.item.id) {
          this.$store
            .dispatch('updateCrawlerTask', {
              id: this.item.id,
              data: data,
            })
            .then(() => {
              this.$emit('form:success')
              this.loading = false
            })
            .catch(() => {
              this.$emit('form:failed')
              this.loading = false
            })
        } else {
          this.$store
            .dispatch('createCrawlerTask', data)
            .then(() => {
              this.loading = false
              this.$emit('form:success')
            })
            .catch(() => {
              this.loading = false
            })
        }
      }
    },
  },
}
</script>

<style></style>
