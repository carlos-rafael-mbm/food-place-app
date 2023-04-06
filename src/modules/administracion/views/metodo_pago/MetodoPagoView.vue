<template>
    <div class="row justify-content-center align-items-center" style="height: 90vh" v-if="isLoading">
        <div class="col-auto text-center mt-5" style="font-size: 2.5em">
            Espere por favor...
            <h3 class="mt-2">
                <v-progress-circular
                    indeterminate
                    size="100"
                    width="12"
                    color="green">
                </v-progress-circular>
            </h3>
        </div>
    </div>
    <div v-else id="metodo-pago">
        <div class="mx-2 row justify-content-center align-items-center" style="padding-bottom: 100px">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Lista de Métodos de pago"
                    class="text-center text-light titulo animate__animated animate__flipInX"
                ></v-card>
            </div>
            <v-card
                class="mx-auto pa-2 payment-method-list animate__animated animate__flipInY"
                max-width="400">
                <v-list class="lista">
                    <v-list-item
                        v-for="(item, i) in getPaymentMethods"
                        :key="i"
                        :value="item"
                        :active="false"
                        class="item-list"
                        rounded="xl">
                            <div class="d-flex">
                                <div class="d-flex align-items-center">
                                    <v-avatar>
                                        <v-img
                                            alt="payment-avatar"
                                            :src="item.image"></v-img>
                                    </v-avatar>
                                </div>
                                <div class="d-flex justify-content-center align-items-center" style="width: 100%">
                                    <div class="text-center">
                                        <v-list-item-title v-text="item.method"></v-list-item-title>
                                    </div>
                                </div>
                                <v-checkbox
                                    color="brown"
                                    hide-details
                                    v-model="item.state"
                                    @change="changeState(item.id, item.state)">
                                </v-checkbox>
                            </div>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Swal from "sweetalert2"

export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            payment_method: {
                id: 0,
                method: '',
                image: '',
                state: true
            }
        }
    },
    computed: {
        ...mapState('metodo_pago', ['payment_methods', 'isLoading']),
        getPaymentMethods() {
            this.payment_methods.map(x => x.state = x.state == 1 ? true : false)
            return this.payment_methods
        }
    },
    methods: {
        ...mapActions('metodo_pago', ['loadPaymentMethods', 'updatePaymentMethod']),
        async changeState(id, state) {
            const formData = new FormData()
            formData.append('state', state ? 1 : 0)
            const res = await this.updatePaymentMethod([id, formData])
            if (res[0] != 0) {
                Swal.fire('Guardado', state ? 'Método de pago activado' : 'Método de pago desactivado', 'success')
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        }
    },
    async mounted() {
        await this.loadPaymentMethods()
    }
}
</script>

<style lang="scss" scoped>
.payment-method-list {
    background-color: rgba(241, 196, 15, 0.6);
    width: 67%;
    border-radius: 20px;
}
.lista {
    background-color: rgba(241, 196, 15, 0.4);
}
.item-list {
    border: 1px solid;
    background-color: rgba(133, 104, 38, 0.6);
    margin: 3% 5%;
}
#metodo-pago {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 340px;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#metodo-pago::-webkit-scrollbar {
    -webkit-appearance: none;
}
#metodo-pago::-webkit-scrollbar:vertical {
    width:1px;
}
#metodo-pago::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#metodo-pago::-webkit-scrollbar:horizontal {
    height: 10px;
}
#metodo-pago::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#metodo-pago::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 500px) {
    .payment-method-list {
        width: 95%;
    }
}
</style>