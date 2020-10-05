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
          v-on:keyup.enter="searchUser()"
        />
      </v-col>
      <v-col class="text-right">
        <v-btn
          v-if="status === 'APPROVED'"
          color="primary"
          depressed
          @click="addUser"
          >Tambah</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-data-table
          class="mt-10"
          :headers="headers"
          :items="users.data"
          hide-default-footer
        >
          <template v-slot:item.actions="{ item }">
            <div v-if="status === 'WAIT'" class="d-flex justify-space-between">
              <v-btn
                depressed
                color="danger"
                @click="
                  dialogReject = true;
                  selectedItem = item;
                "
                class="mr-1 white--text"
                >Tolak</v-btn
              >
              <v-btn depressed color="success" @click="openDialogApprove(item)"
                >Terima</v-btn
              >
            </div>
            <div
              v-else-if="status === 'APPROVED'"
              class="d-flex justify-space-between"
            >
              <v-btn
                depressed
                color="yellow darken-2 white--text"
                @click="editUser(item)"
                >Edit</v-btn
              >
            </div>
          </template>
        </v-data-table>
      </v-col>
      <v-col>
        <v-pagination
          v-model="users.from"
          :length="users.last_page"
          @input="onPageChange"
        ></v-pagination>
      </v-col>
    </v-row>

    <!-- #region dialog tolak agen -->
    <v-dialog v-model="dialogReject" width="600" persistent>
      <v-card class="pa-5">
        <v-card-title>Konfirmasi?</v-card-title>

        <v-card-text>
          Apakah anda yakin menolak pendaftaran agen
          <b>{{ selectedItem.name }}?</b>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <div class="d-flex justify-space-between">
            <v-btn
              v-if="!isLoadingAction"
              @click="
                dialogReject = false;
                selectedItem = {};
              "
              class="mr-2"
              >Batal</v-btn
            >
            <v-btn
              :loading="isLoadingAction"
              color="primary"
              @click="rejectUser"
              >Ya</v-btn
            >
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- #endregion -->

    <!-- #region dialog form -->
    <v-dialog v-model="dialogForm" width="800" persistent>
      <v-card class="pa-5">
        <v-card-title>
          Form {{ role }}
          <v-chip v-if="isEdit" class="ml-2" color="yellow">edit</v-chip>
          <v-chip v-else-if="isAdd" class="ml-2" color="primary">tambah</v-chip>
        </v-card-title>
        <v-form ref="form" v-model="validForm" :lazy-validation="false">
          <v-card-text>
            <h3>Data {{ role }}</h3>
            <v-row>
              <v-col cols="6">
                <label>Nama</label>
                <label class="red--text">*</label>
                <v-text-field
                  v-model="form.name"
                  :rules="[rules.empty]"
                  outlined
                  dense
                  text
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label>Email</label>

                <v-text-field
                  v-model="form.email"
                  outlined
                  dense
                  text
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label>No. Telepon/WA</label>
                <label class="red--text">*</label>
                <v-text-field
                  v-model="form.phone_number"
                  :rules="[rules.empty, rules.phone]"
                  outlined
                  dense
                  text
                ></v-text-field>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Kode Referal</label>
                <v-text-field
                  v-model="form.referral_code"
                  outlined
                  dense
                  text
                  :disabled="isEdit"
                ></v-text-field>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Provinsi</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.province"
                  :items="provinces"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  text
                ></v-select>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Kota/Kabupaten</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.region"
                  :items="regions"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  text
                ></v-select>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Kecamatan</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.district"
                  :items="districts"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  text
                ></v-select>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Kelurahan</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.village"
                  :items="villages"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  text
                ></v-select>
              </v-col>
              <v-col v-if="role !== 'admin'" cols="6">
                <label>Alamat</label>
                <label class="red--text">*</label>
                <v-textarea
                  v-model="form.street"
                  :rules="[rules.empty]"
                  outlined
                  dense
                  text
                ></v-textarea>
              </v-col>
            </v-row>

            <h3>Data akun {{ role }}</h3>
            <h5 v-if="isEdit">
              Isikan field jika anda ingin mengganti akses akun(Optional)
            </h5>
            <v-row>
              <v-col cols="6">
                <label>Password</label>
                <label v-if="!isEdit" class="red--text">*</label>
                <v-text-field
                  v-model="form.password"
                  :rules="isEdit ? [] : [rules.empty, rules.password]"
                  :type="showPassword ? 'text' : 'password'"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPassword = !showPassword"
                  outlined
                  dense
                  text
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <label>Konfirmasi Password</label>
                <label v-if="!isEdit" class="red--text">*</label>
                <v-text-field
                  v-model="form.password_confirmation"
                  :rules="isEdit ? [] : [rules.empty, rules.password]"
                  :type="showPasswordConfirmation ? 'text' : 'password'"
                  :append-icon="
                    showPasswordConfirmation ? 'mdi-eye' : 'mdi-eye-off'
                  "
                  @click:append="
                    showPasswordConfirmation = !showPasswordConfirmation
                  "
                  outlined
                  :error-messages="error.password_confirmation"
                  dense
                  text
                ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <div class="d-flex justify-space-between">
              <v-btn v-if="!isLoadingAction" @click="resetForm" class="mr-2"
                >Batal</v-btn
              >
              <v-btn
                v-if="isAdd"
                :disabled="!validForm"
                color="primary"
                @click="createUser"
                :loading="isLoadingAction"
                >Simpan</v-btn
              >
              <v-btn
                v-else-if="isEdit"
                :disabled="!validForm"
                color="primary"
                @click="updateUser"
                :loading="isLoadingAction"
                >Update</v-btn
              >
              <v-btn
                v-else
                :disabled="!validForm"
                color="primary"
                @click="approveUser"
                >Simpan</v-btn
              >
            </div>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <!-- #endregion -->
  </v-container>
</template>
<script lang="ts" src="./listUser.ts"></script>

