<template>
  <div class="ml-5 mr-5">
    <h2>Transaksi</h2>
    <v-divider />

    <v-progress-linear
      v-if="loadingFetchArisanTransactions || isLoadTab"
      class="loading-indicator"
      color="primary"
      indeterminate
    ></v-progress-linear>
    <v-card class="mt-10">
      <v-tabs v-model="tab" background-color="transparent" color="primary" grow>
        <v-tab v-for="item in items" :key="item" @change="changeTab">{{
          item
        }}</v-tab>
      </v-tabs>
    </v-card>

    <v-tabs-items v-model="tab" v-if="!isLoadTab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card class="mt-10">
          <v-card-text v-if="item === 'WAIT PAYMENT'">
            <list-arisan-transaction :status="'WAIT_PAYMENT'" />
          </v-card-text>
          <v-card-text v-if="item === 'PAID'">
            <list-arisan-transaction :status="'PAID'" />
          </v-card-text>
          <v-card-text v-if="item === 'SENDING'">
            <list-arisan-transaction :status="'SENDING'" />
          </v-card-text>
          <v-card-text v-if="item === 'FINISH'">
            <list-arisan-transaction :status="'FINISH'" />
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

<script lang="ts" src="./transaction.ts"></script>
