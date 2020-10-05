<template>
    <v-container>
        <div>
            <v-row>
                <v-col cols="6">
                    <v-form ref="upload" v-model="validForm"> </v-form>
                    <v-file-input
                        accept="image/*"
                        label="Unggah Gambar"
                        v-model="file"
                        @change="selectFile"
                    ></v-file-input>
                    
                </v-col>
                <v-col cols="3">
                    <v-btn
                        color="primary"
                        :loading="loadingUpload"
                        :disabled="loadingUpload"
                        @click="validate"
                        >UPLOAD</v-btn
                    >
                </v-col>
            </v-row>
        </div>
        <div v-if="loadData" clas="text-center">
            <v-progress-circular
                indeterminate
                color="primary"
            ></v-progress-circular>
            <br />
            <span>Loading</span>
        </div>
        <div v-else>
            <v-row>
                <v-col cols="4" v-for="img in images.data" :key="img.id">
                    <v-card class="mx-auto" max-width="400">
                        <!-- {{'./storage/'+img.path}} -->
                        <v-img
                            class="white--text align-end"
                            height="200px"
                            :src="
                                'https://cdn.vuetifyjs.com/images/cards/docks.jpg'
                            "
                        >
                        </v-img>
                        <v-card-actions>
                            <v-btn color="orange" text @click="selectImage(img)">
                                PILIH
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>

<script lang="ts" src="./listImage.ts"></script>
