<template>
    <div class="">
        <v-card class="mx-auto" color="danger" dark max-width="400">
            <v-card-text class="headline font-weight-bold">
                <v-container fill-height fluid>
                    <v-row align="center" justify="center">
                        <v-col class="text-center">
                            <v-icon color="white" x-large class="mb-8">
                                mdi-close-circle
                            </v-icon>
                            <div class="text-h5 mb-8">Pembayaran Gagal</div>
                            <v-chip class="mb-8" color="white" outlined>
                                No. : {{$route.query.order_id}}
                            </v-chip>
                            <div class="body-1 mb-16">
                                Terjadi kesalahan ketika melakukan pembayaran.
                                Silahkan untuk mengulangi pembayarangit
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
</template>

<script lang="ts" src="./error.ts"></script>
