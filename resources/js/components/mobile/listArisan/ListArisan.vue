<template>
  <div>
    <v-container v-if="loadArisan" class="text-center">
      <v-progress-circular
        :size="50"
        color="amber"
        indeterminate
      ></v-progress-circular>
      <br />
      <span>Loading</span>
    </v-container>
    <div v-else-if="arisans && !loadArisan">
      <div class="text-center mt-3" v-if="arisans && arisans.data.length === 0">
        Data Kosong
      </div>
      <v-card
        v-for="item in arisans.data"
        :key="item.id"
        class="mb-4 rounded-lg elevation-4"
      >
        <v-card-text class="pl-6 pr-6">
          <v-row>
            <v-col cols="6">
              <div class="text-title mb-2">Arisan {{ item.sequence_code }}</div>
              <span>{{ item.duration }} Anggota</span>
            </v-col>
            <v-col cols="6" class="text-right">
              <v-chip
                color="info"
                text-color="white"
                v-if="item.status == 'PROGRESS'"
              >
                <v-avatar left> <v-icon>mdi-clock</v-icon> </v-avatar
                >Berlangsung
              </v-chip>
              <v-chip
                color="warning"
                text-color="black"
                v-if="item.status == 'REQUEST_CANCEL'"
              >
                <v-avatar left> <v-icon>mdi-clock</v-icon> </v-avatar>Pembatalan
              </v-chip>
              <v-chip
                color="danger"
                text-color="white"
                v-if="item.status == 'CANCELED'"
              >
                <v-avatar left> <v-icon>mdi-close-circle</v-icon> </v-avatar
                >Dibatalkan
              </v-chip>
              <v-chip
                color="success"
                text-color="white"
                v-if="item.status == 'SUCCESS'"
              >
                <v-avatar left> <v-icon>mdi-check-circle</v-icon> </v-avatar
                >Selesai
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="pl-6 pr-6 pt-4 pb-4">
          <v-row>
            <v-col
              :cols="item.status == 'PROGRESS' ? 6 : 12"
              class="pt-0 pb-0 pr-2"
            >
              <v-btn
                block
                depressed
                outlined
                color="primary"
                @click="selectArisan(item, 'member')"
                >Member</v-btn
              >
            </v-col>
            <v-col
              cols="6"
              v-if="item.status == 'PROGRESS'"
              class="pt-0 pb-0 pl-2"
            >
              <v-btn
                block
                depressed
                outlined
                color="primary"
                @click="selectArisan(item, 'barang')"
                >Barang</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts" src="./listArisan.ts"></script>
