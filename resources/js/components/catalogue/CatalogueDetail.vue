<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-row align="start" justify="center">
          <v-col lg="3" cols="12">
            <div class="card-product-detail">
              <v-skeleton-loader type="image" :loading="loadingFetchProducts">
                <div class="card-image" v-if="selectedImage">
                  <v-img
                    :src="'..' + selectedImage.path"
                    aspect-ratio="1.7"
                    class="grey lighten-2"
                  ></v-img>
                </div>
                <div class="d-flex justify-center mt-2">
                  <div
                    v-for="(id, index) in listProductImage"
                    :key="index"
                    class="card-image-sm mr-1 ml-1"
                    :class="
                      selectedImage && id === selectedImage.id ? 'border' : ''
                    "
                    @click="priviewImage(index)"
                  >
                    <div class="action" v-if="isOpenForm">
                      <v-btn
                        block
                        color="danger"
                        x-small
                        @click="removeProductImage(index)"
                      >
                        <v-icon small color="white">mdi-close</v-icon>
                      </v-btn>
                    </div>
                    <v-img
                      v-if="images.data.length > 0"
                      :src="'..' + images.data[index].path"
                      aspect-ratio="1.7"
                      class="grey lighten-2"
                    ></v-img>
                  </div>
                  <div
                    v-if="listProductImage.length < 4 && isOpenForm"
                    class="card-image-sm text-center"
                  >
                    <v-file-input
                      accept="image/jpeg"
                      label="File input"
                      prepend-icon="mdi-camera"
                      hide-input
                      class="pl-10 pr-10"
                      @change="uploadImage"
                    ></v-file-input>
                  </div>
                </div>
              </v-skeleton-loader>
            </div>
          </v-col>
          <v-col lg="6" cols="12">
            <div>
              <v-skeleton-loader
                :loading="loadingFetchProducts"
                type="article,list-item-two-line"
              >
                <v-form ref="form" v-model="validForm" :lazy-validation="false">
                  <v-row>
                    <v-col>
                      <span
                        v-if="!isOpenForm"
                        class="headline font-weight-bold"
                        >{{ productData.name }}</span
                      >
                      <div v-else>
                        <span>Nama Barang</span>
                        <v-text-field
                          v-model="form.name"
                          :rules="[rules.empty]"
                          outlined
                          dense
                          text
                        ></v-text-field>
                      </div>
                    </v-col>
                    <v-spacer />
                    <v-col
                      v-if="isOpenForm && !readonly"
                      cols="3"
                      class="text-right"
                    >
                      <v-btn
                        :disabled="!validForm"
                        depressed
                        color="success"
                        @click="saveForm"
                        >Simpan</v-btn
                      >
                      <!-- <v-btn
                        small
                        depressed
                        color="danger"
                        dark
                        @click="isAddForm?$router.go(-1):closeForm()"
                      >Batal</v-btn>-->
                    </v-col>
                    <v-col
                      v-else-if="!isOpenForm && !readonly"
                      cols="3"
                      class="text-right"
                    >
                      <v-btn
                        depressed
                        color="yellow darken-2"
                        class="white--text"
                        @click="isOpenForm = true"
                        >Edit</v-btn
                      >
                      <v-btn
                        depressed
                        color="danger"
                        dark
                        @click="dialogDelete = true"
                        >Hapus</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-divider />
                  <br />
                  <span>Detail Harga Produk:</span>
                  <br />
                  <div class="mt-2">
                    <span>Harga Normal</span>
                    <span v-if="!isOpenForm" class="headline red--text ml-5">
                      {{ formatMoney(productData.base_price) }}
                    </span>
                    <v-text-field
                      v-else
                      prefix="Rp"
                      v-model="form.base_price"
                      :rules="[rules.empty, rules.number]"
                      outlined
                      dense
                      text
                    ></v-text-field>
                  </div>

                  <div class="mt-2">
                    <span>Deskripsi</span>
                    <span v-if="!isOpenForm" class="subtitle ml-5">
                      {{
                        productData.description
                          ? productData.description
                          : "tidak ada deskripsi"
                      }}
                    </span>
                    <v-textarea
                      outlined
                      dense
                      solo
                      text
                      label="Deskripsi produk"
                      v-model="form.description"
                      v-else
                    ></v-textarea>
                  </div>
                  <v-divider />

                  <div class="mt-2">
                    <div class="ml-3" v-if="!isOpenForm">
                      <div
                        v-for="(detail, index) in listProductDetail"
                        :key="index"
                      >
                        <span>
                          Cicilan
                          {{ detail.periode }}x
                        </span>
                        <span class="subtitle-1 ml-5">
                          {{ formatMoney(Number(detail.price)) }}
                        </span>
                      </div>
                    </div>
                    <div v-else>
                      <span class="subtitle-1">Cicilan</span>
                      <br />
                      <v-btn
                        @click="addProductDetail"
                        small
                        depressed
                        color="grey"
                        >Tambah</v-btn
                      >
                      <div
                        v-for="(detail, index) in listProductDetail"
                        :key="index"
                      >
                        <v-row class="ml-3" justify="center" align="center">
                          <v-col>
                            <span>Periode</span>
                            <v-text-field
                              v-model="detail.periode"
                              :rules="[rules.empty, rules.number]"
                              suffix="Bulan"
                              @change="checkPrice(index)"
                              outlined
                              dense
                              text
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <span>Harga</span>
                            <v-text-field
                              prefix="Rp"
                              readonly
                              v-model="detail.price"
                              :rules="[rules.empty, rules.number]"
                              outlined
                              dense
                              text
                            ></v-text-field>
                          </v-col>
                          <v-col>
                            <v-btn
                              color="red"
                              text
                              fab
                              @click="removeProductDetail(index)"
                            >
                              <v-icon>mdi-close-circle</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <span>Komisi Agen</span>
                    <span v-if="!isOpenForm" class="subtitle-1 ml-5"
                      >{{ productData.commission }}%</span
                    >
                    <v-text-field
                      v-else
                      v-model="form.commission"
                      :rules="[rules.empty, rules.number, rules.percent]"
                      :suffix="'%'"
                      outlined
                      dense
                      text
                    ></v-text-field>
                  </div>
                  <v-divider />
                  <br />
                  <br />
                  <div>
                    <v-btn
                      v-if="readonly && !dashboard"
                      depressed
                      color="success"
                      @click="selectProduct()"
                      >Pilih Barang</v-btn
                    >
                  </div>
                  <p />
                </v-form>
              </v-skeleton-loader>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" width="600" persistent>
      <v-card class="pa-5">
        <v-card-title>Konfirmasi?</v-card-title>

        <v-card-text>
          Apakah anda yakin ingin menghapus produk
          <b>{{ this.productData.name }}?</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn
              v-if="!isLoadingAction"
              small
              @click="dialogDelete = false"
              class="mr-2"
              >Batal</v-btn
            >
            <v-btn
              :loading="isLoadingAction"
              small
              color="primary"
              @click="deleteProduct"
              >Ya</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" src="./catalogueDetail.ts"></script>

<style lang="scss" scoped></style>
