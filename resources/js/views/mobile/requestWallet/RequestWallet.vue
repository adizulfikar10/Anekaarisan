<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="pb-12">
        <v-alert dense outlined type="error" v-if="isAlert">{{
          alertMessage
        }}</v-alert>
        <v-form ref="form" v-model="validForm" :lazy-validation="false">
          <div class="text--disabled">Nama Bank</div>
          <v-text-field
            required="required"
            placeholder="BCA"
            :rules="[rules.empty]"
            type="text"
            single-line
            outlined
            v-model="bankName"
          ></v-text-field>
          <div class="text--disabled">Nomor Rekening</div>
          <v-text-field
            required="required"
            placeholder="0987654321"
            :rules="[rules.empty]"
            type="text"
            single-line
            outlined
            v-model="bankAccount"
          ></v-text-field>
          <div class="text--disabled">Nominal Penarikan</div>
          <v-text-field
            placeholder="Rp. 0"
            type="number"
            min="0"
            :rules="[rules.number, rules.notZero]"
            single-line
            outlined
            v-model="requestWallet"
          ></v-text-field>
          <div class="font-weight-black text-right">
            Rp.{{ saldo ? saldo.toLocaleString("id-ID") : 0 }}
          </div>
        </v-form>
        <v-divider />

        <div v-if="requestWallets.length > 0">
          <div class="text--disabled pt-4 pb-4 mt-2">Permintaan</div>
          <div>
            <div v-for="(item, index) in requestWallets" :key="index">
              <div class="pt-3 pb-3 pl-3 pr-3">
                <v-row justify="space-between">
                  <div>Pencairan Saldo</div>
                  <div style="font-weight: bold" :style="'color: black'">
                    Rp.{{
                      item.amount ? item.amount.toLocaleString("id-ID") : 0
                    }}
                  </div>
                </v-row>
                <v-row class="caption">{{ item.transaction_date }}</v-row>
              </div>
              <v-divider />
            </div>
          </div>
        </div>
        <v-divider />
        <div class="text--disabled pt-4 pb-4 mt-2">Riwayat</div>
        <v-divider />
        <div v-if="walletHistories.length > 0">
          <div v-for="(item, index) in walletHistories" :key="index">
            <div class="pt-3 pb-3 pl-3 pr-3">
              <v-row justify="space-between">
                <div>
                  {{ item.status === "OUT" ? "Penarikan" : "Penambahan" }} Saldo
                </div>
                <div
                  style="font-weight: bold"
                  :style="item.status === 'IN' ? 'color:green' : 'color: red'"
                >
                  {{ item.status === "IN" ? "+" : "-" }} Rp.{{
                    item.amount ? item.amount.toLocaleString("id-ID") : 0
                  }}
                </div>
              </v-row>
              <v-row class="caption">{{ item.transaction_date }}</v-row>
            </div>
            <v-divider />
          </div>
        </div>
        <div v-else class="text-center mt-4 font-weight-light caption">
          belum ada riwayat
        </div>
        <div
          v-if="walletPagination.current_page < walletPagination.last_page"
          class="text-center pa-4"
        >
          <v-btn text small @click="loadMore" :loading="false"
            >MUAT LAINYA</v-btn
          >
        </div>
      </v-container>
      <div class="action-bottom">
        <v-card :elevation="2" class="rounded-0" outlined>
          <v-row class="ma-0">
            <v-col cols="3">
              <v-btn text small to="/mobile/dashboard">BATAL</v-btn>
            </v-col>
            <v-col cols="9" style="background: #e7c749">
              <v-btn
                :disabled="!validForm"
                text
                block
                small
                @click="dialog = true"
                >AJUKAN</v-btn
              >
            </v-col>
          </v-row>
        </v-card>
      </div>

      <v-dialog v-model="dialog" max-width="390">
        <v-card>
          <v-card-title class="subtitle-1">Apakah anda yakin?</v-card-title>

          <v-card-text>
            Permintaan pencairan dana sebesar
            <strong
              >Rp {{ Number(requestWallet).toLocaleString("id-ID") }}</strong
            >.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="red darken-1" text @click="dialog = false"
              >Tidak</v-btn
            >

            <v-btn color="green darken-1" text @click="submit()">Ya</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./requestWallet.ts"></script>
