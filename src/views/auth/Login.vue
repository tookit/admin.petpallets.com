<template>
  <v-container class="page-login" fill-height>
    <v-row>
      <v-col>
        <v-card class="pa-3 page-login__card" tile>
          <v-card-title>
            <h1 class="primary--text display-1 page-login_title">
              Kamefiber
            </h1>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              class="my-10"
              lazy-validation
              v-model="formValid"
            >
              <v-text-field
                append-icon="mdi-email"
                autocomplete="off"
                name="login"
                :label="__('$vuetify.username')"
                :placeholder="__('$vuetify.username')"
                type="text"
                required
                outlined
                :rules="formRule.username"
                v-model="formModel.username"
              />
              <v-text-field
                append-icon="mdi-lock"
                autocomplete="off"
                name="password"
                :label="__('$vuetify.password')"
                :placeholder="__('$vuetify.password')"
                type="password"
                :rules="formRule.password"
                required
                outlined
                v-model="formModel.password"
                v-on:keyup.enter="login"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn large tile color="primary" @click="login" :loading="loading">
              {{ __('$vuetify.login') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'PageLogin',
  data() {
    return {
      loading: false,
      formValid: false,
      formModel: {
        username: null,
        password: null
      },
      formRule: {
        username: [
          (v) => !!v || this.__('$vuetify.rule.required', ['username'])
        ],
        password: [
          (v) => !!v || this.__('$vuetify.rule.required', ['password'])
        ]
      },
      socialIcons: [
        {
          text: 'Google',
          icon: 'mdi-google'
        },
        {
          text: 'Facebook',
          icon: 'mdi-facebook'
        },
        {
          text: 'Twitter',
          icon: 'mdi-twitter'
        }
      ]
    }
  },
  computed: {
    prefix() {
      return ''
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$store
          .dispatch('login', this.formModel)
          .then(() => {
            const { query } = this.$route
            const path = query && query.redirect ? query.redirect : '/'
            this.$router.push(path)
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    handleSocialLogin() {}
  }
}
</script>

<style lang="sass" scoped>
.page-login
  &__card
  max-width: 600px
  margin: 0 auto
</style>
