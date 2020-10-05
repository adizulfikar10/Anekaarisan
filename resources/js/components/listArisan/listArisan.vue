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
                    v-on:keyup.enter="searchArisan()"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    class="mt-10"
                    :headers="headers"
                    :items="arisans.data"
                    hide-default-footer
                >
                    <template v-slot:header.actions="{ header }">
                        <div
                            v-if="status === 'PROGRESS'"
                            class="d-flex justify-space-between"
                        ></div>
                        <div v-else>Action</div>
                    </template>
                    <template v-slot:item.total_funds="{ item }">{{
                        formatMoney(item.total_funds)
                    }}</template>
                    <template v-slot:item.average_funds="{ item }">{{
                        formatMoney(item.average_funds)
                    }}</template>
                    <template v-slot:item.sequence_code="{ item }">
                        <v-btn @click="showArisanDetail(item)">{{
                            item.sequence_code
                        }}</v-btn>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <div
                            v-if="status === 'REQUEST_CANCEL'"
                            class="d-flex justify-space-between"
                        >
                            <v-btn
                                small
                                outlined
                                color="danger"
                                @click="openDialogCancelReject(item)"
                                >Tolak Pembatalan</v-btn
                            >
                            <v-btn
                                class="ml-2"
                                small
                                outlined
                                color="success"
                                @click="openDialogReject(item)"
                                >Batalkan Arisan</v-btn
                            >
                        </div>
                    </template>
                </v-data-table>
            </v-col>
            <v-col>
                <v-pagination
                    v-model="arisans.from"
                    :length="arisans.last_page"
                    @input="onPageChange"
                ></v-pagination>
            </v-col>
        </v-row>

        <!-- #region dialog batal arisan -->
        <v-dialog v-model="dialogReject" width="600" persistent>
            <v-card class="pa-5">
                <v-card-title>Konfirmasi?</v-card-title>

                <v-card-text>
                    Apakah anda yakin membatalkan arisan nomer
                    <b>{{ selectedItem.sequence_code }}?</b>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <div class="d-flex justify-space-between">
                        <v-btn
                            v-if="!isLoadingAction"
                            small
                            @click="
                                dialogReject = false;
                                selectedItem = {};
                            "
                            class="mr-2"
                            >Batal</v-btn
                        >
                        <v-btn
                            :loading="isLoadingAction"
                            small
                            color="primary"
                            @click="rejectArisan"
                            >Ya</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- #endregion -->

        <!-- #region dialog aktif arisan -->
        <v-dialog v-model="dialogCancelReject" width="600" persistent>
            <v-card class="pa-5">
                <v-card-title>Konfirmasi?</v-card-title>

                <v-card-text>
                    Apakah anda yakin mengaktifkan kembali arisan nomer
                    <b>{{ selectedItem.sequence_code }}?</b>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <div class="d-flex justify-space-between">
                        <v-btn
                            v-if="!isLoadingAction"
                            small
                            @click="
                                dialogCancelReject = false;
                                selectedItem = {};
                            "
                            class="mr-2"
                            >Batal</v-btn
                        >
                        <v-btn
                            :loading="isLoadingAction"
                            small
                            color="primary"
                            @click="activeArisan"
                            >Ya</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- #endregion -->

        <!-- #region arisan detail -->
        <v-dialog v-model="dialogDetailArisan" width="800">
            <v-card class="pa-5" v-if="dialogDetailArisan">
                <v-card-title>
                    Detail Arisan
                    <v-spacer />
                    <v-btn
                        small
                        text
                        @click="
                            dialogDetailArisan = false;
                            arisanDetailData = {};
                        "
                        class="mr-2"
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text>
                    <div class="subtitle-2">
                        Kode Arisan : {{ arisanDetailData.sequence_code }}
                    </div>
                    <div class="subtitle-2">
                        Tanggal Mulai : {{ arisanDetailData.start_date }}
                    </div>
                    <div class="subtitle-2">
                        Tanggal Selesai : {{ arisanDetailData.end_date }}
                    </div>
                    <div class="subtitle-2">
                        Total Dana :
                        {{ formatMoney(arisanDetailData.total_funds) }}
                    </div>
                    <div class="subtitle-2">
                        Iuran /Bulan :
                        {{ formatMoney(arisanDetailData.average_funds) }}
                    </div>

                    <v-divider />
                    <br />

                    <div class="title">Anggota</div>
                    <v-simple-table dense>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">No</th>
                                    <th class="text-left">Nama</th>
                                    <th class="text-left">Barang Pilihan</th>
                                    <th class="text-left">Harga</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item,
                                    index) in arisanDetailData.arisanmembers"
                                    :key="index"
                                >
                                    <td width="5%">{{ index + 1 }}</td>
                                    <td>{{ item.name }}</td>
                                    <td>
                                        {{
                                            item.meta_product &&
                                            item.meta_product.id
                                                ? item.meta_product.name
                                                : ""
                                        }}
                                    </td>
                                    <td>
                                        {{
                                            item.meta_product &&
                                            item.meta_product.id
                                                ? formatMoney(
                                                      item.meta_product
                                                          .base_price
                                                  )
                                                : ""
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>

                    <v-divider />
                    <br />
                    <div class="title">Status Transaksi Barang</div>
                    <v-simple-table dense>
                        <template v-slot:default>
                            <thead>
                                <tr>
                                    <th class="text-left">No</th>
                                    <th class="text-left">Nama Barang</th>
                                    <th class="text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(item,
                                    index) in arisanDetailData.arisantransactions"
                                    :key="index"
                                >
                                    <td width="5%">{{ index + 1 }}</td>

                                    <td>
                                        {{
                                            item.meta_product &&
                                            item.meta_product.id
                                                ? item.meta_product.name
                                                : ""
                                        }}
                                    </td>
                                    <td>
                                        <v-chip
                                            v-if="item.status == 'PENDING'"
                                            small
                                            color="indigo"
                                            >PENDING</v-chip
                                        >
                                        <v-chip
                                            v-else-if="item.status == 'REFUND'"
                                            small
                                            color="teal"
                                            >REFUND</v-chip
                                        >
                                        <v-chip
                                            v-else-if="item.status == 'FINISH'"
                                            small
                                            color="success"
                                            >FINISH</v-chip
                                        >
                                        <v-chip
                                            v-else-if="item.status == 'SENDING'"
                                            small
                                            color="blue"
                                            >SENDING</v-chip
                                        >
                                        <v-chip
                                            v-else-if="item.status == 'PAID'"
                                            small
                                            color="yellow"
                                            >PAID</v-chip
                                        >
                                        <v-chip
                                            v-else-if="
                                                item.status == 'WAIT_PAYMENT'
                                            "
                                            small
                                            color="grey"
                                            >WAIT PAYMENT</v-chip
                                        >
                                    </td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card-text>
            </v-card>
        </v-dialog>
        <!-- #endregion -->
    </v-container>
</template>

<script lang="ts" src="./listArisan.ts"></script>
