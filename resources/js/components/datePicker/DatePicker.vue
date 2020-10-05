<template>
    <div>
        <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="290px"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-text-field
                    v-model="model"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    :label="label"
                    :placeholder="placeholder"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                ></v-text-field>
            </template>
            <v-date-picker
                v-model="model"
                @input="menu2 = false"
            ></v-date-picker>
        </v-menu>
    </div>
</template>

<script lang="ts" src="./datePicker.ts"></script>
