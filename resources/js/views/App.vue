<template>
  <v-app id="inspire">
    <v-snackbar
      v-if="alertMessage && alertMessage.message"
      v-model="alert"
      dark
      top
      right
      :color="typeAlert ? 'info' : 'error'"
      timeout="3000"
    >
      {{ alertMessage.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="alert = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <div
      v-if="
        $route.name == 'home' ||
        ($route.meta.roles == null && $route.name != 'login')
      "
    >
      <v-app-bar
        v-if="$route.name == 'home'"
        :clipped-left="$vuetify.breakpoint.lgAndUp"
        app
        color="primary"
        dark
      >
        <v-toolbar-title style="width: 180px" class="ml-0 pl-4">
          <span>Aneka Arisan</span>
        </v-toolbar-title>
        <v-text-field
          text
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item v-if="auth" @click="logout">
              <v-list-item-title>Keluar</v-list-item-title>
            </v-list-item>
            <v-list-item v-else :to="'/login'">
              <v-list-item-title>Masuk {{ auth }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu bottom left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on" @click="printPDF">
              <v-icon>mdi-download</v-icon>
            </v-btn>
           
          </template>
        </v-menu>
      </v-app-bar>

      <v-app-bar
        v-else-if="$route.name !== '404-not-found'"
        absolute
        color="primary"
        :dark="true"
      >
        <v-btn
          icon
          v-if="$route.name != 'mobile-dashboard'"
          @click="$router.go(-1)"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title v-if="$route.name === 'mobile-register'">{{
          $route.meta.title
        }}</v-toolbar-title>
        <v-toolbar-title v-else>{{ $route.meta.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-sheet>
        <div style="margin-top: 56px; margin-bottom: 56px">
          <router-view />
        </div>
      </v-sheet>
    </div>

    <div v-else-if="$route.name == 'login'">
      <!--  -->
      <router-view />
    </div>
    <div v-else-if="$route.meta.roles.includes('AGENT')">
      <mobile-layout>
        <router-view />
      </mobile-layout>
    </div>
    <div v-else>
      <v-navigation-drawer
        v-if="$route.name !== 'login' && $route.name !== '404-not-found'"
        v-model="drawer"
        app
        clipped
        color="primary"
      >
        <navigation />
      </v-navigation-drawer>

      <v-main>
        <v-app-bar
          v-if="$route.name !== 'login' && $route.name !== '404-not-found'"
          color="white"
          dense
        >
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
          ></v-app-bar-nav-icon>
          <!-- <v-icon class="mx-4" color="primary" large>mdi-youtube</v-icon> -->
          <v-toolbar-title class="mr-12 align-center">
            <span class="title">Aneka Arisan Admin Page</span>
          </v-toolbar-title>
          <v-spacer></v-spacer>Hi, Admin
          <v-menu bottom left offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon color="black">mdi-account</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item @click="resetPassword">
                <v-list-item-title>Ganti Password</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>Keluar</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-menu bottom left offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on" @click="printPDF">
              <v-icon>mdi-download</v-icon>
            </v-btn>
            </template>
          </v-menu>
        </v-app-bar>
        <v-container
          v-if="$route.name !== 'login' && $route.name !== '404-not-found'"
        >
          <router-view />
        </v-container>
        <v-row v-else>
          <router-view />
        </v-row>
      </v-main>
    </div>
  </v-app>
</template>

<script lang="ts" src="./app.ts"></script>
