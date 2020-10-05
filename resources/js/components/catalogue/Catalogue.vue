<template>
  <div>
    <v-row>
      <v-col lg="3" v-if="!isMobile && !dashboard">
        <v-card outlined class="mt-5">
          <v-card-title>Filter</v-card-title>
          <v-divider />
          <v-card-text>
            <div>Urutkan</div>
            <div class="d-flex justify-sm-start flex-wrap">
              <v-btn
                small
                @click="changeSort('HIGEST')"
                :color="sort === 'HIGEST' ? 'primary' : ''"
                outlined
                text
                rounded
                >Harga Tertinggi</v-btn
              >
              <v-btn
                small
                class="ml-2"
                @click="changeSort('LOWEST')"
                :color="sort === 'LOWEST' ? 'primary' : ''"
                outlined
                text
                rounded
                >Harga Terendah</v-btn
              >
            </div>
            <div class="mt-2">Harga</div>
            <div class="d-flex justify-space-between">
              <v-text-field
                @change="changeRange()"
                v-model="priceLowest"
                placeholder="Terendah"
                class="mr-1"
              ></v-text-field>
              <v-text-field
                @change="changeRange()"
                v-model="priceHigest"
                placeholder="Tertinggi"
                class="ml-1"
              ></v-text-field>
            </div>
            <div>
              <v-btn
                @click="searchProduct"
                block
                outlined
                text
                rounded
                color="primary"
              >
                <v-icon>mdi-magnify</v-icon>Search
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" :lg="dashboard ? '12' : '9'">
        <v-row align="center" justify="start">
          <v-col cols="12">
            <v-row v-if="!dashboard">
              <v-col cols="7">
                <v-text-field
                  placeholder="Search"
                  outlined
                  v-model="searchValue"
                  dense
                  append-icon="mdi-magnify"
                  v-on:keyup.enter="searchProduct"
                />
              </v-col>
              <v-col class="text-right" v-if="!readonly">
                <v-btn color="primary" depressed @click="openDialogProduct"
                  >Tambah</v-btn
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12">
            <v-row v-if="!loadingFetchProducts && products.data.length > 0">
              <v-col
                v-for="(product, index) in products.data"
                :key="index"
                :lg="dashboard ? '6' : '3'"
                cols="6"
              >
                <div class="card-product">
                  <div
                    class="card-image"
                    v-if="
                      product.image_ids.length > 0 ||
                      product.image !== undefined
                    "
                  >
                    <v-img
                      :src="'..' + product.images[0].path"
                      class="grey lighten-2"
                    ></v-img>
                  </div>
                  <div v-else class="card-image"></div>

                  <div class="pa-3">
                    <span class="subtitle-1">{{ product.name }}</span>
                    <br />
                    <span class="subtitle-2 red--text">
                      {{ formatMoney(product.base_price) }}
                    </span>
                    <p />
                    <!-- <router-link
                      :to="{name:'product-detail',  params: { id: product.id,readonly:readonly}}"
                    >-->
                    <v-btn
                      color="primary"
                      block
                      depressed
                      @click="openDialogProduct(product)"
                      >Detail</v-btn
                    >
                    <!-- </router-link> -->
                    <!-- ng kene di kei if nek seko product promo diganti pilih -->
                    <v-btn
                      class="mt-3"
                      color="primary"
                      outlined
                      @click="selectProduct(product)"
                      block
                      depressed
                      v-if="emit"
                      >Pilih</v-btn
                    >
                  </div>
                </div>
              </v-col>
            </v-row>

            <v-row
              v-else-if="!loadingFetchProducts && products.data.length <= 0"
            >
              <v-col cols="12" class="text-center">Data Kosong</v-col>
            </v-row>
            <v-row v-else>
              <v-col
                v-for="i in 12"
                :key="i"
                :lg="dashboard ? '6' : '3'"
                cols="6"
              >
                <div class="card-product">
                  <v-skeleton-loader
                    class="mx-auto"
                    max-width="300"
                    type="card"
                  ></v-skeleton-loader>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-pagination
              v-model="products.from"
              :length="products.last_page"
              @input="onPageChange"
            ></v-pagination>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div class="filterbox" v-if="isMobile && !dashboard">
          <v-btn small rounded @click="dialogFilter = true">
            <v-icon>mdi-filter</v-icon>Filter
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogFilter" transition="dialog-bottom-transition">
      <v-card outlined class="mt-5">
        <v-card-title>Filter</v-card-title>
        <v-divider />
        <v-card-text class="pa-5">
          <div>Urutkan</div>
          <div class="d-flex flex-wrap justify-space-between">
            <v-btn
              @click="changeSort('HIGEST')"
              :color="sort === 'HIGEST' ? 'primary' : ''"
              outlined
              text
              small
              rounded
              >Harga Tertinggi</v-btn
            >
            <v-btn
              @click="changeSort('LOWEST')"
              :color="sort === 'LOWEST' ? 'primary' : ''"
              outlined
              text
              small
              rounded
              >Harga Terendah</v-btn
            >
          </div>
          <div class="mt-2">Harga</div>
          <div class="d-flex justify-space-between">
            <v-text-field
              @change="changeRange()"
              v-model="priceLowest"
              placeholder="Terendah"
              class="mr-1"
            ></v-text-field>
            <v-text-field
              @change="changeRange()"
              v-model="priceHigest"
              placeholder="Tertinggi"
              class="ml-1"
            ></v-text-field>
          </div>
          <div>
            <v-btn
              @click="searchProduct"
              block
              outlined
              text
              rounded
              color="primary"
            >
              <v-icon>mdi-magnify</v-icon>Search
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogProduct"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialogProduct = false">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>Kembali</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <catalogue-detail
            v-if="dialogProduct"
            @closeForm="closeForm"
            @selectProduct="selectProduct"
            :readonly="readonly"
            :dashboard="dashboard"
            :productId="selectedItem ? selectedItem.id : ''"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts" src="./catalogue.ts"></script>

<style lang="scss" scoped>
.filterbox {
  width: 85vw;
  text-align: center;
  position: fixed;
  bottom: 30px;
}
</style>
