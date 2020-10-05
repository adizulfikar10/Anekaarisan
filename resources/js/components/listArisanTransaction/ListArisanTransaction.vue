<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-text-field
          placeholder="Search"
          outlined
          v-model="searchValue"
          dense
          append-icon="mdi-magnify"
          v-on:keyup.enter="searchArisanTransaction()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          class="mt-10"
          :headers="headers"
          :items="arisanTransactions.data"
          hide-default-footer
        >
          <template v-slot:item.meta_product.base_price="{ item }">
            <span>
              {{
                item.meta_product && item.meta_product.base_price
                  ? formatMoney(item.meta_product.base_price)
                  : "-"
              }}
            </span>
          </template>
          <template v-slot:item.order_id="{ item }">
            <v-btn v-if="item.order_id" text @click="detailOrder(item)">{{
              item.order_id
            }}</v-btn>
            <span v-else>-</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <div v-if="status === 'PAID'" class="d-flex justify-space-between">
              <v-btn depressed color="success" @click="selectBarang(item)"
                >KONFIRMASI</v-btn
              >
            </div>
            <div v-else class="d-flex justify-space-between">-</div>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-pagination
          v-model="arisanTransactions.from"
          :length="arisanTransactions.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
    </v-row>
    <!-- #region dialog transfer -->
    <v-dialog v-model="dialogKonfirmasi" width="600" persistent>
      <v-card class="pa-5">
        <v-card-title>Konfirmasi?</v-card-title>

        <v-card-text>
          <p>Masukkan nomor resi :</p>
          <v-form ref="form" v-model="validForm" :lazy-validation="false">
            <span>Nomor Resi</span>
            <v-text-field
              v-model="form.shipping_number"
              :rules="[rules.empty]"
              outlined
              text
            ></v-text-field>
            <div>Pilih Kurir</div>
            <v-select
              :items="kurir"
              value="JNE"
              @input="setSelectedKurir"
              :rules="[rules.empty]"
              outlined
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn
              @click="
                dialogKonfirmasi = false;
                selectedItem = {};
              "
              class="mr-2"
              >Batal</v-btn
            >
            <v-btn
              :loading="loadingUpdateArisanTransaction"
              :disabled="loadingUpdateArisanTransaction || !validForm"
              color="primary"
              @click="konfirmasiBayar"
              >Ya</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- #endregion -->

    <!-- #region dialog transfer -->
    <v-dialog v-model="dialogDetail" width="600">
      <v-card class="pa-5">
        <v-card-title>Detail Order</v-card-title>
        <v-card-text>
          <div>
            <div class="font-weight-bold">Produk:</div>
            <div>
              {{
                selectedItem.meta_product && selectedItem.meta_product.name
                  ? selectedItem.meta_product.name
                  : "-"
              }}
            </div>
          </div>
          <div>
            <div class="font-weight-bold">Nama:</div>
            <div>
              {{
                selectedItem.arisanmember && selectedItem.arisanmember.name
                  ? selectedItem.arisanmember.name
                  : "-"
              }}
            </div>
          </div>
          <div>
            <div class="font-weight-bold">Alamat:</div>
            <div>
              {{
                selectedItem.arisan &&
                selectedItem.arisan.user &&
                selectedItem.arisan.user.street
                  ? selectedItem.arisan.user.street
                  : ""
              }}
              {{
                selectedItem.arisan &&
                selectedItem.arisan.user &&
                " " + selectedItem.arisan.user.village
                  ? selectedItem.arisan.user.village
                  : ""
              }}
              {{
                selectedItem.arisan &&
                selectedItem.arisan.user &&
                " " + selectedItem.arisan.user.district
                  ? selectedItem.arisan.user.district
                  : ""
              }}
              {{
                selectedItem.arisan &&
                selectedItem.arisan.user &&
                " " + selectedItem.arisan.user.region
                  ? selectedItem.arisan.user.region
                  : ""
              }}
              {{
                selectedItem.arisan &&
                selectedItem.arisan.user &&
                " " + selectedItem.arisan.user.province
                  ? selectedItem.arisan.user.province
                  : ""
              }}
            </div>
          </div>
          <div>
            <v-btn
              class="ma-2"
              :loading="loadingMidtrans"
              :disabled="
                loadingMidtrans ||
                !(
                  selectedItem.status === 'WAIT_PAYMENT' &&
                  statusOrderMidtrans.fraud_status === 'accept' &&
                  statusOrderMidtrans.transaction_status === 'settlement'
                )
              "
              color="info"
              @click="dialogConfirmation = true"
              block
            >
              Terbayar
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- #endregion -->

    <!-- #region dialog konfirmasi -->
    <v-dialog v-model="dialogConfirmation" max-width="500">
      <v-card>
        <v-card-title class="subtitle-1"
          >Apakah anda yakin menyetujui pembayaran ini?</v-card-title
        >

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red darken-1" text @click="dialogConfirmation = false"
            >Tidak</v-btn
          >
          <v-btn color="green darken-1" text @click="acceptTransaction()"
            >Ya</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- #endregion -->
  </v-container>
</template>
<script lang="ts" src="./listArisanTransaction.ts"></script>
