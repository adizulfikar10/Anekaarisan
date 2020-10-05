<template>
  <div>
    <div class="d-flex justify-space-between">
      <div>
        <span class="text-body">Halo,</span><br />
        <div class="text-title mb-4">{{ username ? username : "-" }}</div>
      </div>
      <div>
        <v-btn fab small depressed @click="refresh">
          <v-icon>mdi-reload</v-icon>
        </v-btn>
      </div>
    </div>
    <v-card color="primary" class="rounded-xl pa-2 elevation-4 mb-8" dark>
      <v-card-text>
        <div class="text-body mb-2">Bonus</div>
        <div class="text-heading mb-8">
          Rp.{{ saldo ? saldo.toLocaleString("id-ID") : 0 }}
        </div>
        <v-btn to="/mobile/request" color="accent" class="rounded-lg"
          >CAIRKAN</v-btn
        >
      </v-card-text>
    </v-card>
    <v-card class="rounded-xl mb-8" elevation="4">
      <v-card-title class="pl-6"
        ><span class="text-title">Pengingat Pembayaran</span></v-card-title
      >
      <v-divider />
      <v-card-text class="pt-0 pb-6 pl-6 pr-6">
        <v-row
          v-if="
            arisanReminders &&
            arisanReminders.length > 0 &&
            !loadingArisanReminders
          "
        >
          <v-col
            cols="12"
            v-for="(reminder, index) in arisanReminders"
            :key="index"
            class="pt-0 pb-0"
          >
            <v-row>
              <v-col cols="8">
                <span class="text-body"> Arisan </span>
                <span class="text-subtitle">
                  {{ reminder.sequence_code }}
                </span>
                <br />
                <span class="text-body">{{
                  reminder.reminders.length > 0 &&
                  reminder.reminders[0].reminder_date
                    ? reminder.reminders[0].reminder_date
                    : "-"
                }}</span>
                <br />
                <span class="text-subtitle"
                  >Rp.{{
                    reminder.average_funds
                      ? reminder.average_funds.toLocaleString("id-ID")
                      : 0
                  }}</span
                >
                <br />
              </v-col>
              <v-col cols="4" class="text-right">
                <v-btn
                  color="primary"
                  class="rounded-lg"
                  @click="selectArisan(reminder)"
                  >BAYAR</v-btn
                >
              </v-col>
            </v-row>
            <v-divider />
          </v-col>
        </v-row>

        <v-row
          class="justify-center mt-4"
          v-else-if="!loadingArisanReminders && arisanReminders.length <= 0"
          ><p>Tidak ada data</p></v-row
        >

        <v-row class="justify-center mb-6" v-else>
          <v-progress-circular
            indeterminate
            color="amber"
            class="mb-4 mt-4"
          ></v-progress-circular>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" src="./dashboard.ts"></script>
