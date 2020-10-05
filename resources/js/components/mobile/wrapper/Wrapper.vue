<template>
  <v-app id="inspire" style="background:white">
    <div style="width:100%;min-height:100vh;max-width:480px;margin-left:auto;margin-right:auto;background:#f5f5f5;"
    :class="$route.name == 'mobile-payment-finish'? 'pa-0' :  'pa-6'">
        <slot></slot>
    </div>
  </v-app>
</template>


<script lang="ts" src="./wrapper.ts"></script>
