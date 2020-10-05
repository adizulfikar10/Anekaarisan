<template>
  <div>
    <div>
      <v-form ref="form" v-model="validForm" :lazy-validation="false">
        <div>
          <label>Durasi</label>
          <label class="red--text">*</label>
          <v-text-field
            v-model="form.duration"
            :rules="[rules.empty, rules.number, rules.minmax]"
            suffix="Bulan"
            outlined
            solo
            dense
            text
            type="number"
            @change="countAnggota"
          ></v-text-field>
        </div>
        <div>
          <label>Tanggal Mulai</label>
          <label class="red--text">*</label>
          <v-text-field
            v-model="form.start_date"
            :rules="[rules.empty]"
            type="date"
            outlined
            solo
            dense
            text
            @change="countDate"
          ></v-text-field>
        </div>
        <div>
          <label>Tanggal Selesai</label>
          <label class="red--text">*</label>
          <v-text-field
            v-model="form.end_date"
            type="date"
            :rules="[rules.empty]"
            outlined
            solo
            readonly
            dense
            text
          ></v-text-field>
        </div>

        <v-divider />
        <div class="mt-5 text-title">Daftar Anggota</div>
        <!-- <div class="mb-5 mt-5" v-for="i in Number(form.duration)" :key="i"> -->
        <div
          class="mb-5 mt-5"
          v-for="(anggota, index) in listAnggota"
          :key="index"
        >
          <v-card outlined @click="openDialog(index, anggota)">
            <v-card-text>
              <div class="d-flex">
                <div class="card-dash">
                  <v-img
                    v-if="
                      anggota &&
                      anggota.meta_product &&
                      anggota.meta_product &&
                      anggota.meta_product.images &&
                      anggota.meta_product.images.length > 0
                    "
                    :src="'..' + anggota.meta_product.images[0].path"
                    class="grey lighten-2"
                  ></v-img>
                  <v-icon v-else class="fill-height">mdi-plus</v-icon>
                </div>
                <div class="ml-5">
                  <div class="subtitle-1 font-weight0bold">
                    {{ anggota.name }}
                  </div>
                  <div class="caption" v-if="anggota.meta_product.id">
                    {{ anggota.meta_product.name }}
                  </div>

                  <div
                    class="caption primary--text"
                    v-if="anggota.meta_product.id"
                  >
                    {{ formatMoney(anggota.meta_product.base_price) }}
                  </div>
                  <div
                    class="caption grey--text"
                    v-if="anggota.meta_product.id"
                  >
                    {{ listAnggota.length }} x
                    {{
                      formatMoney(
                        anggota.meta_product.base_price / form.duration
                      )
                    }}
                  </div>
                  <div class="mt-5 subtitle-2" v-else>Pilih Barang</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div>
          <div class="d-flex">
            <label>Total</label>
            <div class="ml-3">
              {{ formatMoney(form.total_funds) }}
            </div>
          </div>
          <div class="d-flex">
            <label>Cicilan/ Bulan</label>
            <div class="ml-2">
              {{ formatMoney(form.average_funds) }}
            </div>
          </div>
        </div>
      </v-form>
    </div>

    <div class="action-bottom">
      <v-card :elevation="2" outlined class="rounded-0 pa-4 pt-2 pb-2">
        <v-row class="ma-0">
          <v-col cols="3">
            <v-btn outlined block color="primary" to="/mobile/dashboard"
              >BATAL</v-btn
            >
          </v-col>
          <v-col cols="9">
            <v-btn
              color="primary"
              :disabled="!validForm || !validAnggota"
              block
              @click="submit"
              >SIMPAN</v-btn
            >
          </v-col>
        </v-row>
      </v-card>
    </div>

    <v-dialog v-model="dialogForm" width="800" persistent>
      <v-card>
        <v-card-title>Data Anggota</v-card-title>

        <v-card-text>
          <div>
            <label>Nama Anggota</label>
            <v-text-field
              v-model="formAnggota.name"
              outlined
              dense
              text
            ></v-text-field>
          </div>
          <div>
            <v-btn
              :disabled="formAnggota.name === ''"
              @click="dialogProduct = true"
              depressed
              block
              color="primary"
              >Pilih Barang</v-btn
            >
          </div>

          <div class="card-product mt-3" v-if="formAnggota.meta_product.id">
            <div
              class="card-image"
              v-if="
                formAnggota.meta_product.image_ids.length > 0 ||
                formAnggota.meta_product.image !== undefined
              "
            >
              <v-img
                :src="'..' + formAnggota.meta_product.images[0].path"
                class="grey lighten-2"
              ></v-img>
            </div>
            <div v-else class="card-image"></div>

            <div class="pa-3">
              <span class="subtitle-1">{{
                formAnggota.meta_product.name
              }}</span>
              <br />
              <span class="subtitle-2 red--text">{{
                formatMoney(formAnggota.meta_product.base_price)
              }}</span>
              <p />
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn small @click="closeDialog()" class="mr-2">Batal</v-btn>
            <v-btn
              small
              :disabled="
                formAnggota.name === '' ||
                !(formAnggota.meta_product && formAnggota.meta_product.id)
              "
              color="primary"
              @click="submitAnggota(formAnggota)"
              >Ya</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogProduct" fullscreen>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogProduct = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>Kembali</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <catalogue
            @selectProduct="selectProduct"
            :readonly="true"
            :emit="true"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts" src="./registrasiArisan.ts"></script>

<style lang="scss" scoped>
.card-dash {
  border-style: dashed;
  width: 80px;
  height: 80px;
  text-align: center;
  border-radius: 5px;
}

.col {
  padding: 2px !important;
}
</style>
