<template>
    <div>
        <v-list>
            <div v-for="item in cards" :key="item.id">
                <v-list-item to="/mobile/pembayaran">
                    <v-list-item-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>{{ item.text }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                        <v-icon>mdi-chevron-right</v-icon>
                    </v-list-item-action>
                </v-list-item>
                <v-divider></v-divider>
            </div>
        </v-list>
    </div>
</template>

<script lang="ts" src="./metodeBayar.ts"></script>
