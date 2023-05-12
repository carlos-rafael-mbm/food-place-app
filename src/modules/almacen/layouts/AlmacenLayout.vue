<template>
    <v-card
        class="mx-auto overflow-hidden"
        height="100vh">
        <v-layout>
            <v-app-bar color="#E75D48" :elevation="10">
                <v-app-bar-nav-icon @click="drawer = !drawer" class="icon"></v-app-bar-nav-icon>
                <v-avatar rounded="0" class="imagen">
                    <img src="@/assets/logo.png" alt="" height="45">
                </v-avatar>
                <v-card class="texto" flat>Módulo de Almacén</v-card>
                <v-spacer></v-spacer>
                <v-btn variant="text" icon="mdi-home" @click="$router.push({name: 'home'})"></v-btn>
                <v-btn variant="text" icon="mdi-logout" @click="logout()"></v-btn>
            </v-app-bar>

            <v-navigation-drawer
                v-model="drawer"
                absolute
                temporary>
                <v-list
                    nav
                    density="compact"
                    class="bgList">
                    <div class="usuario">
                        <v-avatar class="mx-2 mb-1">
                            <img v-if="user.employee && user.employee.image" :src="user.employee.image" alt="avatar" height="50">
                            <v-icon v-else icon="mdi-account-circle"></v-icon>
                        </v-avatar>
                        <label v-if="user.employee">Hola, {{ user.employee.name }}</label>
                    </div>
                    <v-list-subheader color="white">DATOS DE ALMACEN</v-list-subheader>
                    <v-list-item
                        prepend-icon="mdi-shape"
                        title="Categoría"
                        value="categoria"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-category-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-weight-kilogram"
                        title="Unidades de medida"
                        value="unid_medida"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-unit-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-shaker"
                        title="Insumos"
                        value="insumos"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-supply-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-warehouse"
                        title="Almacén"
                        value="almacen"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-warehouse-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-clipboard-arrow-right"
                        title="Insumos en almacén"
                        value="insumos_almacen"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-supplies-warehouse-view'})"></v-list-item>
                    <v-list-subheader color="white">PREPARACIÓN</v-list-subheader>
                    <v-list-item
                        prepend-icon="mdi-swap-horizontal"
                        title="Salidas por preparación"
                        value="salidas_preparacion"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-output-preparation-view'})"></v-list-item>
                    <v-list-subheader color="white">INVENTARIO</v-list-subheader>
                    <v-list-item
                        prepend-icon="mdi-archive-arrow-down"
                        title="Entradas"
                        value="entradas"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-entry-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-counter"
                        title="Conteo de existencias"
                        value="existencias"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="$router.push({name: 'alm-stock-count-view'})"></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <router-view/>
            </v-main>
        </v-layout>
    </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
    data() {
        return {
            drawer: false,
            user: {
                username: '',
                password: '',
                state: true,
                role: null,
                employee: null
            }
        }
    },
    computed: {
        ...mapGetters('login', ['getUser'])
    },
    methods: {
        ...mapActions('login', ['logoutUser']),
        logout() {
            this.logoutUser()
            localStorage.clear()
            window.location.reload()
        }
    },
    mounted() {
        this.user = this.getUser
    }
}
</script>

<style lang="scss" scoped>
.bgYellow {
    background-color: lighten($color: #F1C40F, $amount: 30);
    color: #E75D48 !important;
    &:hover {
        background-color: lighten($color: #E75D48, $amount: 20);
        transition: 0.2s all ease-in;
        border: 2px solid #E75D48;
        color: white !important;
    }
}
.bgYellowActive {
    background-color: lighten($color: #E75D48, $amount: 20);
    border: 2px solid #E75D48;
    color: white !important;
    cursor: not-allowed;
    pointer-events: none;
}
.bgList {
    height: 100%;
    background-image: url('@/assets/img/sidebar-4.jpg');
}
.texto {
    background-color: transparent !important;
    font-weight: bold;
    margin-left: 5px;
}
.usuario {
    border-bottom: 1px solid;
    color: white;
}
@media only screen and (max-width: 600px) {
    .usuario {
        margin-right: 1px;
    }
    .texto {
        font-size: 0.8rem;
    }
    .imagen {
        margin-left: 0px;
        display: none;
    }
    .icon {
        margin-right: -10px;
    }
}
</style>