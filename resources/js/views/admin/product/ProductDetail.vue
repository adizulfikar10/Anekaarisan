<template>
  <div class="ml-5 mr-5">
    <h2>Manajemen Produk > Detail Produk</h2>
    <v-divider />
    <v-progress-linear
      v-if="loadingFetchProducts"
      class="loading-indicator"
      color="primary"
      indeterminate
    ></v-progress-linear>

    <catalogue-detail />
  </div>
</template>

<script lang="ts" src="./productDetail.ts"></script>
