<template>
    <v-app id="inspire">
        <div v-if="loadingTransactionArisan" class="text-center">
            <v-progress-circular
                :size="50"
                color="amber"
                indeterminate
            ></v-progress-circular
            ><br />
            <span>Loading</span>
        </div>
        <div v-else>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle class="mb-4">Status</v-list-item-subtitle>
                        <v-list-item-title>
                            <v-chip
                                v-if="arisanTransactionData.status == 'FINISH'"
                                color="SUCCESS"
                                text-color="white"
                            >
                                {{ arisanTransactionData.status }}
                            </v-chip>
                            <v-chip
                                v-else
                                color="info"
                                text-color="white"
                            >
                                {{ arisanTransactionData.status }}
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
                        <v-list-item-title
                            > {{ arisanTransactionData.updated_at }}</v-list-item-title
                        >
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle class="mb-4">No. Resi</v-list-item-subtitle>
                        <v-list-item-title>{{arisanTransactionData.shipping_number}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                 <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle class="mb-4">Kurir</v-list-item-subtitle>
                        <v-list-item-title>{{arisanTransactionData.courier}}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <div style="height:10px;background:#eaeaea">&nbsp;</div>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle class="mb-4">Nama Barang</v-list-item-subtitle>
                        <v-list-item-title>{{
                            arisanTransactionData.meta_product.name
                        }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-subtitle class="mb-4">Harga</v-list-item-subtitle>
                        <v-list-item-title
                            >Rp.
                            {{
                                arisanTransactionData.meta_product.base_price.toLocaleString()
                            }}</v-list-item-title
                        >
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </div>
    </v-app>
</template>

<script lang="ts" src="./statusBarang.ts"></script>
