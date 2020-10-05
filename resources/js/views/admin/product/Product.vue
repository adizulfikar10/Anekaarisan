<template>
  <div class="ml-5 mr-5">
    <h2>Manajemen Produk</h2>
    <v-divider />
    <v-progress-linear
      v-if="loadingFetchProducts"
      class="loading-indicator"
      color="primary"
      indeterminate
    ></v-progress-linear>

    <catalogue />
  </div>
</template>

<script lang="ts" src="./product.ts"></script>
