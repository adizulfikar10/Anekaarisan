<template>
  <div class="padding-box">
    <v-container v-if="loadArisan" class="text-center">
      <v-progress-circular
        :size="50"
        color="amber"
        indeterminate
      ></v-progress-circular>
      <br />
      <span>Loading</span>
    </v-container>
    <div v-else>
      <v-list>
        <v-card
          v-for="item in arisanMembers"
          :key="item.id"
          class="mb-4 pb-4 pt-4"
        >
          <v-list-item>
            <v-list-item-action>
              <v-img
                width="100"
                height="100"
                class="white--text align-end rounded-lg"
                :src="item.meta_product.images[0].path"
                v-if="item.meta_product.images"
              ></v-img>
              <div
                v-else
                style="
                  width: 100px;
                  height: 100px;
                  background: #eaeaea;
                  border-radius: 10px;
                "
              >
                &nbsp;
              </div>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                class="text-h6 mb-2"
                v-text="item.name"
              ></v-list-item-title>
              <v-list-item-subtitle
                class="body-1 mb-2"
                v-text="item.meta_product && item.meta_product.name"
              ></v-list-item-subtitle>
              <v-list-item-subtitle>
                Rp.
                {{
                  item.meta_product &&
                  item.meta_product.base_price.toLocaleString()
                }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-list>
    </div>
  </div>
</template>

<script lang="ts" src="./listArisanMember.ts"></script>

<style lang="scss" scoped>
.padding-box {
  padding-left: 10px;
  padding-right: 15px;
}
</style>