<template>
        <v-card class="pa-5 ma-auto">
            <v-card-title class="ma-auto text-center">
                <h2>{{$route.meta.title}}</h2>
            </v-card-title>
            <v-card-text class="text-center">
                <h1 class="mb-5">Terima Kasih</h1>
                <p>Admin kami akan segera memproses lebih lanjut, <br />
                    Pastikan nomor yang Anda daftarkan <strong>Aktif</strong> dan  terhubung
                    dengan <a
                        href="https://www.whatsapp.com/" target="_blank">WhatsApp</a>
                </p>

                <p>
                    Kami akan mengirimkan hasil validasi Anda melalui WhatsApp.
                </p>
            </v-card-text>
            <v-card-actions>
                <v-btn class="text-center" color="red"
                       :to="'/'"><span class="white--text">Beranda</span></v-btn>
            </v-card-actions>
        </v-card>
</template>
<script src="./registerAgentSuccess.ts"></script>
