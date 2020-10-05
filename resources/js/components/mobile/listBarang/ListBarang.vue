<template>
    <div>
        <!-- <v-alert
            v-if="alert"
            outlined
            type="success"
            text
            close-text="Close Alert"
            dark
            dismissible
            >Perubahan tersimpan</v-alert
        > -->
        <div v-if="!loadData">
            <div v-if="arisanTransactions.total == 0" class="text-center">
                Tidak ada data yang ditampilkan
            </div>

            <div v-else class="pb-16 pt-4">
                <div v-if="status === 'WAIT_PAYMENT'">
                    <v-row>
                        <!-- <v-col cols="0">
                            <v-alert
                                outlined
                                type="info"
                                text
                                class="caption"
                                dark
                                >Barang yang bisa dipilih adalah barang dengan
                                harga tidak melebihi jumlah iuran + sisa
                                iuran</v-alert
                            >
                        </v-col> -->
                        <v-col cols="12">
                            <span class="caption">Sisa Iuran</span><br />
                            <span class="font-weight-bold text-title"
                                >Rp.
                                {{ arisanData.funds.toLocaleString() }}</span
                            >
                        </v-col>
                    </v-row>
                </div>
                <div
                    v-for="transaction in arisanTransactionsData"
                    :key="transaction.id"
                >
                    <v-card
                        class="mb-4"
                        :disabled="
                            transaction.meta_product.base_price >
                                arisanData.average_funds + arisanData.funds &&
                            transaction.status == 'WAIT_PAYMENT'
                                ? true
                                : false
                        "
                        @click="selectbarang(transaction)"
                    >
                        <v-card-text>
                            <v-row>
                                <v-col cols="4">
                                    <v-img
                                        width="100"
                                        height="100"
                                        class="white--text align-end rounded-lg"
                                        :src="
                                            transaction.meta_product.images[0]
                                                .path
                                        "
                                        v-if="transaction.meta_product.images"
                                    ></v-img>
                                    <div
                                        v-else
                                        style="
                      width: 100px;
                      height: 100px;
                      background: #eaeaea;
                      border-radius: 10px;
                    "
                                    >
                                        &nbsp;
                                    </div>
                                </v-col>
                                <v-col cols="8">
                                  <div
                                        v-if="
                                            transaction.status ==
                                                'WAIT_PAYMENT' &&
                                                transaction.id ==
                                                    selectedBarang.id
                                        "
                                        class="text-right"
                                        style="position:absolute;right:16px"
                                    >
                                        <v-icon color="success">
                                            mdi-check-circle
                                        </v-icon>
                                    </div>
                                    <div
                                        v-if="transaction.status == 'PENDING'"
                                    >
                                        <v-chip
                                            color="warning"
                                            text-color="white"
                                            class="mb-2"
                                            >{{ transaction.status }}</v-chip
                                        >
                                    </div>
                                    <div
                                        v-if="transaction.status == 'FINISH'"
                                    >
                                        <v-chip
                                            color="success"
                                            text-color="white"
                                            class="mb-2"

                                            >{{ transaction.status }}</v-chip
                                        >
                                    </div>
                                    <div
                                        v-else-if="
                                            transaction.status == 'PAID' ||
                                                transaction.status == 'SENDING'
                                        "
                                    >
                                        <v-chip
                                            color="info"
                                            text-color="white"
                                            class="mb-2"

                                            >{{ transaction.status }}</v-chip
                                        >
                                    </div>
                                    <div class="text-subtitle font-weight-bold mb-2">
                                        {{
                                            transaction.meta_product.name ==
                                            null
                                                ? ""
                                                : transaction.meta_product.name
                                        }}
                                    </div>
                                    <span>
                                        Rp.{{
                                            transaction.meta_product
                                                .base_price == null
                                                ? "0"
                                                : transaction.meta_product.base_price.toLocaleString()
                                        }}
                                    </span>
                                </v-col>
                                <v-col
                                    cols="12"
                                    class="pb-0"
                                    v-if="
                                        transaction.status == 'FINISH' ||
                                            transaction.status == 'PAID' ||
                                            transaction.status == 'SENDING'
                                    "
                                >
                                    <div
                                        v-if="
                                            transaction.status == 'FINISH' ||
                                                transaction.status == 'PAID'
                                        "
                                    >
                                        <v-btn
                                            block
                                            depressed
                                            color="primary"
                                            @click="selectBarang(transaction)"
                                            >LIHAT STATUS</v-btn
                                        >
                                    </div>
                                    <div
                                        v-else-if="
                                            transaction.status == 'SENDING'
                                        "
                                    >
                                        <v-row>
                                            <v-col cols="6">
                                                <v-btn
                                                    block
                                                    depressed
                                                    @click="
                                                        selectBarang(
                                                            transaction
                                                        )
                                                    "
                                                    >LIHAT STATUS</v-btn
                                                >
                                            </v-col>
                                            <v-col cols="6">
                                                <v-btn
                                                    block
                                                    depressed
                                                    color="info"
                                                    @click="
                                                        openDialogTerima(
                                                            transaction
                                                        )
                                                    "
                                                    >KONFIRMASI</v-btn
                                                >
                                            </v-col>
                                        </v-row>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </div>
            </div>

            <div v-if="status === 'WAIT_PAYMENT'" class="action-bottom">
                <v-card outlined>
                    <v-card-text class="pa-0 pl-4 pr-4">
                        <v-row>
                            <v-col cols="12" class="mb-0" v-if="selisih > 0">
                                <v-alert
                                    outlined
                                    dense
                                    border="left"
                                    type="info"
                                    class="mb-0"
                                    >Iuran anda akan berkurang sebesar Rp.
                                    {{ selisih.toLocaleString() }}</v-alert
                                >
                            </v-col>
                            <v-col cols="6" class="text-left pb-0 pt-2">
                                <span class="caption">Iuran</span>
                                <br />
                                <span class="subtitle-1 font-weight-bold"
                                    >Rp.
                                    {{
                                        arisanData.average_funds.toLocaleString()
                                    }}</span
                                >
                            </v-col>
                            <v-col cols="6" class="text-center">
                                <v-btn
                                    block
                                    :disabled="notSelected"
                                    color="info"
                                    @click="getSnapToken"
                                    :loading="loadingMidtrans"
                                    >BAYAR</v-btn
                                >
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </div>
            <v-dialog v-model="dialogTerima" width="600" persistent>
                <v-card class="pa-5">
                    <v-card-title>Konfirmasi?</v-card-title>

                    <v-card-text>Apakah barang sudah anda terima?</v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <div class="d-flex justify-space-between">
                            <v-btn @click="dialogTerima = false" class="mr-2"
                                >Batal</v-btn
                            >
                            <v-btn
                                :loading="loadingUpdateArisanTransaction"
                                :disabled="loadingUpdateArisanTransaction"
                                color="primary"
                                @click="terimaBarang()"
                                >Ya</v-btn
                            >
                        </div>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-snackbar
                v-if="alertMessage && alertMessage.message"
                v-model="alertMidtrans"
                dark
                top
                right
                :color="'error'"
                timeout="3000"
            >
                {{ alertMessage.message }}
                <template v-slot:action="{ attrs }">
                    <v-btn
                        color="white"
                        text
                        v-bind="attrs"
                        @click="alert = false"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
        </div>
    </div>
</template>

<script lang="ts" src="./listBarang.ts"></script>
