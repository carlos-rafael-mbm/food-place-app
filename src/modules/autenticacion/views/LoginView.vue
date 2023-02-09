<template>
    <div id="bgAuth">
        <div class="d-flex vh-100 justify-content-center align-items-center">
            <div class="text-center formulario">
                <v-card class="card pa-7">
                    <v-form
                        v-model="form"
                        @submit.prevent="onSubmit">
                        <v-text-field
                            v-model="user.username"
                            :readonly="loading"
                            :rules="[rules.required]"
                            @keyup="lowercase()"
                            class="mb-2"
                            color="brown"
                            clearable
                            prepend-inner-icon="mdi-account"
                            label="Usuario"
                            placeholder="Ingresa tu usuario"></v-text-field>
                        <v-text-field
                            v-model="user.password"
                            :readonly="loading"
                            :rules="[rules.required]"
                            color="brown"
                            clearable
                            prepend-inner-icon="mdi-lock-outline"
                            label="Contraseña"
                            type="password"
                            placeholder="Ingresa la contraseña"></v-text-field>
                        <br>
                        <v-btn
                            :disabled="!form"
                            :loading="loading"
                            block
                            color="#856826"
                            class="text-white"
                            size="large"
                            type="submit"
                            variant="elevated">
                            Ingresar
                        </v-btn>
                    </v-form>
                </v-card>
            </div>
            
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import Swal from "sweetalert2"

export default {
    data() {
        return {
            form: false,
            user: {
                username: null,
                password: null
            },
            loading: false,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
        }
    },
    methods: {
        ...mapActions('login', ['signInUser']),
        lowercase() {
            this.user.username = this.user.username.toLowerCase();
        },
        async onSubmit () {
            if (!this.form) return
            this.loading = true
            const { ok, message } = await this.signInUser(this.user)
            if (!ok) {
                this.loading = false
                Swal.fire('Error', message, 'error')
            } else {
                this.loading = false
                this.$router.push({name: 'home'})
            }
        }
    }
}
</script>

<style lang="scss" scoped>
#bgAuth {
    height: 100vh;
    display: block;
    background: url('@/assets/login.png');
    background-size: cover;
}
.formulario {
    width: 100%;
    margin-left: 36%;
    margin-right: 36%;
}
.card {
    background-color: rgba(90, 200, 85, 0.6);
}
@media (max-width: 1050px) {
    .formulario {
        margin-left: 27%;
        margin-right: 27%;
    }
}
@media (max-width: 650px) {
    .formulario {
        margin-left: 10%;
        margin-right: 10%;
    }
}
</style>