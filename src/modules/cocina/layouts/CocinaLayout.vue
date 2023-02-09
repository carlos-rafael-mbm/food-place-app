<template>
    <v-card
        class="mx-auto overflow-hidden"
        height="100vh">
        <v-layout>
            <v-app-bar color="#679a50" :elevation="10">
                <v-app-bar-nav-icon @click="drawer = !drawer" class="icon"></v-app-bar-nav-icon>
                <v-avatar size="small" class="imagen">
                    <img src="@/assets/logo.jpg" alt="" height="50">
                </v-avatar>
                <v-card class="texto" flat>Módulo de Cocina</v-card>
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
                    <v-list-item
                        prepend-icon="mdi-table-chair"
                        title="Entrantes"
                        value="entrantes"
                        active-class="bgGreenActive animate__animated animate__bounceIn"
                        density="compact"
                        class="bgGreen"
                        @click="$router.push({name: 'cocina-entrantes-view'})"></v-list-item>
                    <v-list-item
                        prepend-icon="mdi-food-fork-drink"
                        title="Atendidos"
                        value="atendido"
                        active-class="bgGreenActive animate__animated animate__animated animate__bounceIn"
                        density="compact"
                        class="bgGreen"
                        @click="$router.push({name: 'cocina-preparados-view'})"></v-list-item>
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
.bgGreen {
    background-color: lighten($color: #679a50, $amount: 30);
    color: #806752 !important;
    height: 10%;
    font-size: 1.8em;
    &:hover {
        background-color: lighten($color: #806752, $amount: 20);
        transition: 0.2s all ease-in;
        border: 2px solid #856826;
        color: lighten($color: #F1C40F, $amount: 10) !important;
    }
}
.bgGreenActive {
    background-color: lighten($color: #806752, $amount: 20);
    border: 2px solid #856826;
    color: lighten($color: #F1C40F, $amount: 10) !important;
    cursor: not-allowed;
    pointer-events: none;
}
.bgList {
    height: 100%;
    background-image: url('@/assets/img/sidebar-3.jpg');
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