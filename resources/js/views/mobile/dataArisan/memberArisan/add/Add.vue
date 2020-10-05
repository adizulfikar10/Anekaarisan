<template>
    <v-container>
        <v-text-field
            v-model="namaMember"
            label="Nama Member"
            :rules="[rules.empty]"
            outlined
            class="mt-4 mb-4"
        ></v-text-field>
        <v-btn color="primary">PILIH BARANG</v-btn>
        <div style="position:fixed;bottom:0;left:0;right:0">
            <v-card outlined>
                <v-card-text class="pa-0 pl-4 pr-4">
                    <v-row>
                        <v-col cols="6"
                            >
                            <v-btn block depressed>BATAL</v-btn>
                            </v-col
                        >
                        <v-col cols="6" class="text-right">
                            <v-btn  block depressed color="primary" to="/mobile/member_arisan">
                                SIMPAN
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </div>
    </v-container>
</template>

<script lang="ts" src="./add.ts"></script>
