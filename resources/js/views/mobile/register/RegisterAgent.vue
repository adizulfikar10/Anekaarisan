<template>
  <div>
    <div>
      <v-form ref="form" v-model="validForm" :lazy-validation="false">
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <div>
                <label>Nama</label>
                <label class="red--text">*</label>
                <v-text-field
                  v-model="form.name"
                  :rules="[rules.empty]"
                  outlined
                  solo
                  dense
                  text
                ></v-text-field>
              </div>
              <div>
                <label>Email</label>
                <v-text-field
                  v-model="form.email"
                  outlined
                  solo
                  dense
                  text
                  placeholder="Tidak wajib."
                ></v-text-field>
              </div>
              <div>
                <label>No. Telepon/WA</label>
                <label class="red--text">*</label>
                <v-text-field
                  v-model="form.phone_number"
                  :rules="[rules.empty, rules.phone]"
                  outlined
                  dense
                  solo
                  text
                ></v-text-field>
              </div>
              <div>
                <label>Kode Referal</label>
                <v-text-field
                  v-if="$route.name === 'mobile-register-binaan'"
                  disabled
                  v-model="form.referral_code"
                  outlined
                  dense
                  solo
                  text
                  :error-messages="error.referral_code"
                  :success-messages="success.referral_code"
                ></v-text-field>
                <v-text-field
                  v-else
                  v-model="form.referral_code"
                  outlined
                  dense
                  solo
                  text
                  :error-messages="error.referral_code"
                  :success-messages="success.referral_code"
                ></v-text-field>
              </div>
              <div>
                <label>Provinsi</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.province"
                  :items="provinces"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  solo
                  text
                ></v-select>
              </div>
              <div>
                <label>Kota/Kabupaten</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.region"
                  :items="regions"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  solo
                  text
                ></v-select>
              </div>
              <div>
                <label>Kecamatan</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.district"
                  :items="districts"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  solo
                  text
                ></v-select>
              </div>
              <div>
                <label>Kelurahan</label>
                <label class="red--text">*</label>
                <v-select
                  v-model="form.village"
                  :items="villages"
                  item-text="name"
                  item-value="name"
                  outlined
                  dense
                  solo
                  text
                ></v-select>
              </div>
              <div>
                <label>Alamat</label>
                <label class="red--text">*</label>
                <v-textarea
                  v-model="form.street"
                  :rules="[rules.empty]"
                  outlined
                  dense
                  solo
                  text
                ></v-textarea>
              </div>
              <div>
                <v-checkbox v-model="userAgreement">
                  <template v-slot:label>
                    <div>
                      Saya setuju dengan
                      <a href="#" @click.stop> Syarat dan Ketentuan </a>
                      yang Berlaku.
                    </div>
                  </template>
                </v-checkbox>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            :disabled="!validForm || !userAgreement"
            block
            color="primary"
            @click="registerUser"
            :loading="isLoadingAction"
            >Daftar
          </v-btn>
        </v-card-actions>
      </v-form>
    </div>
  </div>
</template>
<script src="./registerAgent.ts"></script>
