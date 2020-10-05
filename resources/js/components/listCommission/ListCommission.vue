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
                    v-on:keyup.enter="searchCommission()"
                />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    class="mt-10"
                    :headers="headers"
                    :items="commissions.data"
                    hide-default-footer
                >
                    <template v-slot:header.actions="{ header }">
                        <span
                            v-if="status === 'WAIT'"
                            class="d-flex justify-space-between"
                            >{{ header.text }}</span
                        >
                        <span v-else>Tanggal Transfer</span>
                    </template>
                    <template v-slot:item.amount="{ item }">
                        <span>{{ formatMoney(item.amount) }}</span>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <div
                            v-if="status === 'WAIT'"
                            class="d-flex justify-space-between"
                        >
                            <v-btn
                                small
                                outlined
                                color="success"
                                @click="openDialogApprove(item)"
                                >TRANSFER</v-btn
                            >
                        </div>
                        <div
                            v-else-if="status === 'APPROVED'"
                            class="d-flex justify-space-between"
                        >
                            <!-- <v-btn
                small
                outlined
                color="red"
                @click="dialogReject = true; selectedItem = item"
              >Disable</v-btn>-->
                            {{ item.updated_at }}
                            <!-- <v-btn
                                small
                                outlined
                                color="success"
                                @click="openDialogCancel(item)"
                                >CANCEL</v-btn
              >-->
                        </div>
                    </template>
                </v-data-table>
            </v-col>
            <v-col>
                <v-pagination
                    v-model="commissions.from"
                    :length="commissions.last_page"
                    @input="onPageChange"
                ></v-pagination>
            </v-col>
        </v-row>

        <!-- #region dialog transfer -->
        <v-dialog v-model="dialogApprove" width="600" persistent>
            <v-card class="pa-5">
                <v-card-title>Konfirmasi?</v-card-title>

                <v-card-text
                    >Pastikan anda telah mentransfer komisi ke
                    agen?</v-card-text
                >
                <v-card-actions>
                    <v-spacer />
                    <div class="d-flex justify-space-between">
                        <v-btn
                            small
                            @click="
                                dialogApprove = false;
                                selectedItem = {};
                            "
                            class="mr-2"
                            >Batal</v-btn
                        >
                        <v-btn small color="primary" @click="approveCommission"
                            >Ya</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- #endregion -->

        <!-- #region dialog transfer -->
        <!-- <v-dialog v-model="dialogCancel" width="600" persistent>
            <v-card class="pa-5">
                <v-card-title>Konfirmasi?</v-card-title>

                <v-card-text>Pastikan anda telah cancel ya?</v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <div class="d-flex justify-space-between">
                        <v-btn
                            small
                            @click="
                                dialogCancel = false;
                                selectedItem = {};
                            "
                            class="mr-2"
                            >Batal</v-btn
                        >
                        <v-btn small color="primary" @click="cancelCommission"
                            >Ya</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
        <!-- #endregion -->
    </v-container>
</template>

<script lang="ts" src="./listCommission.ts"></script>
