<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="pb-12 text-center">
        <div class="font-weight-light" style="font-size: 12px;">Pengajuan Berhasil !</div>

        <v-responsive
          class="text-center green lighten-2 rounded-circle d-inline-flex align-center justify-center ma-6"
          height="64"
          width="64"
          style="background:#48EA2E;"
        >
          <v-icon style="color:white" class="text-center">mdi-check</v-icon>
        </v-responsive>

        <div
          class="text-center font-weight-light"
          style="font-size: 12px"
        >Silahkan tunggu beberapa saat sampai masuk ke rekening anda</div>
        <v-btn
          text
          small
          class="text-center font-weight-light mt-6"
          style="font-size: 12px; color: #5751D9; cursor: pointer"
          to="/mobile/dashboard"
        >kembali ke menu awal</v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./requestWalletResult.ts"></script>
