<template>
    <div
        ref="document"
        v-if="$route.name == 'home'"
        :style="
            !isMobile
                ? 'width: 480px; margin: auto; align-items: center; position: relative'
                : ''
        "
    >
        <div>
            <v-carousel
                cycle
                height="250"
                hide-delimiter-background
                :show-arrows="false"
            >
                <v-carousel-item v-for="(slide, i) in slides" :key="i">
                    <v-sheet height="100%">
                        <v-row
                            class="fill-height"
                            align="center"
                            justify="center"
                        >
                            <!-- <div class="display-3">{{ slide }} Slide</div> -->
                            <v-img
                                :src="
                                    'https://img.freepik.com/free-vector/online-store-quarantine-promo-banner-template_1361-2358.jpg?size=626&ext=jpg'
                                "
                            />
                        </v-row>
                    </v-sheet>
                </v-carousel-item>
            </v-carousel>
        </div>
        <v-container v-if="!auth" class="background text-center pa-8" dark>
            <p>Anda ingin jadi agen kami?</p>
            <v-btn color="indigo" dark :to="'/mobile/register'">DAFTAR</v-btn>
        </v-container>
        <v-container
            v-else-if="auth"
            class="indigo text-center white--text pa-8"
            dark
        >
            <p>Hai {{ role.name }}</p>
            <v-btn
                v-if="role.name === 'agent'"
                color="white"
                :to="'/mobile/dashboard'"
                >Dashboard</v-btn
            >
            <v-btn v-if="role.name === 'admin'" color="white" :to="'/dashboard'"
                >Dashboard</v-btn
            >
        </v-container>
        <v-container class="pt-8 pb-8">
            <button @click="exportToPDF">Export to PDF</button>
            <div>
                <catalogue :readonly="true" :dashboard="true" />
            </div>
        </v-container>

        <v-dialog v-model="dialogProduct" fullscreen>
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="dialogProduct = false">
                        <v-icon>mdi-arrow-left</v-icon>
                    </v-btn>
                    <v-toolbar-title>Kembali</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-carousel
                        cycle
                        height="300"
                        hide-delimiter-background
                        :show-arrows="false"
                        v-if="product.images"
                    >
                        <v-carousel-item
                            v-for="(image, index) in product.images"
                            :key="index"
                        >
                            <v-sheet color="#dadada" height="100%">
                                <v-img
                                    class="white--text align-end"
                                    :src="image.path"
                                ></v-img>
                            </v-sheet>
                        </v-carousel-item>
                    </v-carousel>
                    <v-img
                        class="white--text align-end"
                        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                        v-else
                    ></v-img>
                    <v-container>
                        <div
                            v-if="
                                product.productpromos &&
                                    product.productpromos.length > 0
                            "
                        >
                            <div class="text-h6 font-weight-thin">
                                <div class="text-h5 font-weight-bold">
                                    {{ formatMoney(product.base_price) }}
                                </div>
                                <span class="text-decoration-line-through">
                                    {{
                                        formatMoney(
                                            product.base_price +
                                                (product.base_price *
                                                    product.productpromos[0]
                                                        .promo.promo_percent) /
                                                    100
                                        )
                                    }}
                                </span>
                                <v-chip class="ma-2" color="primary">
                                    {{
                                        product.productpromos[0].promo
                                            .promo_percent
                                    }}%
                                </v-chip>
                            </div>
                        </div>
                        <div v-else>
                            <span class="primary--text">
                                {{ formatMoney(product.base_price) }}</span
                            >
                        </div>
                        <div class="text--primary subtitle-1">
                            {{ product.name }}
                        </div>
                        <div class="text--primary subtitle-1">Description</div>
                        <div class="text--primary subtitle-2">
                            {{
                                product.description
                                    ? product.description
                                    : "no description"
                            }}
                        </div>
                    </v-container>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts" src="./home.ts"></script>
