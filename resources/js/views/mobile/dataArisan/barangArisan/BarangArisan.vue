<template>
  <div>
    <v-app-bar
      absolute
      color="white"
      :dark="false"
      scroll-target="#scrolling-techniques-7"
    >
      <div
        style="
          max-width: 480px;
          width: 100%;

          margin: auto;
          align-items: center;
          display: flex;
          position: relative;
        "
      >
        <v-btn icon v-if="$route.meta.bottomNav != true" @click="goBack()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
      </div>
      <template v-slot:extension>
        <div
          style="
            max-width: 480px;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            align-items: center;
          "
        >
          <v-tabs
            v-model="tab"
            background-color="white"
            color="primary"
            light
            show-arrows
            grow
          >
            <v-tab v-for="item in items" :key="item" @change="changeTab">
              {{ item }}
            </v-tab>
          </v-tabs>
        </div>
      </template>
    </v-app-bar>
    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      max-height="100vh"
    >
      <wrapper>
        <div style="margin-top: 94px"></div>
        <v-progress-linear
          v-if="loadTransaction || isLoadTab"
          class="loading-indicator"
          color="primary"
          indeterminate
        ></v-progress-linear>
        <v-tabs-items v-model="tab" v-if="!isLoadTab">
          <v-tab-item v-for="item in items" :key="item">
            <div class="mt-4" style="background: #f5f5f5">
              <list-barang
                status="WAIT_PAYMENT"
                :iuran="arisanData.average_funds + arisanData.funds"
                v-if="item === 'TERSEDIA'"
              ></list-barang>
              <list-barang
                status="PENDING"
                v-else-if="item === 'PENDING'"
              ></list-barang>
              <list-barang
                status="PAID"
                v-else-if="item === 'DIBAYAR'"
              ></list-barang>
              <list-barang
                status="SENDING"
                v-else-if="item === 'DIPROSES'"
              ></list-barang>
              <list-barang status="FINISH" v-else></list-barang>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </wrapper>
    </v-sheet>
  </div>
</template>

<script lang="ts" src="./barangArisan.ts"></script>
