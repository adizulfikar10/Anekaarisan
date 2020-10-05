<template>
  <div class="pa-5">
    <div class="d-flex justify-end mb-2">
      <v-btn depressed color="primary" @click="readAll()" small>
        Tandai Semua terbaca
      </v-btn>
    </div>
    <div v-for="(notice, index) in notices" :key="index">
      <div class="pa-3 mb-1" :class="!notice.is_read ? 'lime lighten-5' : ''">
        <div class="text-subtitle-2">
          {{ notice.title ? notice.title : "TIDAK ADA JUDUL" }}
        </div>
        <div class="text-caption">
          {{ notice.message ? notice.message : "Tidak ada pesan" }}
        </div>
      </div>
      <v-divider></v-divider>
    </div>
  </div>
</template>

<script lang="ts" src="./notification.ts"></script>
