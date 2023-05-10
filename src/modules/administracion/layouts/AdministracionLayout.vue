<template>
    <v-card
        class="mx-auto"
        height="100vh">
        <v-layout>
            <v-app-bar color="#F1C40F" :elevation="10">
                <v-app-bar-nav-icon @click="drawer = !drawer" class="icon"></v-app-bar-nav-icon>
                <v-avatar rounded="0" class="imagen">
                    <img src="@/assets/logo.png" alt="" height="45">
                </v-avatar>
                <v-card class="texto" flat>Módulo de Administración</v-card>
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
                    class="bg-list">
                    <div class="usuario">
                        <v-avatar class="mx-2 mb-1">
                            <img v-if="user.employee && user.employee.image" :src="user.employee.image" alt="avatar" height="50">
                            <v-icon v-else icon="mdi-account-circle"></v-icon>
                        </v-avatar>
                        <label v-if="user.employee">Hola, {{ user.employee.name }}</label>
                    </div>
                    <v-list-subheader color="white">CARTA</v-list-subheader>
                    <v-list-item
                        prepend-icon="mdi-shape"
                        title="Categoría"
                        value="categoria"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-category-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-food-fork-drink"
                        title="Platos/Bebidas"
                        value="item_menu"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'item-menu-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-list-box"
                        title="Carta"
                        value="menu"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-menu-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-food-variant"
                        title="Insumos por plato/bebida"
                        value="insumos"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-supply-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && user.role.id == 10000"
                        prepend-icon="mdi-percent-circle"
                        title="Promociones"
                        value="promociones"
                        active-class="bgYellowActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-promo-view'})"></v-list-item>
                    <v-list-subheader color="white" v-if="user.role && (user.role.id == 1 || user.role.id == 9)">LOCAL</v-list-subheader>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-chef-hat"
                        title="Área de preparación"
                        value="area_preparacion"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-preparation-area-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-table-chair"
                        title="Mesas"
                        value="mesas"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-table-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-currency-usd"
                        title="Métodos de pago"
                        value="metodos-pago"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-payment-method-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-cash-register"
                        title="Cajas registradoras"
                        value="caja_registradora"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-cash-register-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-account-circle"
                        title="Clientes"
                        value="clientes"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-client-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-store"
                        title="Mapa del local"
                        value="place_map"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-place-map-view'})"></v-list-item>
                    <v-list-subheader color="white" v-if="user.role && (user.role.id == 1 || user.role.id == 9)">PERSONAL</v-list-subheader>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-clipboard-account"
                        title="Empleados"
                        value="empleados"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-employee-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-shield-account"
                        title="Usuarios"
                        value="usuarios"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-user-view'})"></v-list-item>
                    <v-list-subheader color="white" v-if="user.role && (user.role.id == 1 || user.role.id == 9)">PARÁMETROS</v-list-subheader>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-cog-outline"
                        title="Parámetros"
                        value="parametros"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-parameter-view'})"></v-list-item>
                    <v-list-subheader color="white" v-if="user.role && (user.role.id == 1 || user.role.id == 9)">REPORTES</v-list-subheader>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-finance"
                        title="Reporte de ventas"
                        value="reporte_ventas"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-sale-report-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-monitor-dashboard"
                        title="Dashboard de ventas"
                        value="dashboard_ventas"
                        active-class="bgYellowActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgYellow"
                        @click="this.$router.push({name: 'adm-dashboard-view'})"></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <v-main>
                <router-view/>
            </v-main>
        </v-layout>
    </v-card>
    <!-- <navbar-administracion/>
    <div class="d-flex">
        <div class="col-2">
            <sidebar-administracion/>
        </div>
        <div class="col">
            <router-view/>
        </div>
    </div> -->
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

<!-- <script>
// import { defineAsyncComponent } from 'vue'

export default {
    // components: {
    //     NavbarAdministracion: defineAsyncComponent(() => import('@/modules/administracion/components/NavbarAdministracion.vue')),
    //     SidebarAdministracion: defineAsyncComponent(() => import('@/modules/administracion/components/SidebarAdministracion.vue'))
    // }

}
</script> -->

<style lang="scss" scoped>
.bgYellow {
    background-color: lighten($color: #F1C40F, $amount: 30);
    color: green !important;
    &:hover {
        background-color: lighten($color: #679A50, $amount: 20);
        transition: 0.2s all ease-in;
        border: 2px solid #679A50;
        color: white !important;
    }
}
.bgYellowActive {
    background-color: lighten($color: #679A50, $amount: 20);
    border: 2px solid #679A50;
    color: white !important;
    cursor: not-allowed;
    pointer-events: none;
}
.bg-list {
    height: 100%;
    background-image: url('@/assets/img/sidebar-1.jpg');
    overflow-y: auto;
}
.texto {
    background-color: transparent !important;
    font-weight: bold;
    margin-left: 5px;
}
.usuario {
    border-bottom: 1px solid;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
.bg-list::-webkit-scrollbar {
    -webkit-appearance: none;
}
.bg-list::-webkit-scrollbar:vertical {
    width:0px;
}
.bg-list::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.bg-list::-webkit-scrollbar:horizontal {
    height: 10px;
}
.bg-list::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
.bg-list::-webkit-scrollbar-track {
    border-radius: 10px;  
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