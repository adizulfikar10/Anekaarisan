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
                    v-on:keyup.enter="searchPromo()"
                />
            </v-col>
            <v-col cols="9" class="text-right">
                <v-btn color="primary" depressed to="/promo_add">Tambah</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-data-table
                    class="mt-10"
                    :headers="headers"
                    :items="promos.data"
                    hide-default-footer
                >
                    <template v-slot:item.promo_percent="{ item }">
                        <span>{{ item.promo_percent.toLocaleString() }} %</span>
                    </template>
                    <template v-slot:item.date_start="{ item }">
                        <span>{{ item.date_start.toLocaleString() }}</span>
                    </template>
                    <template v-slot:item.date_end="{ item }">
                        <span>{{ item.date_end.toLocaleString() }}</span>
                    </template>

                    <template v-slot:item.status="{ item }">
                        <div
                            v-if="item.status === 'ENABLE'"
                            class="d-flex justify-space-between"
                        >
                            <v-chip
                                class="ma-2"
                                close
                                color="success"
                                text-color="white"
                            >
                                <v-avatar left>
                                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                                </v-avatar>
                                Aktif
                            </v-chip>
                        </div>
                        <div
                            v-else-if="item.status === 'DISABLE'"
                            class="d-flex justify-space-between"
                        >
                            <v-chip
                                class="ma-2"
                                close
                                color="danger"
                                text-color="white"
                            >
                                <v-avatar left>
                                    <v-icon>mdi-window-close</v-icon>
                                </v-avatar>
                                Non Aktif
                            </v-chip>
                        </div>
                    </template>
                    <template v-slot:item.actions="{ item }">
                        <div
                            class="d-flex justify-space-between"
                        >
                            <v-btn
                                small
                                outlined
                                color="danger"
                                >NON AKTIF</v-btn
                            >&nbsp;
                            <v-btn
                                small
                                outlined
                                color="success"
                                :to="'/promo_detail/'+item.id"
                                >DETAIL</v-btn
                            >
                        </div>
                        
                    </template>
                </v-data-table>
            </v-col>
            <v-col>
                <v-pagination
                    v-model="promos.from"
                    :length="promos.last_page"
                    @input="onPageChange"
                ></v-pagination>
            </v-col>
        </v-row>

        <!-- #region dialog transfer -->
        <v-dialog v-model="dialogApprove" width="600" persistent>
            <v-card class="pa-5">
                <v-card-title>Konfirmasi?</v-card-title>

                <v-card-text>
                    Pastikan anda telah mentransfer komisi ke agen?
                </v-card-text>
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
                        <v-btn small color="primary" @click="approvePromo"
                            >Ya</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <!-- #endregion -->
    </v-container>
</template>

<script lang="ts" src="./listPromo.ts"></script>
