<template>
  <div class="ml-5 mr-5">
    <h2>Manajemen Arisan</h2>
    <v-divider />

    <v-progress-linear
      v-if="loadingFetchArisans || isLoadTab"
      class="loading-indicator"
      color="primary"
      indeterminate
    ></v-progress-linear>

    <v-card class="mt-10">
      <v-tabs v-model="tab" background-color="transparent" color="primary" grow>
        <v-tab v-for="item in items" :key="item" @change="changeTab">
          {{ item }}
        </v-tab>
      </v-tabs>
    </v-card>

    <v-tabs-items v-model="tab" v-if="!isLoadTab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card class="mt-10">
          <v-card-text v-if="item === 'LIST ARISAN'">
            <!-- penggunaan komponen dengan properti -->
            <list-arisan :status="'PROGRESS'" />
          </v-card-text>
          <v-card-text v-else-if="item === 'REQUEST PEMBATALAN'">
            <list-arisan :status="'REQUEST_CANCEL'" />
          </v-card-text>
          <v-card-text v-else-if="item === 'LIST ARISAN BATAL'">
            <list-arisan :status="'CANCELED'" />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
    <div v-else class="text-center mt-10">
      <v-progress-circular
        :size="50"
        color="amber"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script lang="ts" src="./arisan.ts"></script>
