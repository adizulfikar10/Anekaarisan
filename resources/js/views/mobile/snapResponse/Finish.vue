<template>
    <v-app id="inspire">
        <div v-if="loading" class="text-center">
            <v-progress-circular
                :size="50"
                color="amber"
                indeterminate
            ></v-progress-circular
            ><br />
            <span>Loading</span>
        </div>
        <div v-else>
            <div v-if="order.transaction_status == 'pending'">
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle class="mb-4"
                                >Status</v-list-item-subtitle
                            >
                            <v-list-item-title>
                                <v-chip color="warning">
                                    {{
                                        order.transaction_status.toUpperCase()
                                    }}
                                </v-chip>
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle class="mb-4"
                                >Tanggal Pembelian</v-list-item-subtitle
                            >
                            <v-list-item-title>
                                {{ order.transaction_time }}</v-list-item-title
                            >
                        </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle class="mb-4"
                                >Order ID</v-list-item-subtitle
                            >
                            <v-list-item-title>{{
                                orderStatus.order_id
                            }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
                <div style="height:10px;background:#eaeaea">&nbsp;</div>
                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-subtitle class="mb-4"
                                >Harga</v-list-item-subtitle
                            >
                            <v-list-item-title
                                >Rp.
                                {{
                                    Number(
                                        orderStatus.gross_amount
                                    ).toLocaleString()
                                }}</v-list-item-title
                            >
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </div>
            <div v-else>
                <div class="">
                    <v-card class="mx-auto" color="success" dark max-width="400">
                        <v-card-text class="headline font-weight-bold">
                            <v-container fill-height fluid>
                                <v-row align="center" justify="center">
                                    <v-col class="text-center">
                                        <v-icon
                                            color="white"
                                            x-large
                                            class="mb-8"
                                        >
                                            mdi-check-circle
                                        </v-icon>
                                        <div class="text-h5 mb-8">
                                            Pembayaran Berhasil
                                        </div>
                                        <v-chip
                                            class="mb-8"
                                            color="white"
                                            outlined
                                        >
                                            No. : {{ order.order_id }}
                                        </v-chip>
                                        <div class="body-1 mb-16">
                                            Pembayaran telah berhasil dilakukan. 
                                        </div>
                                        <v-btn
                                            class="  "
                                            outlined
                                            block
                                            to="/mobile/dashboard"
                                            >Kembali Ke Dashboard</v-btn
                                        >
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card-text>
                    </v-card>
                </div>
            </div>
        </div>
    </v-app>
</template>

<script lang="ts" src="./finish.ts"></script>
