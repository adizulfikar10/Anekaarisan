<template>
  <v-row justify="center" align="center" class="fill-height bg">
    <v-col cols="12" md="7">
      <v-card outlined class="pr-3 pl-3">
        <v-row>
          <v-col cols="12" md="7">
            <div class="text-h4 mt-10 mb-10 text-center">Login</div>
            <v-alert type="warning" v-if="isError">Username atau password tidak ditemukan.</v-alert>
            <v-form
              v-model="validForm"
              :lazy-validation="false"
              ref="form"
              @submit.prevent="login"
              class="ma-10"
            >
              <div>
                <span>Nomor Telpon</span>
                <v-text-field v-model="form.phone_number" :rules="[rules.empty]" outlined dense></v-text-field>
              </div>
              <div>
                <span>Kata Sandi</span>
                <v-text-field
                  v-model="form.password"
                  :rules="[rules.empty]"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="
                                        showPassword ? 'mdi-eye' : 'mdi-eye-off'
                                    "
                  @click:append="showPassword = !showPassword"
                  outlined
                  dense
                ></v-text-field>
              </div>
              <div>
                <v-btn
                  :loading="loading"
                  :disabled="!validForm || loading"
                  type="submit"
                  block
                  color="primary"
                >Login</v-btn>
              </div>
              <div class="text-center text-caption mt-3">Lupa Password?</div>
              <div class="text-center text-caption mt-10">
                aneka arisan &copy;
                {{ new Date().getFullYear() }}
              </div>
              <div class="text-center text-caption mt-10">v.0.0.2</div>
            </v-form>
          </v-col>
          <v-col class="d-none d-md-flex d-lg-flex bg-primary" md="5"></v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" src="./login.ts"></script>

<style lang="scss" scoped>
.bg {
  background: #eaeaea;
  height: 100vh;
  width: 100vw;
}
</style>
