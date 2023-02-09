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
    <div v-else id="pedidos">
        <div class="d-flex justify-content-center align-items-center">
            <div class="mt-4 col-auto align-center">
                <div class="text-center titulo animate__animated animate__flipInY" style="font-weight: bold">
                    Relación de pedidos despachados
                </div>
            </div>
        </div>
        <div class="justify-content-center align-items-center" style="margin-bottom: 100px">
            <div class="justify-content-center align-items-center mt-4" style="margin-bottom: -12px">
                <div id="formulario" class="animate__animated animate__flipInY mx-auto">
                    <div class="justify-content-center align-items-center">
                        <v-combobox
                            v-model="preparation_area"
                            :items="getActivePreparationAreas()"
                            item-value="id"
                            item-title="name"
                            label="Seleccione un área de preparación"
                            variant="solo"
                            bg-color="#679a50"
                            :change="cargarPedidos()">
                        </v-combobox>
                    </div>
                </div>
            </div>
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="order in getFilteredOrders"
                        :key="order.id"
                        :cols="widthScreen">
                        <v-card :class="order.state == 2 || order.state == 5 ? 'bg-atendido' : 'bg-preparado'">
                            <v-card-title class="text-center" v-text="'MESA: ' + order.table.number"></v-card-title>
                            <v-card-subtitle v-text="'Fecha/hora: ' + order.order_time" style="font-weight: bold"></v-card-subtitle>
                            <div class="d-flex mb-2">
                                <v-card-subtitle style="font-weight: bold">Estado del pedido:</v-card-subtitle>
                                <v-spacer></v-spacer>
                                <v-card-subtitle
                                    style="font-weight: bold; border: solid; margin-right: 0.5rem;"
                                    v-text="order.state == 2 || order.state == 5 ? 'Atendido' : 'Preparado'">
                                </v-card-subtitle>
                            </div>
                            <div class="mx-10 mb-2 d-flex align-center justify-center">
                                <v-btn
                                    prepend-icon="mdi-eye-circle-outline"
                                    class="mx-1"
                                    size="small"
                                    color="brown"
                                    @click="verPedido(order.id, order.customization)">
                                    Ver
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
    <v-row justify="space-around">
        <v-col cols="12">
            <v-dialog id="dlg-pedido" v-model="dialog" transition="dialog-bottom-transition" class="items-pedidos">
                <v-card color="#679a50">
                    <v-toolbar color="#679a50">
                        <div style="margin-left: 5%"><strong>Detalle de orden</strong></div>
                    </v-toolbar>
                    <v-list class="bg-dialog">
                        <v-list-item
                            v-for="(item, i) in getOrdersDetailByPreparationArea"
                            :key="i"
                            :value="item"
                            class="item-list">
                            <template v-slot:default>
                                <div class="d-flex justify-content-center align-items-center">
                                    <div class="me-1">
                                        <v-avatar v-if="item.menu_detail.item_menu.image" size="x-small">
                                            <v-img
                                                :src="item.menu_detail.item_menu.image"
                                                alt="item-menu"
                                                cover>
                                            </v-img>
                                        </v-avatar>
                                        <v-avatar v-else size="x-small">
                                            <v-icon icon="mdi-cancel"></v-icon>
                                        </v-avatar>
                                    </div>
                                    <div style="width: 70%">
                                        <v-list-item-title class="titulo-menu" v-text="item.menu_detail.item_menu.name"></v-list-item-title>
                                        <v-list-item-subtitle class="subtitulo-menu" v-text="item.menu_detail.item_menu.category.name"></v-list-item-subtitle>
                                    </div>
                                    <div class="d-flex justify-content-right align-items-right" style="width: 20%">
                                        <div>
                                            {{ item.amount }}
                                        </div>
                                        <v-spacer></v-spacer>
                                        <div>
                                            <v-icon v-if="item.state == 0" icon="mdi-progress-clock" color="blue"></v-icon>
                                            <v-icon v-else icon="mdi-check-circle" color="#679a50"></v-icon>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-list-item>
                        <div v-if="personalizacion" class="text-center mt-2">
                            <strong>Nota: </strong> {{ personalizacion }}
                        </div>
                    </v-list>
                    <v-card-actions>
                        <v-btn color="white" variant="outlined" block @click="limpiar()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    data() {
        return {
            isLoading: true,
            widthScreen: window.innerWidth >= 800 ? 4 : window.innerWidth >= 600 ? 6 : 12,
            idInterval: 0,
            order_id: 0,
            dialog: false,
            preparation_area: null,
            personalizacion: ''
        }
    },
    computed: {
        ...mapState('pedido', ['orders', 'order_details']),
        ...mapGetters('area_preparacion', ['getActivePreparationAreas']),
        ...mapGetters('login', ['getUser']),
        getFilteredOrders: function() {
            return this.orders.filter(ord => ord.state == 2 || ord.state == 4 || ord.state == 5)
        },
        getOrdersDetailByPreparationArea: function() {
            return [...this.order_details.filter(ord => ord.menu_detail.item_menu.preparation_area.id == this.preparation_area.id)]
        }
    },
    methods: {
        ...mapActions('pedido', ['loadOrdersByPreparationArea', 'loadOrderDetails', 'clearOrderDetails', 'clearOrderComplete']),
        ...mapActions('area_preparacion', ['loadPreparationAreas']),
        getWidthScreen() {
            if (window.innerWidth >= 800) {
                this.widthScreen = 4
            } else if (window.innerWidth >= 600) {
                this.widthScreen = 6
            } else {
                this.widthScreen = 12
            }
        },
        async cargarPedidos() {
            if (this.preparation_area) {
                await this.loadOrdersByPreparationArea(this.preparation_area.id)
            }
        },
        async verPedido(id, nota) {
            this.order_id = id
            this.personalizacion = nota
            await this.loadOrderDetails(id)
            this.dialog = true
        },
        limpiar() {
            this.clearOrderDetails()
            this.order_id = 0
            this.dialog = false
        }
    },
    async mounted() {
        window.addEventListener("resize", this.getWidthScreen)
        await this.loadPreparationAreas()
        await this.clearOrderComplete()
        this.isLoading = false
        this.idInterval = setInterval(() => {
            if (this.preparation_area) {
                this.loadOrdersByPreparationArea(this.preparation_area.id)
            }
            if (this.order_id) {
                this.loadOrderDetails(this.order_id)
            }
        }, 1000 * 30);
    },
    unmounted() {
        window.removeEventListener("resize", this.getWidthScreen)
        clearInterval(this.idInterval)
    }
}
</script>

<style lang="scss" scoped>
#pedidos {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Cocina.png');
    background-size: cover;
}
#formulario {
    width: 40%;
}
.titulo {
    background-color: rgba(133, 104, 38, 0.8);
    border: 3px solid #F1C40F;
    border-radius: 20px;
    width: 300px;
    font-size: large;
}
.bg-atendido {
    background-color: rgba(103, 154, 80, 0.7);
}
.bg-preparado {
    background-color: rgba(230, 178, 239, 0.7);
}
.bg-dialog {
    background-color: lighten($color: #F1C40F, $amount: 32);
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
    overflow-y: auto;
    z-index: 1000 !important;
}
.item-list {
    border-bottom: 1px solid;
    background-color: rgba(133, 104, 38, 0.5);
    margin: 1% 0px;
}
.texto-cantidad {
    font-size: 0.7em;
}
.cantidad {
    width: 25%;
    text-align: right;
}
.tableList {
    background-color: rgba(241, 196, 15, 0.3);
    overflow-y: auto;
}
.lista {
    background-color: rgba(67, 116, 18, 0.5);
}
.titulo-menu {
    font-size: 1em;
}
.subtitulo-menu {
    font-size: 0.9em;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#pedidos::-webkit-scrollbar {
    -webkit-appearance: none;
}
#pedidos::-webkit-scrollbar:vertical {
    width:1px;
}
#pedidos::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#pedidos::-webkit-scrollbar:horizontal {
    height: 10px;
}
#pedidos::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#pedidos::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.bg-dialog::-webkit-scrollbar {
    -webkit-appearance: none;
}
.bg-dialog::-webkit-scrollbar:vertical {
    width:1px;
}
.bg-dialog::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.bg-dialog::-webkit-scrollbar:horizontal {
    height: 10px;
}
.bg-dialog::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
.bg-dialog::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 850px) {
    #formulario {
        width: 70%;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
}
@media only screen and (max-width: 430px) {
    #formulario {
        width: 92%;
    }
    .item-list {
        font-size: 0.8em;
        margin: 1% 0%;
    }
    .cantidad {
        width: 15%;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .titulo-menu {
        font-size: 1.1em;
    }
    .subtitulo-menu {
        font-size: 1em;
    }
}
</style>