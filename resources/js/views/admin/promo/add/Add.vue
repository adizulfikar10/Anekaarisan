<template>
  <div class="ml-5 mr-5">
    <v-form ref="form" v-model="validForm" :lazy-validation="false">
      <v-row>
        <v-col cols="6">
          <h2>
            Manajemen Promo
            <v-icon>mdi-chevron-right</v-icon>Tambah
          </h2>
        </v-col>
        <v-col cols="6" class="text-right">
          <v-btn>BATAL</v-btn>
          <v-btn color="primary" @click="savePromo" :disabled="!validForm">SIMPAN</v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Nama Promo"
            placeholder="Nama Promo"
            outlined
            v-model="form.name"
            :rules="[rules.empty]"
            required
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <date-picker label="Tanggal Mulai" placeholder="yyyy-mm-dd" :model="form.date_start"></date-picker>
            </v-col>
            <v-col cols="6">
              <date-picker label="Tanggal Selesai" placeholder="yyyy-mm-dd" :model="form.date_end"></date-picker>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Presentase Diskon"
                placeholder="0"
                suffix="%"
                outlined
                type="number"
                :rules="[rules.empty, rules.percent]"
                v-model="form.promo_percent"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="6">
          <div v-if="selectedImage != null">
            <v-img
              class="white--text align-end"
              height="200px"
              :src="'../storage/' + selectedImage.path"
            ></v-img>
          </div>

          <div v-else>
            <v-card class="mx-auto" color="#eeeeee" height="200" :outlined="true">
              <v-container fill-height fluid>
                <v-row align="center" justify="center">
                  <v-col class="text-center">
                    <v-icon>mdi-image</v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </div>

          <v-btn color="primary" class="mt-4" @click="openDialogMedia()">PILIH GAMBAR</v-btn>
        </v-col>
        <v-col cols="12">
          <h2>Produk</h2>
          <v-divider class="mt-4" />
          <v-card class="mt-4 pa-8">
            <list-product-promo></list-product-promo>
          </v-card>
          <!-- <v-card class="mt-4 pa-8">
                        <v-container>
                            <v-row>
                                <v-col cols="3">
                                    <v-text-field
                                        placeholder="Search"
                                        outlined
                                        dense
                                        append-icon="mdi-magnify"
                                    />
                                </v-col>
                                <v-col cols="9" class="text-right">
                                    <v-btn
                                        color="primary"
                                        @click="openDialogProduct()"
                                        >TAMBAH</v-btn
                                    >
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <v-data-table
                                        class="mt-10"
                                        :headers="headers"
                                        :items="selectedProducts"
                                        hide-default-footer
                                    >
                                        <template
                                            v-slot:item.actions="{ item }"
                                        >
                                            <v-btn
                                                small
                                                outlined
                                                color="danger"
                                                @click="deleteItem(item)"
                                                >HAPUS</v-btn
                                            >
                                        </template>

                                        <template
                                            v-slot:item.base_price="{ item }"
                                        >
                                            <span>Rp. {{
                                                item.base_price.toLocaleString()
                                            }}</span>
                                        </template>
                                    </v-data-table>
                                </v-col>
                            </v-row>
                        </v-container>
          </v-card>-->
        </v-col>
      </v-row>
    </v-form>
    <!-- #region dialog transfer -->
    <!-- <v-dialog v-model="dialogProduct" width="800" persistent>
            <v-card class="pa-5">
                <v-card-title>Pilih Produk</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-alert v-if="isRedundant" type="warning">
                            Barang sudah dipilih sebelumnya.
                        </v-alert>
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
                                <v-col
                                    cols="4"
                                    v-for="product in products.data"
                                    :key="product.id"
                                >
                                    <v-card class="mx-auto" max-width="400">
                                        <div
                                            style="background:#dadada;height:150px"
                                        ></div>
                                        <v-card-title>{{
                                            product.name
                                        }}</v-card-title>
                                        <v-card-text
                                            >Rp.
                                            {{
                                                product.base_price.toLocaleString()
                                            }}</v-card-text
                                        >
                                        <v-card-actions>
                                            <v-btn
                                                color="orange"
                                                text
                                                @click="selectProduct(product)"
                                            >
                                                PILIH
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </div>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <div class="d-flex justify-space-between">
                        <v-btn small @click="dialogProduct = false" class="mr-2"
                            >Batal</v-btn
                        >
                    </div>
                </v-card-actions>
            </v-card>
    </v-dialog>-->
    <!-- #end region dialog transfer -->

    <!-- #region dialog transfer -->
    <v-dialog v-model="dialogUpload" width="800" persistent>
      <v-card class="pa-5">
        <v-card-title>Konfirmasi?</v-card-title>
        <v-card-text>
          <v-container>
            <div>
              <v-row>
                <v-col cols="6">
                  <v-form ref="upload" v-model="validForm"></v-form>
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
                  >UPLOAD</v-btn>
                </v-col>
              </v-row>
            </div>
            <div v-if="loadData" clas="text-center">
              <v-progress-circular indeterminate color="primary"></v-progress-circular>
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
                      :src="'../storage/' + img.path"
                    ></v-img>
                    <v-card-actions>
                      <v-btn color="orange" text @click="selectImage(img)">PILIH</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </div>
          </v-container>
          <!-- <list-image v-model="image"></list-image> -->
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn small @click="dialogUpload = false" class="mr-2">Batal</v-btn>
            <v-btn small color="primary" @click="dialogUpload = false">Ya</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- #end region dialog transfer -->
  </div>
</template>

<script lang="ts" src="./add.ts"></script>
