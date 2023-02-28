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
                <div class="text-center titulo animate__animated animate__flipInY">
                    Relación de pedidos del día
                </div>
            </div>
        </div>
        <div class="justify-content-center align-items-center" style="margin-bottom: 100px">
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="order in orders"
                        :key="order.id"
                        :cols="widthScreen">
                        <v-card :class="order.state == 0 ? 'bg-solicitado' : order.state == 1 ? 'bg-en-proceso' : order.state == 2 || order.state == 5 ? 'bg-atendido' : order.state == 3 ? 'bg-cancelado' : 'bg-preparado'">
                            <v-card-title class="text-center" v-text="'MESA: ' + order.table.number"></v-card-title>
                            <v-card-subtitle v-text="'Fecha/hora: ' + order.order_time"></v-card-subtitle>
                            <div class="d-flex mb-2">
                                <v-card-subtitle style="font-weight: bold">Estado del pedido:</v-card-subtitle>
                                <v-spacer></v-spacer>
                                <v-card-subtitle
                                    style="font-weight: bold; border: solid; margin-right: 0.5rem;"
                                    v-text="order.state == 0 ? 'Solicitado' : order.state == 1 ? 'En proceso' : order.state == 2 ? 'Atendido' : order.state == 3 ? 'Anulado' : order.state == 5 ? 'Pagado' : 'Preparado'"></v-card-subtitle>
                            </div>
                            <div class="mx-10 mb-2 d-flex align-center justify-center">
                                <v-btn
                                    v-if="order.state == 4"
                                    prepend-icon="mdi-checkbox-marked-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="green"
                                    @click="atenderPedido(order.id)">
                                    Atendido
                                </v-btn>
                                <v-btn
                                    prepend-icon="mdi-eye-circle-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="brown"
                                    @click="verPedido(order.id)">
                                    Ver
                                </v-btn>
                                <v-btn
                                    v-if="order.state < 2"
                                    prepend-icon="mdi-square-edit-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="blue"
                                    @click="editarPedido(order.id, order.state)">
                                    Editar
                                </v-btn>
                                <v-btn
                                    v-if="order.state < 3"
                                    prepend-icon="mdi-close-box-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="red"
                                    @click="anularPedido(order.id)">
                                    Anular
                                </v-btn>
                                <v-btn
                                    prepend-icon="mdi-note-plus"
                                    class="mx-1"
                                    size="x-small"
                                    color="#605d35"
                                    @click="abrirNota(order.id, order.customization)">
                                    Notas
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
                            v-for="(item, i) in order_details"
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
                                    <div>
                                        <v-list-item-title class="titulo-menu" v-text="item.menu_detail.item_menu.name"></v-list-item-title>
                                        <v-list-item-subtitle class="subtitulo-menu" v-text="item.menu_detail.item_menu.category.name"></v-list-item-subtitle>
                                    </div>
                                    <v-spacer></v-spacer>
                                    <div v-if="toEdit" class="d-flex justify-content-right align-items-right">
                                        <div class="text-right texto-cantidad">
                                            <v-tooltip text="Disminuir unidades" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-if="estado <= 1 && item.state < 2" icon="mdi-minus-thick" size="25px" color="#856826" v-bind="props" @click="item.amount <= 1 ? item.amount = 1 : item.amount--; actualizarItem(item.id, item.amount)"></v-btn>
                                                </template>
                                            </v-tooltip>
                                            <input type="number" v-model="item.amount" min="1" max="1000" class="cantidad mx-1" readonly>
                                            <v-tooltip text="Aumentar unidades" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-if="estado <= 1 && item.state < 2" class="me-1" icon="mdi-plus-thick" size="25px" color="#856826" v-bind="props" @click="item.amount >= 1000 ? item.amount = 1000 : item.amount++; actualizarItem(item.id, item.amount)"></v-btn>
                                                </template>
                                            </v-tooltip>
                                            <v-tooltip text="Eliminar item de la orden" location="bottom">
                                                <template v-slot:activator="{ props }">
                                                    <v-btn v-if="estado <= 1 && item.state < 2" icon="mdi-trash-can" size="25px" color="#E75D48" v-bind="props" @click="eliminarItem(item.id)"></v-btn>
                                                </template>
                                            </v-tooltip>
                                        </div>
                                    </div>
                                    <div v-else class="d-flex justify-content-right align-items-right">
                                        <div style="margin-right: 0.3em">
                                            {{ item.amount }}
                                        </div>
                                        <div>
                                            <v-icon v-if="item.state == 0" icon="mdi-note-edit-outline" color="#343a40"></v-icon>
                                            <v-icon v-if="item.state == 1" icon="mdi-progress-clock" color="blue"></v-icon>
                                            <v-icon v-if="item.state == 2" icon="mdi-check-circle" color="#679a50"></v-icon>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                    <v-card-actions>
                        <v-btn color="white" variant="outlined" block @click="limpiar()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
    <v-row justify="space-around">
        <v-col cols="12">
            <v-dialog id="dlg-pedido" v-model="dialogNote" transition="dialog-bottom-transition" class="items-pedidos">
                <v-card color="#679a50">
                    <v-toolbar color="#679a50">
                        <div style="margin-left: 5%"><strong>Notas</strong></div>
                    </v-toolbar>
                    <v-list class="bg-dialog">
                        <div class="text-center mt-3">
                            <v-textarea
                                bg-color="amber-lighten-4"
                                class="mx-auto"
                                color="brown"
                                label="¿Deseas indicar algo más?"
                                no-resize
                                rows="6"
                                v-model="personalizacion">
                            </v-textarea>
                        </div>
                    </v-list>
                    <v-card-actions class="justify-center">
                        <v-btn color="white" variant="outlined" @click="guardarNota()">Guardar</v-btn>
                        <v-btn color="white" variant="outlined" @click="limpiarNota()">Cerrar</v-btn>
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
            widthScreen: window.innerWidth >= 800 ? 4 : window.innerWidth >= 600 ? 6 : 12,
            idInterval: 0,
            order_id: 0,
            dialog: false,
            dialogNote: false,
            toEdit: false,
            estado: 0,
            personalizacion: ''
        }
    },
    computed: {
        ...mapState('pedido', ['orders', 'order_details']),
        ...mapGetters('login', ['getUser'])
    },
    methods: {
        ...mapActions('pedido', ['loadOrdersToServe', 'loadOrderDetails', 'createOrderDetail', 'createAssignmentOrder', 'updateOrder', 'updateOrderDetail', 'deleteOrderDetail', 'clearOrderDetails']),
        getWidthScreen() {
            if (window.innerWidth >= 800) {
                this.widthScreen = 4
            } else if (window.innerWidth >= 600) {
                this.widthScreen = 6
            } else {
                this.widthScreen = 12
            }
        },
        abrirNota(id, nota) {
            this.order_id = id
            this.personalizacion = nota
            this.dialogNote = true
        },
        limpiarNota() {
            this.order_id = 0
            this.personalizacion = ''
            this.dialogNote = false
        },
        async guardarNota() {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const formData = new FormData()
            formData.append('customization', this.personalizacion)
            const res = await this.updateOrder([this.order_id, formData])
            this.order_id = 0
            this.personalizacion = ''
            if (res[0] != 0) {
                Swal.fire('Guardado', 'Se actualizó la nota de la orden', 'success')
            } else {
                Swal.fire('Error', 'No se pudo actualizar la nota de la orden', 'error')
            }
        },
        async anularPedido(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a anular una orden',
                showDenyButton: true,
                denyButtonColor: '#E75D48',
                denyButtonText: ' <i class="fa fa-thumbs-down"></i>  No, me equivoqué',
                confirmButtonColor: '#679A50',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i>  Sí, está bien',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                background: '#F7F5B2'
            })
            if (isConfirmed) {
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                let res = []
                const formData = new FormData()
                formData.append('state', 3)
                res = await this.updateOrder([id, formData])
                if (res[0] != 0) {
                    Swal.fire('Anulado', 'La orden fue anulada', 'success')
                } else {
                    Swal.fire('Error', 'La orden no pudo ser anulada', 'error')
                }
            }
        },
        async atenderPedido(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se culminará con el proceso de esta orden',
                showDenyButton: true,
                denyButtonColor: '#E75D48',
                denyButtonText: ' <i class="fa fa-thumbs-down"></i>  No, me equivoqué',
                confirmButtonColor: '#679A50',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i>  Sí, está bien',
                showClass: {
                    popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutUp'
                },
                background: '#F7F5B2'
            })
            if (isConfirmed) {
                new Swal({
                    title: 'Espere por favor',
                    allowOutsideClick: false
                })
                Swal.showLoading()
                await this.loadOrderDetails(id)
                if (this.order_details.some(detail => detail.state != 2)) {
                    Swal.fire('Error', 'Hay ítems que aún no han sido preparados', 'error')
                    return
                }
                const formData = new FormData()
                formData.append('state', 2)
                const res = await this.updateOrder([id, formData])
                const formAsignacion = new FormData()
                formAsignacion.append('order_id', id)
                formAsignacion.append('employee_id', this.getUser.employee.id)
                formAsignacion.append('process_id', 4)
                const resAsign = await this.createAssignmentOrder(formAsignacion)
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
                if (res[0] != 0) {
                    Swal.fire('Atendido', 'La orden fue entregada', 'success')
                } else {
                    Swal.fire('Error', 'Error al cambiar el estado de la orden a Atendida', 'error')
                }
            }
        },
        async verPedido(id) {
            this.order_id = id
            this.toEdit = false
            await this.loadOrderDetails(id)
            this.dialog = true
        },
        async editarPedido(id, estado) {
            this.order_id = id
            this.estado = estado
            this.toEdit = true
            await this.loadOrderDetails(id)
            this.dialog = true
        },
        async actualizarItem(id, cantidad) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            const formData = new FormData()
            formData.append('amount', cantidad)
            res = await this.updateOrderDetail([id, formData])
            if (res[0] != 0) {
                Swal.fire({
                    position: 'top-end',
                    text: 'Item de la orden actualizado',
                    color: 'white',
                    background: '#5AC855',
                    showConfirmButton: false,
                    timer: 1200
                })
            } else {
                Swal.fire({
                    position: 'top-end',
                    text: 'No se pudo actualizar el item',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
            }
        },
        async eliminarItem(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            try {
                await this.deleteOrderDetail(id)
                Swal.fire({
                    position: 'top-end',
                    text: 'Item eliminado',
                    color: 'white',
                    background: '#5AC855',
                    showConfirmButton: false,
                    timer: 1200
                })
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    text: 'No se pudo eliminar el item',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
            }
        },
        limpiar() {
            this.clearOrderDetails()
            this.order_id = 0
            this.toEdit = false
            this.dialog = false
        }
    },
    async mounted() {
        window.addEventListener("resize", this.getWidthScreen)
        await this.loadOrdersToServe(this.getUser.role.id == 1 || this.getUser.role.id == 9 ? 0 : this.getUser.employee.id)
        this.isLoading = false
        this.idInterval = setInterval(() => {
            this.loadOrdersToServe(this.getUser.role.id == 1 || this.getUser.role.id == 9 ? 0 : this.getUser.employee.id)
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
.bg-solicitado {
    background-color: rgba(241, 196, 15, 0.6);
}
.bg-en-proceso {
    background-color: rgba(99, 210, 218, 0.6);
}
.bg-atendido {
    background-color: rgba(103, 154, 80, 0.7);
}
.bg-cancelado {
    background-color: rgba(234, 150, 133, 0.7);
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
.v-expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
    padding: 5px 3px 10px 3px;
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
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
}
@media only screen and (max-width: 430px) {
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
    .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline-start: 5px;
        padding-inline-end: 5px;
    }
}
</style>