<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between">
        <v-chip
          v-if="arisanData.status == 'PROGRESS'"
          color="blue"
          text-color="white"
        >
          <v-avatar left>
            <v-icon>mdi-clock</v-icon>
          </v-avatar>
          Berlangsung
        </v-chip>
        <v-chip
          color="warning"
          text-color="black"
          v-if="arisanData.status == 'REQUEST_CANCEL'"
        >
          <v-avatar left>
            <v-icon>mdi-clock</v-icon>
          </v-avatar>
          Pembatalan Diajukan
        </v-chip>
        <v-chip
          color="danger"
          text-color="white"
          v-if="arisanData.status == 'CANCELED'"
        >
          <v-avatar left>
            <v-icon>mdi-close-circle</v-icon>
          </v-avatar>
          Dibatalkan
        </v-chip>
        <v-chip
          color="success"
          text-color="white"
          v-if="arisanData.status == 'SUCCESS'"
        >
          <v-avatar left>
            <v-icon>mdi-check-circle</v-icon>
          </v-avatar>
          Selesai
        </v-chip>

        <v-btn
          v-if="arisanData.status == 'PROGRESS'"
          color="yellow darken-1"
          depressed
          @click="dialogPembatalan = true"
          >Batalkan</v-btn
        >
      </v-col>
    </v-row>
    <list-arisan-member></list-arisan-member>
    <v-dialog v-model="dialogPembatalan">
      <v-card>
        <v-card-title> Konfirmasi </v-card-title>
        <v-card-text>
          Apakah anda yakin untuk membatalkan arisan ini?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn @click="dialogPembatalan = false" class="mr-2">Batal</v-btn>
            <v-btn color="primary" @click="requestCancel">Ya</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./memberArisan.ts"></script>
