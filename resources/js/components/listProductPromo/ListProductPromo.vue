<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-text-field
          placeholder="Search"
          outlined
          v-model="searchValue"
          dense
          append-icon="mdi-magnify"
          v-on:keyup.enter="searchProductPromo()"
        />
      </v-col>
      <v-col class="text-right">
        <v-btn @click="modalCatalogue = true;">Pilih Barang</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        {{listProduct}}
        <v-data-table
          class="mt-10"
          :headers="headers"
          :items="productPromos.data"
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <v-btn small outlined color="danger" @click="deleteItem(item)">HAPUS</v-btn>
          </template>

          <template v-slot:item.base_price="{ item }">
            <span>Rp. {{ item.base_price.toLocaleString() }}</span>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-pagination
          v-model="productPromos.from"
          :length="productPromos.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- #region dialog transfer -->
    <v-dialog v-model="dialogDelete" width="600" persistent>
      <v-card class="pa-5">
        <v-card-title>Konfirmasi?</v-card-title>

        <v-card-text>Anda akan menghapus data ini?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn
              small
              @click="
                                dialogDelete = false;
                            "
              class="mr-2"
            >Batal</v-btn>
            <v-btn small color="primary" @click="openDialogDelete">Ya</v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- #endregion -->

    <v-dialog v-model="modalCatalogue">
      <v-card>
        <v-card-text>
          <!-- emit tadi terus manggil fungsi pilih barang -->
          <catalogue @selectProduct="pilihBarang" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts" src="./listProductPromo.ts"></script>
