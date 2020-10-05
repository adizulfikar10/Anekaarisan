<template>
  <div>
    <v-alert v-if="alert" type="success" dismissible>{{
      alertMessage
    }}</v-alert>

    <v-card class="mt-10 pa-3">
      <v-form ref="form" v-model="validForm" :lazy-validation="false">
        <v-card-text>
          <v-row justify="center" align="center">
            <v-col cols="12">
              <v-text-field
                v-model="currentPassword"
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.empty, rules.password]"
                :type="show ? 'text' : 'password'"
                name="currentPassword"
                label="Kata Sandi saat ini"
                counter
                @click:append="show = !show"
                :error-messages="
                  eventErrorUser.errors &&
                  eventErrorUser.errors.current_password
                "
                outlined
                dense
                text
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.empty, rules.password]"
                :type="show1 ? 'text' : 'password'"
                name="password"
                label="kata Sandi"
                hint="Minimal 6 Karakter"
                counter
                @click:append="show1 = !show1"
                :error-messages="
                  eventErrorUser.errors && eventErrorUser.errors.password
                "
                outlined
                dense
                text
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="passwordConfirmation"
                :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.empty, rules.password]"
                :type="show2 ? 'text' : 'password'"
                name="password-confirmation"
                label="Konfirmasi Kata Sandi"
                counter
                @click:append="show2 = !show2"
                outlined
                dense
                text
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            @click="submit"
            :loading="LoadingSubmit"
            :disabled="LoadingSubmit || !validForm"
            >SIMPAN</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script lang="ts" src="./changePassword.ts"></script>
