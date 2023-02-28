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
    <div v-else id="nuevo-pedido">
        <div class="d-flex justify-content-center align-items-center">
            <div class="my-3 col-auto align-center">
                <div class="text-center titulo animate__animated animate__flipInY">
                    Selecciona una mesa
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <div class="col-auto text-center slide-table">
                <v-slide-group
                    v-model="opciones"
                    center-active
                    show-arrows>
                    <v-slide-group-item
                        v-for="tbl in tablesOrdered"
                        :key="tbl.id"
                        v-slot="{ isSelected, toggle }">
                        <v-card
                            :class="isSelected ? 'seleccionado' : 'no-seleccionado'"
                            class="ma-3"
                            height="100"
                            width="100"
                            :disabled="tbl.state == 1 ? false : true"
                            @click="toggle(); this.cargarMesa(tbl.id, tbl.number, isSelected);">
                            <div class="justify-content-center align-items-center" style="height: 100%">
                                <div class="mt-2 text-center">
                                    <p>Mesa:</p>
                                    <p>{{tbl.number}}</p>
                                </div>
                            </div>
                        </v-card>
                    </v-slide-group-item>
                </v-slide-group>
            </div>
        </div>
        <div class="d-flex justify-content-center align-items-center">
            <div class="my-3 col-auto align-center">
                <div class="text-center titulo animate__animated animate__flipInY">
                    Realiza el pedido
                </div>
            </div>
        </div>
        <div class="justify-content-center align-items-center">
            <v-expansion-panels class="mx-auto panel-active-menu-global" multiple v-model="itemsMenu">
                <v-expansion-panel class="panel-active-menu animate__animated animate__flipInY" v-for="category in categories" :key="category.id">
                    <v-expansion-panel-title>
                        <template v-slot:default>
                            <v-row no-gutters>
                                <v-col cols="6" class="d-flex justify-start">
                                    {{ category.name }}
                                </v-col>
                                <v-col v-if="category.is_block == 1" cols="6" class="text-brown text-right">
                                    <input type="number" v-model="category.amount" min="0" max="1000" class="cantidad me-5">
                                </v-col>
                            </v-row>
                        </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <div v-if="category.is_block == 1" class="d-flex justify-content-center align-items-center">
                            <v-btn style="font-size: small" class="me-1 mb-2" prepend-icon="mdi-minus-thick" color="#856826" @click="category.amount <= 0 ? category.amount = 0 : category.amount--; disminuirEnBloque(category.id, category.amount)">Disminuir</v-btn>
                            <v-btn style="font-size: small"  class="ms-1 mb-2" prepend-icon="mdi-plus-thick" color="#856826" @click="category.amount >= 1000 ? category.amount = 1000 : category.amount++; aumentarEnBloque(category.id, category.amount)">Aumentar</v-btn>
                        </div>
                        <v-card
                            class="mx-auto table-list"
                            max-height="400">
                            <v-list class="lista">
                                <v-list-item
                                    v-for="(item, i) in getActiveMenuByCategory(category.id)"
                                    :key="i"
                                    :value="item"
                                    class="item-list">
                                    <template v-slot:default>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <div class="left-control me-1">
                                                <v-avatar v-if="item.item_menu.image" size="x-small">
                                                    <v-img
                                                        :src="item.item_menu.image"
                                                        alt="item-menu"
                                                        cover>
                                                    </v-img>
                                                </v-avatar>
                                                <v-avatar v-else size="x-small">
                                                    <v-icon icon="mdi-cancel"></v-icon>
                                                </v-avatar>
                                            </div>
                                            <div>
                                                <v-list-item-title class="titulo-menu" v-text="item.item_menu.name"></v-list-item-title>
                                                <!-- <v-list-item-subtitle class="subtitulo-menu" v-text="item.item_menu.category.name"></v-list-item-subtitle> -->
                                            </div>
                                            <v-spacer></v-spacer>
                                            <div class="d-flex justify-content-right align-items-right">
                                                <div class="text-right texto-cantidad">
                                                    <v-btn class="me-1" icon="mdi-minus-thick" size="25px" color="#856826" @click="item.amount <= 0 ? item.amount = 0 : item.amount--"></v-btn>
                                                    <input type="number" v-model="item.amount" min="0" max="1000" class="cantidad">
                                                    <v-btn class="ms-1" icon="mdi-plus-thick" size="25px" color="#856826" @click="item.amount >= 1000 ? item.amount = 1000 : item.amount++"></v-btn>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
            <div class="text-center mt-3">
                <v-textarea
                    bg-color="amber-lighten-4"
                    class="mx-auto area-custom"
                    color="brown"
                    label="¿Deseas indicar algo más?"
                    no-resize
                    rows="3"
                    v-model="personalizacion">
                </v-textarea>
            </div>
            <div class="text-center" style="margin-bottom: 100px">
                <v-btn icon="mdi-receipt-text-check" class="mx-2" color="#F1C40F" rounded @click="crearPedido()">
                    <v-icon>mdi-receipt-text-check</v-icon>
                    <v-tooltip
                        activator="parent"
                        location="bottom">
                        Confirmar pedido
                    </v-tooltip>
                </v-btn>
            </div>
        </div>
    </div>
    <v-row justify="space-around">
        <v-col cols="12">
            <v-dialog v-model="dialog" transition="dialog-bottom-transition" class="items-pedidos">
                <v-card color="#679a50">
                    <v-toolbar color="#679a50">
                        <div style="margin-left: 4%"><strong>Mesa: {{ mesa_number }}</strong></div>
                        <v-spacer></v-spacer>
                        <div style="margin-right: 4%"><strong>{{ fecha }}</strong></div>
                    </v-toolbar>
                    <v-list class="bgDialog">
                        <v-list-item
                            v-for="(item, i) in items"
                            :key="i"
                            :value="item"
                            class="item-list">
                            <template v-slot:default>
                                <div class="d-flex justify-content-center align-items-center">
                                    <div class="me-1">
                                        <v-avatar v-if="item.item_menu.image" size="x-small">
                                            <v-img
                                                :src="item.item_menu.image"
                                                alt="item-menu"
                                                cover>
                                            </v-img>
                                        </v-avatar>
                                        <v-avatar v-else size="x-small">
                                            <v-icon icon="mdi-cancel"></v-icon>
                                        </v-avatar>
                                    </div>
                                    <div>
                                        <v-list-item-title class="titulo-menu" v-text="item.item_menu.name"></v-list-item-title>
                                        <v-list-item-subtitle class="subtitulo-menu" v-text="item.item_menu.category.name"></v-list-item-subtitle>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div class="mx-4 d-flex justify-content-right align-items-right">
                                        {{ item.amount }}
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
import Swal from 'sweetalert2'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    data() {
        return {
            isLoading: true,
            tablesOrdered: null,
            opciones: [],
            mesa_id: 0,
            mesa_number: '',
            personalizacion: '',
            categories: [],
            dialog: false,
            fecha: null,
            items: [],
            itemsMenu: []
        }
    },
    computed: {
        ...mapState('mesa', ['tables']),
        ...mapState('pedido', ['active_menu']),
        ...mapGetters('mesa', ['getTablesInOrder']),
        ...mapGetters('login', ['getUser'])
    },
    methods: {
        ...mapActions('mesa', ['loadTables']),
        ...mapActions('pedido', ['loadActiveMenu', 'createOrder', 'createOrderDetail', 'createAssignmentOrder', 'clearOrderComplete']),
        getActiveMenuByCategory(id) {
            return this.active_menu.filter(item => item.item_menu.category.id == id)
        },
        disminuirEnBloque(id, amount) {
            this.active_menu.map(item => {if (item.item_menu.category.id == id) item.amount = amount})
        },
        aumentarEnBloque(id, amount) {
            this.active_menu.map(item => {if (item.item_menu.category.id == id) item.amount = amount})
        },
        cargarMesa(id, number, isSelected) {
            this.mesa_id = !isSelected? id : 0
            this.mesa_number = number
        },
        async crearPedido() {
            if (this.mesa_id == 0) {
                Swal.fire('Error', 'Debe seleccionar una mesa', 'error')
                return
            }
            let tieneCantidades = this.active_menu.some(x => x.amount > 0)
            if (!tieneCantidades) {
                Swal.fire('Error', 'No se agregaron ítems al pedido', 'error')
                return
            }
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            let hasError = false
            let order_id = 0
            const formData = new FormData()
            formData.append('state', 0)
            formData.append('table_id', this.mesa_id)
            if (this.personalizacion)
                formData.append('customization', this.personalizacion)
            res = await this.createOrder(formData)
            order_id = res[0]
            if (res[0] != 0) {
                for (const item of this.active_menu) {
                    if (item.amount > 0) {
                        let formDetalle = new FormData()
                        formDetalle.append('price', item.selling_price)
                        formDetalle.append('amount', item.amount)
                        formDetalle.append('state', 0)
                        formDetalle.append('order_id', order_id)
                        formDetalle.append('menu_detail_id', item.id)
                        let resDetalle = await this.createOrderDetail(formDetalle)
                        if (resDetalle[0] == 0) {
                            hasError = true
                            await Swal.fire({
                                position: 'top-end',
                                text: `El ítem ${item.item_menu.name} no se agregó al pedido`,
                                color: 'white',
                                background: '#D96E4C',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                        this.items.push(item)
                    }
                }
                let formAsignacion = new FormData()
                formAsignacion.append('order_id', order_id)
                formAsignacion.append('employee_id', this.getUser.employee.id)
                formAsignacion.append('process_id', 1)
                let resAsign = await this.createAssignmentOrder(formAsignacion)
                if (resAsign[0] == 0) {
                    await Swal.fire({
                        position: 'top-end',
                        text: 'Error al asignar mozo',
                        color: 'white',
                        background: 'red',
                        showConfirmButton: false,
                        timer: 1200
                    })
                }
                if (hasError) {
                    Swal.fire('Error', 'El pedido se creó con errores', 'error')
                } else {
                    await Swal.fire('Guardado', 'Orden registrada correctamente', 'success')
                    this.fecha = new Date(Date.now()).toLocaleString()
                    this.dialog = true
                }
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async limpiar() {
            this.mesa_id = 0
            this.mesa_number = ''
            this.personalizacion = ''
            this.opciones = []
            this.active_menu.map(x => x.amount = 0)
            this.categories.map(x => x.amount = 0)
            this.clearOrderComplete()
            this.itemsMenu = []
            this.items = []
            this.dialog = false
        }
    },
    async mounted() {
        await this.loadTables()
        await this.loadActiveMenu()
        await this.clearOrderComplete()
        const map = new Map()
        for (const item of this.active_menu) {
            if(!map.has(item.item_menu.category.id)){
                map.set(item.item_menu.category.id, true)    // set any value to Map
                const nuevo = item.item_menu.category
                nuevo.amount = 0
                this.categories.push(nuevo)
            }
        }
        this.tablesOrdered = await this.getTablesInOrder()
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
#nuevo-pedido {
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
}
.seleccionado {
    background-color: rgba(103, 154, 80, 0.7);
    font-size: 1em;
    font-weight: bold;
}
.no-seleccionado {
    background-color: rgba(241, 196, 15, 0.6);
    border: 1px solid;
    font-size: 1em;
    font-weight: bold;
}
.slide-table {
    width: 70%;
}
.table-list {
    background-color: rgba(241, 196, 15, 0.3);
    width: 100%;
    overflow-y: auto;
}
.area-custom {
    width: 45%;
}
.lista {
    background-color: rgba(67, 116, 18, 0.5);
}
.item-list {
    border-bottom: 1px solid;
    // background-color: rgba(133, 104, 38, 0.6);
    margin: 1% 0px;
}
.cantidad {
    width: 25%;
    text-align: right;
}
.texto-cantidad {
    font-size: 0.8em;
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
}
.bgDialog {
    background-color: lighten($color: #F1C40F, $amount: 32);
}
.titulo-menu {
    font-size: 1em;
}
.subtitulo-menu {
    font-size: 0.9em;
}
.panel-active-menu-global {
    width: 50%;
}
.panel-active-menu {
    // background-color: rgba(246, 242, 116, 0.2);
    background-color: rgba(241, 196, 15, 0.6);
    width: 100%;
    border-radius: 20px;
    color: black;
}
.v-expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
    padding: 5px 5px 10px 5px;
}
.v-list {
    padding: 0px;
}
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
    padding-inline-start: 16px;
    padding-inline-end: 16px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#nuevo-pedido::-webkit-scrollbar {
    -webkit-appearance: none;
}
#nuevo-pedido::-webkit-scrollbar:vertical {
    width:1px;
}
#nuevo-pedido::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#nuevo-pedido::-webkit-scrollbar:horizontal {
    height: 10px;
}
#nuevo-pedido::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#nuevo-pedido::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.table-list::-webkit-scrollbar {
    -webkit-appearance: none;
}
.table-list::-webkit-scrollbar:vertical {
    width: 6px;
}
.table-list::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.table-list::-webkit-scrollbar:horizontal {
    height: 10px;
}
.table-list::-webkit-scrollbar-thumb {
    background-color: rgba(67, 116, 18, 0.5);
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
.table-list::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.bgDialog::-webkit-scrollbar {
    -webkit-appearance: none;
}
.bgDialog::-webkit-scrollbar:vertical {
    width:1px;
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
    // border: 1px solid #f1f2f3;
}
.bgDialog::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 850px) {
    .slide-table {
        width: 92%;
    }
    .area-custom {
        width: 92%;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .texto-cantidad {
        font-size: 0.9em;
    }
    .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline-start: 7px;
        padding-inline-end: 7px;
    }
}
@media only screen and (max-width: 430px) {
    .item-list {
        font-size: 0.8em;
        margin: 1% 0;
    }
    .cantidad {
        width: 20%;
    }
    .texto-cantidad {
        font-size: 0.9em;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .titulo-menu {
        font-size: 1.2em;
    }
    .subtitulo-menu {
        font-size: 1.05em;
    }
    .panel-active-menu-global {
        width: 97%;
    }
    .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline-start: 7px;
        padding-inline-end: 7px;
    }
}
</style>