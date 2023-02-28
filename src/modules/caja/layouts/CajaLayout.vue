<template>
    <v-card
        class="mx-auto overflow-hidden"
        height="100vh">
        <v-layout>
            <v-app-bar color="#E3CD83" :elevation="10">
                <v-app-bar-nav-icon @click="drawer = !drawer" class="icon"></v-app-bar-nav-icon>
                <v-avatar size="small" class="imagen">
                    <img src="@/assets/logo.jpg" alt="" height="50">
                </v-avatar>
                <v-card class="texto" flat>Módulo de Caja</v-card>
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
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-lock-open-outline"
                        title="Apertura"
                        value="apertura"
                        active-class="bg-cream-active animate__animated animate__bounceIn"
                        density="compact"
                        class="bg-cream"
                        @click="$router.push({name: 'caja-beginning-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-swap-horizontal"
                        title="Movimientos E/S"
                        value="movimientos"
                        active-class="bg-cream-active animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bg-cream"
                        @click="$router.push({name: 'caja-movement-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-cash-multiple"
                        title="Cobro"
                        value="cobro"
                        active-class="bgBrownActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bg-cream"
                        @click="$router.push({name: 'caja-cobro-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-state-machine"
                        title="Estado de caja"
                        value="estado_caja"
                        active-class="bg-cream-active animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bg-cream"
                        @click="$router.push({name: 'caja-consultation-view'})"></v-list-item>
                    <v-list-item
                        v-if="user.role && (user.role.id == 1 || user.role.id == 9)"
                        prepend-icon="mdi-lock-outline"
                        title="Cierre"
                        value="cierre"
                        active-class="bg-cream-active animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bg-cream"
                        @click="$router.push({name: 'caja-closing-view'})"></v-list-item>
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
.bg-cream {
    background-color: lighten($color: #F1C40F, $amount: 34);
    color: #437412 !important;
    &:hover {
        background-color: lighten($color: #679A50, $amount: 20);
        transition: 0.2s all ease-in;
        border: 2px solid #679A50;
        color: #856826 !important;
    }
}
.bg-cream-active {
    background-color: lighten($color: #679A50, $amount: 20);
    border: 2px solid #679A50;
    color: #856826 !important;
    cursor: not-allowed;
    pointer-events: none;
}
.bg-list {
    height: 100%;
    background-image: url('@/assets/img/sidebar-5.jpg');
}
.texto {
    background-color: transparent !important;
    font-weight: bold;
    margin-left: 5px;
}
.usuario {
    border-bottom: 1px solid;
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