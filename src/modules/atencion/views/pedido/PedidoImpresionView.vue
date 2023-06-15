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
    <div v-else id="impresion-pedidos">
        <div class="d-flex justify-content-center align-items-center">
            <div class="mt-4 d-flex align-center flex-column">
                <v-card
                    title="Relación de pedidos del día"
                    class="text-center text-light titulo animate__animated animate__flipInY">
                </v-card>
            </div>
        </div>
        <div class="justify-content-center align-items-center" style="margin-bottom: 100px">
            <div class="justify-content-center align-items-center mt-4" style="margin-bottom: -12px">
                <div id="formulario" class="animate__animated animate__flipInY mx-auto">
                    <div class="justify-content-center align-items-center">
                        <v-select
                            v-model="table"
                            :items="getActiveTables()"
                            item-value="id"
                            item-title="number"
                            label="Seleccione una mesa"
                            variant="solo"
                            bg-color="#E3CD83"
                            return-object>
                        </v-select>
                    </div>
                </div>
            </div>
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="order in getOrdersByTable"
                        :key="order.id"
                        :cols="widthScreen">
                        <v-card class="bg-solicitado">
                            <v-card-title class="text-center" v-text="'MESA: ' + order.table.number"></v-card-title>
                            <v-card-subtitle v-text="'Fecha/hora: ' + order.order_time"></v-card-subtitle>
                            <div class="d-flex mb-2">
                                <v-card-subtitle style="font-weight: bold">Estado del pedido:</v-card-subtitle>
                                <v-spacer></v-spacer>
                                <v-card-subtitle
                                    style="font-weight: bold border: solid margin-right: 0.5rem"
                                    v-text="'Solicitado'"></v-card-subtitle>
                            </div>
                            <div class="mx-10 mb-2 d-flex align-center justify-center">
                                <v-btn
                                    prepend-icon="mdi-eye-circle-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="brown"
                                    @click="verPedido(order.id)">
                                    Ver
                                </v-btn>
                                <v-btn
                                    prepend-icon="mdi-printer"
                                    class="mx-1 text-light"
                                    size="x-small"
                                    color="#679a50"
                                    @click="imprimirComanda(order.id, order.state)">
                                    Comanda
                                </v-btn>
                                <v-btn
                                    v-if="listOrderIds.indexOf(order.id) == -1"
                                    prepend-icon="mdi-radiobox-blank"
                                    class="mx-1"
                                    size="x-small"
                                    color="blue"
                                    @click="agregarItems(order.id)">
                                    Seleccionar
                                </v-btn>
                                <v-btn
                                    v-if="listOrderIds.indexOf(order.id) >= 0"
                                    prepend-icon="mdi-check-circle-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="blue"
                                    @click="retirarItems(order.id)">
                                    Quitar selección
                                </v-btn>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <div class="d-flex justify-content-center align-items-center mt-4 animate__animated animate__flipInY" style="margin-bottom: -12px">
                <div class="mx-auto">
                    <v-btn
                        v-if="getOrdersByTable.length > 0"
                        prepend-icon="mdi-cash-multiple"
                        class="mx-1 text-white"
                        size="x-large"
                        color="#679a50"
                        @click="imprimirCuenta()">
                        Cuenta
                    </v-btn>
                </div>
            </div>
        </div>
    </div>
    <v-row justify="space-around">
        <v-col cols="12">
            <v-dialog id="dlgPedido" v-model="dialog" transition="dialog-bottom-transition" class="items-pedidos">
                <v-card color="#679a50">
                    <v-toolbar color="#679a50">
                        <div style="margin-left: 5%"><strong>Detalle de orden</strong></div>
                    </v-toolbar>
                    <v-list class="bgDialog">
                        <v-list-item
                            v-for="(item, i) in order_details"
                            :key="i"
                            :value="item"
                            class="itemList">
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
                                        <v-list-item-title class="tituloMenu" v-text="item.menu_detail.item_menu.name"></v-list-item-title>
                                        <v-list-item-subtitle class="subtituloMenu" v-text="item.menu_detail.item_menu.category.name"></v-list-item-subtitle>
                                    </div>
                                    <div class="d-flex justify-content-right align-items-right" style="width: 20%">
                                        <div>
                                            {{ item.amount }}
                                        </div>
                                        <v-spacer></v-spacer>
                                        <div class="text-right">
                                            S/ {{ item.price }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-list-item>
                        <div class="d-flex justify-content-right align-items-right">
                            <div class="texto-total">
                                Total del pedido:
                            </div>
                            <v-spacer></v-spacer>
                            <div class="total">
                                S/ {{ getTotal }}
                            </div>
                        </div>
                    </v-list>
                    <v-card-actions class="justify-center">
                        <v-btn prepend-icon="mdi-close-circle" color="white" variant="outlined" @click="limpiar()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <template style="display: none">
        <div id="print-template">
            <h1 style="text-align: center;">Comanda</h1>
            <ul style="list-style-type: none; margin: 0; padding: 0;">
                <li v-for="(item, index) in isPayment ? listOrderDetailsGroup : order_details" :key="index">
                    <span>{{ item.menu_detail.item_menu.name }}</span>
                    <span style="float: right;">{{ item.amount }}</span>
                </li>
            </ul>
        </div>
    </template>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    data() {
        return {
            isLoading: true,
            widthScreen: window.innerWidth >= 800 ? 4 : window.innerWidth >= 600 ? 6 : 12,
            listOrderIds: [],
            listOrderDetailsSelected: [],
            listOrderDetails: [],
            listOrderDetailsGroup: [],
            isPayment: false,
            dialog: false,
            table: null,
            montoIgv: 0,
            rucRestaurante: '',
            razonSocial: '',
            direccion: ''
        }
    },
    watch: {
        table(newValue, oldValue) {
            if (newValue != oldValue)
                this.cargarPedidos()
        }
    },
    computed: {
        ...mapState('pedido', ['orders', 'order_details']),
        ...mapState('parametro', ['parameters']),
        ...mapGetters('mesa', ['getActiveTables']),
        getOrdersByTable: function() {
            return this.table ? this.orders.filter(ord => ord.table.id == this.table.id) : []
        },
        getTotal: function() {
            return this.isPayment ? this.listOrderDetailsGroup.reduce((accumulator, object) => {
                return accumulator + (object.amount * object.price)
            }, 0) :
            this.order_details.reduce((accumulator, object) => {
                return accumulator + (object.amount * object.price)
            }, 0)
        },
        getTotalNoIGV: function() {
            return this.isPayment ? this.listOrderDetailsGroup.reduce((accumulator, object) => {
                return accumulator + (object.amount * ((object.price * 100) / (100 + this.montoIgv)))
            }, 0) :
            this.order_details.reduce((accumulator, object) => {
                return accumulator + (object.amount * ((object.price * 100) / (100 + this.montoIgv)))
            }, 0)
        }
    },
    methods: {
        ...mapActions('pedido', ['loadOrdersToPrint', 'loadOrderDetails', 'clearOrderComplete', 'clearOrderDetails']),
        ...mapActions('parametro', ['loadParameters']),
        ...mapActions('mesa', ['loadTables']),
        getWidthScreen() {
            if (window.innerWidth >= 800) {
                this.widthScreen = 4
            } else if (window.innerWidth >= 600) {
                this.widthScreen = 6
            } else {
                this.widthScreen = 12
            }
        },
        async agregarItems(id) {
            this.listOrderIds.push(id)
            await this.loadOrderDetails(id)
            for (const item of this.order_details)
                this.listOrderDetailsSelected.push(item)
        },
        retirarItems(id) {
            this.listOrderIds.splice(this.listOrderIds.indexOf(id), 1)
            this.listOrderDetailsSelected = [...this.listOrderDetailsSelected.filter(detail => detail.order.id != id)]
        },
        async cargarPedidos() {
            if (this.table) {
                this.listOrderIds = []
                this.listOrderDetailsSelected = []
                this.listOrderDetails = []
                this.listOrderDetailsGroup = []
                this.isPayment = false
                await this.loadOrdersToPrint()
            }
        },
        getOrdersDetailGroupByItem() {
            const res = this.listOrderDetails.reduce((accumulator, object) => {
                let idx = accumulator[0].indexOf(object.menu_detail.item_menu.id)
                if (idx > -1) {
                    accumulator[1][idx].amount += object.amount
                } else {
                    accumulator[0].push(object.menu_detail.item_menu.id);
                    accumulator[1].push(object);
                }
                return accumulator;
            }, [[],[]])
            this.listOrderDetailsGroup = Array.from(res[1])
        },
        async verPedido(id) {
            this.isPayment = false
            await this.loadOrderDetails(id)
            this.dialog = true
        },
        async imprimirComanda(id) {
            this.isPayment = false
            await this.loadOrderDetails(id)
            setTimeout(() => {
                const printTemplate = document.getElementById('print-template').innerHTML;
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printTemplate);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }, 1000); // Delay to ensure the data is fetched before printing
        },
        async imprimirCuenta() {
            this.isPayment = true
            this.listOrderDetails = []
            this.listOrderDetailsGroup = []
            for (const id of this.listOrderIds) {
                await this.loadOrderDetails(id)
                for (const item of this.order_details)
                    this.listOrderDetails.push(item)
            }
            this.getOrdersDetailGroupByItem()
            setTimeout(() => {
                const printTemplate = document.getElementById('print-template').innerHTML;
                const printWindow = window.open('', '_blank');
                printWindow.document.write(printTemplate);
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }, 1000); // Delay to ensure the data is fetched before printing
        },
        download(path, filename) {
            // Create a new link
            const anchor = document.createElement('a')
            anchor.href = path
            anchor.download = filename
            // Append to the DOM
            document.body.appendChild(anchor)
            // Trigger `click` event
            anchor.click()
            // Remove element from DOM
            document.body.removeChild(anchor)
        },
        limpiar() {
            this.dialog = false
            this.clearOrderDetails()
        }
    },
    async mounted() {
        window.addEventListener("resize", this.getWidthScreen)
        await this.loadParameters()
        let parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1002)
        this.razonSocial = parameterFound ? parameterFound.value : ''
        parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1001)
        this.rucRestaurante = parameterFound ? parameterFound.value : ''
        parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1003)
        this.direccion = parameterFound ? parameterFound.value : ''
        parameterFound = this.parameters.find(p => p.parameter_code == 1010 && p.item_code == 1011)
        this.montoIgv = parameterFound ? parseFloat(parameterFound.value) : 0
        await this.loadTables()
        this.isLoading = false
    },
    unmounted() {
        window.removeEventListener("resize", this.getWidthScreen)
    }
}
</script>

<style lang="scss" scoped>
#impresion-pedidos {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Ate.png');
    background-size: cover;
}
.titulo {
    background-color: rgba(241, 196, 15, 0.6);
    border: 4px solid #856826;
    border-radius: 20px;
    width: 300px;
    font-size: large;
}
#formulario {
    width: 40%;
}
.bg-solicitado {
    background-color: rgba(241, 196, 15, 0.6);
}
.bgDialog {
    background-color: lighten($color: #F1C40F, $amount: 32);
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
    overflow-y: auto;
    z-index: 1000 !important;
}
.itemList {
    border-bottom: 1px solid;
    background-color: rgba(133, 104, 38, 0.5);
    margin: 1% 0%;
}
.texto-total {
    margin-left: 7%;
}
.total {
    margin-right: 7%;
}
.tituloMenu {
    font-size: 1em;
}
.subtituloMenu {
    font-size: 0.9em;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#impresion-pedidos::-webkit-scrollbar {
    -webkit-appearance: none;
}
#impresion-pedidos::-webkit-scrollbar:vertical {
    width:1px;
}
#impresion-pedidos::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#impresion-pedidos::-webkit-scrollbar:horizontal {
    height: 10px;
}
#impresion-pedidos::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3
}
#impresion-pedidos::-webkit-scrollbar-track {
    border-radius: 10px;
}
.bgDialog::-webkit-scrollbar {
    -webkit-appearance: none;
}
.bgDialog::-webkit-scrollbar:vertical {
    width: 1px;
}
.bgDialog::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.bgDialog::-webkit-scrollbar:horizontal {
    height: 10px;
}
.bgDialog::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3
}
.bgDialog::-webkit-scrollbar-track {
    border-radius: 10px;
}
@media only screen and (max-width: 850px) {
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    #formulario {
        width: 70%;
    }
}
@media only screen and (max-width: 430px) {
    #formulario {
        width: 92%;
    }
    .itemList {
        font-size: 0.8em;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .tituloMenu {
        font-size: 1.1em;
    }
    .subtituloMenu {
        font-size: 1em;
    }
}
</style>