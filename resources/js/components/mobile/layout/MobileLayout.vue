<template>
  <v-main v-if="$route.meta.roles.includes('AGENT')">
    <v-app-bar
      v-if="$route.name != 'mobile-barang-arisan'"
      absolute
      color="white"
      :dark="false"
      scroll-target="#scrolling-techniques-7"
    >
      <div
        style="
          width: 480px;
          margin: auto;
          align-items: center;
          display: flex;
          position: relative;
        "
      >
        <v-btn icon v-if="$route.meta.bottomNav != true" @click="goBack()">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-toolbar-title>{{ $route.meta.title }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link
          class="mr-2"
          icon
          v-if="$route.name == 'mobile-dashboard'"
          :to="{
            name: 'mobile-notifications',
          }"
        >
          <v-badge
            color="red"
            overlap
            dot
            :value="notifications > 0"
            :content="notifications"
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
        </router-link>

        <v-menu bottom left v-if="$route.name == 'mobile-dashboard'">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-account-circle</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-for="(menu, i) in menus" :key="i" :to="menu.route">
              <v-list-item-title>{{ menu.text }}</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Keluar</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-sheet
      id="scrolling-techniques-7"
      class="overflow-y-auto"
      max-height="100vh"
    >
      <div v-if="$route.name == 'mobile-barang-arisan'">
        <slot></slot>
      </div>
      <wrapper v-else>
        <div style="margin-top: 56px; margin-bottom: 56px">
          <slot></slot>
        </div>
      </wrapper>
      <v-bottom-navigation
        v-if="$route.meta.bottomNav == true"
        color="primary lighten-1"
        :value="bottomNav"
        absolute
      >
        <v-btn
          v-for="nav in navigations"
          :key="nav.route"
          :to="nav.route"
          :class="
            nav.link.includes($route.name)
              ? 'v-list-item--active'
              : 'v-list-item'
          "
        >
          <span>{{ nav.text }}</span>
          <v-icon>{{ nav.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-sheet>
  </v-main>
</template>

<script lang="ts" src="./mobileLayout.ts"></script>
