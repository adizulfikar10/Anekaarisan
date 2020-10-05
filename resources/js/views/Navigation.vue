<template>
    <v-list dense>
        <v-list-item
            v-for="item in items"
            :key="item.text"
            :to="item.route"
            link
            :class="
                item.link.includes($route.name)
                    ? 'v-list-item--active'
                    : 'v-list-item'
            "
        >
            <v-list-item-action>
                <v-icon color="white">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
                <v-list-item-title class="white--text">{{
                    item.text
                }}</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>
<script lang="ts" src="./navigation.ts"></script>
