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
                        <v-combobox
                            v-model="table"
                            :items="getActiveTables()"
                            item-value="id"
                            item-title="number"
                            label="Seleccione una mesa"
                            variant="solo"
                            bg-color="#E3CD83">
                        </v-combobox>
                    </div>
                </div>
            </div>
            <v-container fluid>
                <v-row dense>
                    <v-col
                        v-for="order in getOrdersByTable"
                        :key="order.id"
                        :cols="widthScreen">
                        <v-card :class="order.state == 0 ? 'bg-solicitado' : order.state == 1 ? 'bg-en-proceso' : order.state == 2 || order.state == 5 ? 'bg-atendido' : order.state == 3 ? 'bg-cancelado' : 'bg-preparado'">
                            <v-card-title class="text-center" v-text="'MESA: ' + order.table.number"></v-card-title>
                            <v-card-subtitle v-text="'Fecha/hora: ' + order.order_time"></v-card-subtitle>
                            <div class="d-flex mb-2">
                                <v-card-subtitle style="font-weight: bold">Estado del pedido:</v-card-subtitle>
                                <v-spacer></v-spacer>
                                <v-card-subtitle
                                    style="font-weight: bold border: solid margin-right: 0.5rem"
                                    v-text="order.state == 0 ? 'Solicitado' : order.state == 1 ? 'En proceso' : order.state == 2 ? 'Atendido' : order.state == 3 ? 'Anulado' : order.state == 5 ? 'Pagado' : 'Preparado'"></v-card-subtitle>
                            </div>
                            <div class="mx-10 mb-2 d-flex align-center justify-center">
                                <v-btn
                                    prepend-icon="mdi-eye-circle-outline"
                                    class="mx-1"
                                    size="x-small"
                                    color="brown"
                                    @click="verPedido(order.id, order.state)">
                                    Ver
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
                        color="#856826"
                        @click="verCobroGlobal()">
                        Cobrar
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
                        <v-spacer></v-spacer>
                        <div v-if="isPayment" style="margin-right: 5%">
                            <v-checkbox
                                v-if="toEdit"
                                label="Aplicar promoción"
                                color="brown"
                                hide-details
                                v-model="disabled"
                                @change="toEdit = toEdit">
                            </v-checkbox>
                        </div>
                    </v-toolbar>
                    <v-list class="bgDialog">
                        <div v-if="toEdit" class="d-flex justify-content-center align-items-center mx-8 mt-3">
                            <v-combobox
                                label="Seleccione promoción"
                                v-model="promotion"
                                :items="promotions"
                                item-value="id"
                                item-title="name"
                                :rules="[rules.requiredSelection]"
                                required>
                            </v-combobox>
                        </div>
                        <v-list-item
                            v-for="(item, i) in isPayment ? listOrderDetailsGroup : order_details"
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
                                        <div v-if="toEdit">
                                            <div class="text-right">
                                                <label for="precio">S/</label>
                                                <input type="number" id="precio" v-model="item.price" class="cantidad"/>
                                            </div>
                                        </div>
                                        <div v-else class="text-right">
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
                        <div v-if="generaDoc" style="width: 100%">
                            <div class="row justify-content-center align-items-center mt-1" style="width: 100%">
                                <div class="col-auto text-center comprobante">
                                    <v-radio-group v-model="tipoDoc" inline style="margin-bottom: -15px" @click="docCliente = ''; nombreCliente = ''">
                                        <v-radio value="1" color="gray" class="comprobante">
                                            <template v-slot:label>
                                                <div class="comprobante">Boleta simple</div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="2" color="#E75D48" class="comprobante">
                                            <template v-slot:label>
                                                <div class="comprobante">Boleta</div>
                                            </template>
                                        </v-radio>
                                        <v-radio value="3" color="blue" class="comprobante">
                                            <template v-slot:label>
                                                <div class="comprobante">Factura</div>
                                            </template>
                                        </v-radio>
                                    </v-radio-group>
                                </div>
                            </div>
                            <div v-if="tipoDoc > 0" class="mx-1 row justify-content-center align-items-center">
                                <div class="d-flex align-center flex-column">
                                    <div v-if="tipoDoc == 2" style="width: 90%" class="d-flex">
                                        <v-text-field
                                            prepend-inner-icon="mdi-card-account-details"
                                            variant="underlined"
                                            :rules="[rules.required]"
                                            label="Ingrese DNI o RUC"
                                            v-model="docCliente"
                                            required>
                                        </v-text-field>
                                        <v-btn icon="mdi-account-search" class="ms-1 mt-3" color="#679a50" size="x-small" rounded @click="buscarCliente()">
                                            <v-icon>mdi-account-search</v-icon>
                                            <v-tooltip
                                                activator="parent"
                                                location="bottom">
                                                Buscar DNI
                                            </v-tooltip>
                                        </v-btn>
                                    </div>
                                    <div v-if="tipoDoc == 3" style="width: 90%" class="d-flex">
                                        <v-text-field
                                            prepend-inner-icon="mdi-card-account-details"
                                            variant="underlined"
                                            :rules="[rules.required]"
                                            label="Ingrese RUC"
                                            v-model="docCliente"
                                            required>
                                        </v-text-field>
                                        <v-btn icon="mdi-account-search" class="ms-1 mt-3" color="#679a50" size="x-small" rounded @click="buscarCliente()">
                                            <v-icon>mdi-account-search</v-icon>
                                            <v-tooltip
                                                activator="parent"
                                                location="bottom">
                                                Buscar RUC
                                            </v-tooltip>
                                        </v-btn>
                                    </div>
                                    <div v-if="nombreCliente" style="width: 90%; margin-bottom: 10px">
                                        {{ nombreCliente }}
                                    </div>
                                    <v-btn v-if="tipoDoc == 1 || (tipoDoc > 1 && nombreCliente)" prepend-icon="mdi-currency-usd" color="#679a50" variant="elevated" class="comprobante text-light" @click="procesarPago()">Procesar pago</v-btn>
                                </div>
                            </div>
                            <div v-else class="mx-2 row justify-content-center align-items-center">
                                <v-btn v-if="tipoDoc == 0" prepend-icon="mdi-currency-usd" color="#679a50" variant="elevated" class="sin-comprobante text-light" @click="procesarPago()">Pago sin comprobante</v-btn>
                            </div>
                        </div>
                    </v-list>
                    <v-card-actions class="justify-center">
                        <v-btn v-if="isPayment" prepend-icon="mdi-currency-usd" color="white" variant="outlined" @click="generaDoc = !generaDoc; tipoDoc = 0">Registrar pago</v-btn>
                        <v-btn prepend-icon="mdi-close-circle" color="white" variant="outlined" @click="limpiar()">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
import Swal from 'sweetalert2'
import { mapActions, mapGetters, mapState } from 'vuex'
import axios from "axios"
import { facturacionApi } from '@/api/foodplaceApi'
import readNumbersAsText from '@/helpers/readNumbersAsText'
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
            toEdit: false,
            disabled: false,
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            aplicaPromocion: 0,
            table: null,
            promotion: {
                id: 0,
                name: '',
                start_date: null,
                end_date: null,
                description: '',
                discount: '',
                image: '',
                state: true
            },
            tipoDoc: 0,
            generaDoc: false,
            docCliente: '',
            nombreCliente: '',
            correlativo: '',
            habilitarSunat: false,
            montoIgv: 0,
            rucRestaurante: '',
            razonSocial: '',
            direccion: '',
            cashRegisterAssignment: {
                id: 0,
                initial_balance: 0,
                cash_register: null,
                employee: null
            }
        }
    },
    watch: {
        table(newValue, oldValue) {
            if (newValue != oldValue)
                this.cargarPedidos()
        }
    },
    computed: {
        ...mapState('pedido', ['orders', 'orders_all', 'order_details']),
        ...mapState('promocion', ['promotions']),
        ...mapState('parametro', ['parameters']),
        ...mapGetters('mesa', ['getActiveTables']),
        ...mapGetters('login', ['getUser']),
        getOrdersByTable: function() {
            return this.orders.filter(ord => ord.table.id == this.table.id)
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
        ...mapActions('pedido', ['loadOrders', 'loadAllOrders', 'loadOrderDetails', 'clearOrderComplete', 'clearOrderDetails', 'updateOrder', 'updateOrderDetail', 'createAssignmentOrder']),
        ...mapActions('promocion', ['loadActivePromotions']),
        ...mapActions('parametro', ['loadParameters']),
        ...mapActions('mesa', ['loadTables']),
        ...mapActions('asignacion_cajero', ['loadLastCashRegisterAssignmentByEmployee']),
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
            if (this.table) {
                this.listOrderIds = []
                this.listOrderDetailsSelected = []
                this.listOrderDetails = []
                this.listOrderDetailsGroup = []
                this.isPayment = false
                await this.loadOrders()
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
        async getMaxCorrelative(voucherType) {
            let maxValue = 0
            await this.loadAllOrders()
            const ordersWithVoucher = [...this.orders_all.filter(ord => ord.serie && ord.serie.startsWith(voucherType))]
            if (ordersWithVoucher && ordersWithVoucher.length > 0) {
                maxValue = Math.max(...ordersWithVoucher.map(x => parseInt(x.correlative)))
                maxValue++
            } else {
                maxValue = 1
            }
            return maxValue.toString().padStart(6, '0')
        },
        itemExist(array, itemMenuId) {
            let i = 0
            while (i < array.length) {
                if (array[i].menu_detail.item_menu.id == itemMenuId) return i
                i++
            }
            return -1;
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
            this.toEdit = false
            await this.loadOrderDetails(id)
            this.dialog = true
        },
        async verCobroGlobal() {
            this.isPayment = true
            this.toEdit = false
            this.listOrderDetails = []
            this.listOrderDetailsGroup = []
            for (const id of this.listOrderIds) {
                await this.loadOrderDetails(id)
                for (const item of this.order_details)
                    this.listOrderDetails.push(item)
            }
            this.getOrdersDetailGroupByItem()
            this.dialog = true
        },
        async buscarCliente() {
            if (this.docCliente) {
                let rpta = null
                if (this.tipoDoc == 2) {
                    try {
                        if (this.docCliente.length == 8)
                            rpta = await axios.get(`https://dniruc.apisperu.com/api/v1/dni/${this.docCliente}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvcy5yYWZhZWwubWJtQGdtYWlsLmNvbSJ9.3E9MeZMXLWFT7AYRpADSKEkcBQ1HzYLpOjtcox2sIwk`)
                        else if (this.docCliente.length == 11)
                            rpta = await axios.get(`https://dniruc.apisperu.com/api/v1/ruc/${this.docCliente}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvcy5yYWZhZWwubWJtQGdtYWlsLmNvbSJ9.3E9MeZMXLWFT7AYRpADSKEkcBQ1HzYLpOjtcox2sIwk`)
                        else {
                            await Swal.fire({
                                position: 'top-end',
                                text: 'Ingrese un número de documento válido',
                                color: 'white',
                                background: 'red',
                                showConfirmButton: false,
                                timer: 1200
                            })
                            return
                        }
                        if (rpta && rpta.data) {
                            if (rpta.data.nombres && rpta.data.apellidoPaterno) {
                                this.nombreCliente = rpta.data.nombres + ' ' + rpta.data.apellidoPaterno + ' ' + rpta.data.apellidoMaterno
                            } else {
                                await Swal.fire({
                                    position: 'top-end',
                                    text: 'Error al recuperar datos del cliente',
                                    color: 'white',
                                    background: 'red',
                                    showConfirmButton: false,
                                    timer: 1200
                                })
                            }
                        }
                    } catch (error) {
                        await Swal.fire({
                            position: 'top-end',
                            text: 'Error al buscar DNI',
                            color: 'white',
                            background: 'red',
                            showConfirmButton: false,
                            timer: 1200
                        })
                    }
                }
                else {
                    try {
                        if (this.docCliente.length == 11)
                            rpta = await axios.get(`https://dniruc.apisperu.com/api/v1/ruc/${this.docCliente}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImNhcmxvcy5yYWZhZWwubWJtQGdtYWlsLmNvbSJ9.3E9MeZMXLWFT7AYRpADSKEkcBQ1HzYLpOjtcox2sIwk`)
                        else {
                            await Swal.fire({
                                position: 'top-end',
                                text: 'Ingrese un número de documento válido',
                                color: 'white',
                                background: 'red',
                                showConfirmButton: false,
                                timer: 1200
                            })
                            return
                        }
                        if (rpta && rpta.data) {
                            if (rpta.data.razonSocial) {
                                this.nombreCliente = rpta.data.razonSocial
                            } else {
                                await Swal.fire({
                                    position: 'top-end',
                                    text: 'Error al recuperar datos del cliente',
                                    color: 'white',
                                    background: 'red',
                                    showConfirmButton: false,
                                    timer: 1200
                                })
                            }
                        }
                    } catch (error) {
                        await Swal.fire({
                            position: 'top-end',
                            text: 'Error al buscar RUC',
                            color: 'white',
                            background: 'red',
                            showConfirmButton: false,
                            timer: 1200
                        })
                    }
                }
            } else {
                await Swal.fire({
                    position: 'top-end',
                    text: 'Ingrese un número de documento válido',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
            }
        },
        async procesarPago() {
            const {isConfirmed} = await Swal.fire({
                title: 'PAGO DE PEDIDO',
                text: `Se realizará el pago del pedido por un monto de S/ ${this.getTotal}`,
                showDenyButton: true,
                denyButtonColor: '#E75D48',
                denyButtonText: ' <i class="fa fa-thumbs-down"></i>  No, aún no',
                confirmButtonColor: '#679A50',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i>  Sí, cobremos!',
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
                let rptaComprobante = true
                if (this.tipoDoc > 0) {
                    // rptaComprobante = await this.generarComprobante()
                    if (this.habilitarSunat)
                        rptaComprobante = await this.generarComprobante()
                    else
                        rptaComprobante = await this.generarComprobanteManual()
                }
                if (rptaComprobante)
                    await this.pagarPedido()
            }
        },
        async generarComprobanteManual() {
            try {
                // Importar fuentes nuevas
                require('@/assets/fonts/DroidSans-normal')
                require('@/assets/fonts/DroidSans-bold')
                // Preparar variables
                const totalNoIGV = this.getTotalNoIGV
                const total = this.getTotal
                // Iniciar jsPDF
                const pdf = new jsPDF()
                // Aumentar grosor de las líneas
                pdf.setLineWidth(0.3)
                // Construir cabecera
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(13)
                pdf.text(this.razonSocial, 70, 22)
                const image = require('@/assets/logo.jpg')
                pdf.addImage(image, "PNG", 25, 15, 24, 24);
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text("Dirección: ", 64, 29)
                pdf.setFont('DroidSans', 'normal')
                pdf.text(this.direccion, 77, 29)
                pdf.roundedRect(135, 12, 65, 30, 0, 0)
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(16)
                if (this.tipoDoc <= 2)
                    pdf.text("BOLETA DE VENTA", 145, 19)
                else
                    pdf.text("FACTURA", 157, 19)
                pdf.setFontSize(11)
                pdf.text("E L E C T R Ó N I C A", 151, 24)
                pdf.setFontSize(9)
                pdf.text("R.U.C.: " + this.rucRestaurante, 153.9, 30)
                pdf.setFontSize(15)
                const serie = this.tipoDoc <= 2 ? 'B001' : 'F001'
                const correlativo = await this.getMaxCorrelative(this.tipoDoc <= 2 ? 'B' : 'F')
                this.correlativo = correlativo
                pdf.text(`${serie}-${correlativo}`, 153, 39)
                // Construir datos de cliente
                pdf.roundedRect(10, 47, 190, 15, 0, 0)
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7.5)
                pdf.text("Cliente: ", 11.3, 50.5)
                pdf.text("DNI/RUC: ", 125, 50.5)
                pdf.text("Fecha de emisión: ", 11.3, 55)
                pdf.text("Dirección: ", 125, 55)
                pdf.text("Tipo Moneda: ", 11.3, 59.5)
                // - Recuperar datos
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(7)
                if (this.tipoDoc > 1) {
                    pdf.text(this.nombreCliente.toUpperCase(), 22, 50.5)
                    pdf.text(this.docCliente, 138, 50.5)
                }
                const tzoffset = (new Date()).getTimezoneOffset() * 60000 //offset in milliseconds
                const fechaActual = new Date(Date.now() - tzoffset)
                pdf.text(fechaActual.toISOString().slice(0, -5).replace('T', ' '), 35, 55)
                pdf.text("", 138.5, 55) // Dirección en blanco hasta ver si aumentamos un textfield para llenar este dato
                pdf.text("SOLES", 29, 59.5)
                // Construir detalle
                const arrayOrderDetail = []
                let k = 1
                this.listOrderDetailsGroup.map(x => {
                    const detalle = [
                        k,
                        `${x.amount.toFixed(2)} NIU`,
                        '',
                        x.menu_detail.item_menu.name,
                        'S/ ' + ((x.price * 100) / (100 + this.montoIgv)).toFixed(2),
                        'S/ ' + x.price.toFixed(2),
                        'S/ ' + (x.amount * ((x.price * 100) / (100 + this.montoIgv))).toFixed(2),
                        'S/ ' + (x.amount * x.price).toFixed(2)
                    ]
                    arrayOrderDetail.push(detalle)
                    k++
                })
                let tabla = null
                autoTable(pdf, {
                    theme: 'plain',
                    startY: 65,
                    margin: { left: 10, right: 10 },
                    tableLineWidth: 0.3,
                    tableLineColor: [0, 0, 0],
                    pageBreak: 'auto',
                    showHead: 'everyPage',
                    styles: { fillColor: [255, 255, 255]},
                    headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.2, lineColor: [0, 0, 0], fontSize: 7, font: 'DroidSans' },
                    bodyStyles: { fontSize: 7, font: 'DroidSans' },
                    columnStyles: { 0: { halign:'center', lineWidth: { top: 0.2, left: 0.2, bottom: 0.2 }, lineColor: [0, 0, 0] },
                                    1: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    2: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    3: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    4: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    5: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    6: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    7: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2, right: 0.2 }, lineColor: [0, 0, 0] } }, // Cells in first column centered and green
                    head: [[{content:'ITEM', styles:{halign:'center',lineWidth: {top:0.2, left:0.2, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'CANTIDAD', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'CÓDIGO', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'DESCRIPCIÓN', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'V/U', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'P/U', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'SUBTOTAL', styles:{halign:'center',lineWidth: {top: 0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'TOTAL', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0.2}, lineColor: [0, 0, 0]}}]],
                    body: arrayOrderDetail,
                    didParseCell: function (data) {
                        tabla = data.table
                    }
                })
                // Construir pie de página
                const numeroATexto = readNumbersAsText(total, {
                                        plural: "SOLES",
                                        singular: "SOL",
                                        centPlural: "CÉNTIMOS",
                                        centSingular: "CÉNTIMO"
                                    })
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text(numeroATexto, 12, tabla.finalY + 12)
                pdf.line(11, tabla.finalY + 15, 100, tabla.finalY + 15)
                pdf.text('Forma de Pago:', 12, tabla.finalY + 27)
                pdf.line(10, tabla.finalY + 45, 200, tabla.finalY + 45)
                pdf.text('Op. Gravadas:', 175, tabla.finalY + 9, { align: 'right' })
                pdf.text('I.G.V.:', 175, tabla.finalY + 15, { align: 'right' })
                pdf.text('Precio Venta:', 175, tabla.finalY + 21, { align: 'right' })
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(7)
                pdf.text('S/ ' + totalNoIGV.toFixed(2), 195, tabla.finalY + 9, { align: 'right' })
                pdf.line(176, tabla.finalY + 11, 196, tabla.finalY + 11)
                pdf.text('S/ ' + (totalNoIGV * this.montoIgv / 100).toFixed(2), 195, tabla.finalY + 15, { align: 'right' })
                pdf.line(176, tabla.finalY + 17, 196, tabla.finalY + 17)
                pdf.text('S/ ' + total.toFixed(2), 195, tabla.finalY + 21, { align: 'right' })
                pdf.line(176, tabla.finalY + 23, 196, tabla.finalY + 23)
                pdf.text('Contado', 31, tabla.finalY + 27)
                // Descargar PDF
                pdf.save(this.tipoDoc <= 2 ? `Boleta_${correlativo}.pdf` : `Factura_${correlativo}.pdf`)
                // Swal.fire('Generado', 'PDF manual generado', 'success')
                return true
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    text: 'Error al generar Comprobante ',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
                return false
            }
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
        async generarComprobante() {
            const tzoffset = (new Date()).getTimezoneOffset() * 60000 //offset in milliseconds
            const fechaActual = new Date(Date.now() - tzoffset)
            const total = this.getTotal
            const totalNoIGV = this.getTotalNoIGV
            const comprobante = {}
            comprobante.ublVersion = '2.1'
            comprobante.tipoOperacion = '0101' // SUNAT: Venta interna
            comprobante.tipoDoc = this.tipoDoc <= 2 ? '03' : '01' // SUNAT: Boleta (3), Factura (1)
            comprobante.serie = this.tipoDoc <= 2 ? 'B001' : 'F001'
            comprobante.correlativo = this.getMaxCorrelative(this.tipoDoc <= 2 ? 'B' : 'F')
            comprobante.fechaEmision = fechaActual.toISOString().slice(0, -5) + '-05:00'
            comprobante.formaPago = {}
            comprobante.formaPago.moneda = 'PEN'
            comprobante.formaPago.tipo = 'Contado'
            comprobante.tipoMoneda = 'PEN'
            comprobante.client = {}
            if (this.tipoDoc > 1) {
                comprobante.client.tipoDoc = this.docCliente.length == 8 ? '1' : '6' // SUNAT: Cod de tipo de documento 1: DNI, 6: RUC
                comprobante.client.numDoc = this.docCliente
                comprobante.client.rznSocial = this.nombreCliente
            }
            comprobante.company = {}
            comprobante.company.ruc = this.rucRestaurante
            comprobante.company.razonSocial = this.razonSocial
            comprobante.company.nombreComercial = this.razonSocial
            comprobante.company.address = {}
            comprobante.company.address.direccion = this.direccion
            comprobante.company.address.provincia = 'Cusco'
            comprobante.company.address.departamento = 'Cusco'
            comprobante.company.address.distrito = 'Cusco'
            comprobante.mtoOperGravadas = totalNoIGV
            comprobante.mtoIGV = totalNoIGV * this.montoIgv / 100
            comprobante.valorVenta = totalNoIGV
            comprobante.totalImpuestos = totalNoIGV * this.montoIgv / 100
            comprobante.subTotal = total
            comprobante.mtoImpVenta = total
            // Construir detalle
            comprobante.details = []
            this.listOrderDetailsGroup.map(x => {
                const detalle = {}
                detalle.unidad = 'NIU'
                detalle.descripcion = x.menu_detail.item_menu.name
                detalle.cantidad = x.amount
                detalle.mtoValorUnitario = (x.price * 100) / (100 + this.monto)
                detalle.mtoValorVenta = x.amount * ((x.price * 100) / (100 + this.monto))
                detalle.mtoBaseIgv = x.amount * ((x.price * 100) / (100 + this.monto))
                detalle.porcentajeIgv = this.montoIgv
                detalle.igv = this.montoIgv
                detalle.tipAfeIgv = 10
                detalle.totalImpuestos = x.amount * ((x.price * 100) / (100 + this.monto)) * (this.montoIgv / 100)
                detalle.mtoPrecioUnitario = x.price
                comprobante.details.push(detalle)
            })
            comprobante.legends = []
            const legend = {}
            legend.code = '1000'
            legend.value = readNumbersAsText(total, {
                plural: "SOLES",
                singular: "SOL",
                centPlural: "CÉNTIMOS",
                centSingular: "CÉNTIMO"
            })
            comprobante.legends.push(legend)
            try {
                // Revisar envio de datos a SUNAT (error por certificado digital)
                // const rptaEnvio = await facturacionApi.post('/invoice/send', comprobante)
                // console.log(rptaEnvio)
                const rpta = await facturacionApi.post('/invoice/pdf', comprobante, {
                    responseType: 'blob',
                    headers: {
                        'Accept': 'application/pdf'
                    }
                })
                this.correlativo = comprobante.correlativo
                const url = URL.createObjectURL(rpta.data)
                this.download(url, this.tipoDoc <= 2 ? `Boleta_${comprobante.correlativo}.pdf` : `Factura_${comprobante.correlativo}.pdf`)
                URL.revokeObjectURL(url)
                return true
            } catch (error) {
                await Swal.fire({
                    position: 'top-end',
                    text: 'Error al generar Comprobante ',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
                return false
            }
        },
        async pagarPedido() {
            let res = []
            const formData = new FormData()
            formData.append('state', 5)
            if (this.toEdit && this.promotion.id != 0) {
                formData.append('promotion_id', this.promotion.id)
            }
            if (this.correlativo.length > 0) {
                formData.append('serie', this.tipoDoc <= 2 ? 'B001' : 'F001')
                formData.append('correlative', this.correlativo)
            }
            formData.append('cash_register_assignment_id', this.cashRegisterAssignment.id)
            for (const id of this.listOrderIds) {
                res = await this.updateOrder([id, formData])
                const formAsignacion = new FormData()
                formAsignacion.append('order_id', id)
                formAsignacion.append('employee_id', this.getUser.employee.id)
                formAsignacion.append('process_id', 5)
                let resAsign = await this.createAssignmentOrder(formAsignacion)
                if (resAsign[0] == 0) {
                    await Swal.fire({
                        position: 'top-end',
                        text: 'Error al asignar personal',
                        color: 'white',
                        background: 'red',
                        showConfirmButton: false,
                        timer: 1200
                    })
                }
            }
            if (res[0] != 0) {
                if (this.toEdit) {
                    let hasError = false
                    console.log(this.listOrderDetailsSelected)
                    for (const item of this.listOrderDetailsSelected) {
                        const formDetalle = new FormData()
                        formDetalle.append('price', item.price)
                        const resDetalle = await this.updateOrderDetail([item.id, formDetalle])
                        if (resDetalle[0] == 0) {
                            hasError = true
                        }
                    }
                    if (hasError) {
                        Swal.fire('Error', 'El pago se realizó con errores en los precios', 'error')
                    }
                }
                Swal.fire('Cobro exitoso', 'Se realizó el pago correctamente', 'success')
            } else {
                Swal.fire('Error', 'Error no se pudo realizar el pago. ' + res[1], 'error')
            }
            this.limpiar()
            this.listOrderIds = []
            this.listOrderDetailsSelected = []
            this.listOrderDetails = []
            this.listOrderDetailsGroup = []
            this.isPayment = false
            await this.loadOrders()
        },
        limpiar() {
            this.dialog = false
            this.clearOrderDetails()
            this.toEdit = false
            this.disabled = false
            this.promotion.id = 0
            this.promotion.name = ''
            this.promotion.start_date = null
            this.promotion.end_date = null
            this.promotion.description = ''
            this.promotion.discount = ''
            this.promotion.image = ''
            this.promotion.state = true
            this.tipoDoc = 0,
            this.generaDoc = false,
            this.docCliente = '',
            this.nombreCliente = ''
            this.correlativo = ''
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
        parameterFound = this.parameters.find(p => p.parameter_code == 1010 && p.item_code == 1013)
        this.habilitarSunat = parameterFound ? (parameterFound.value == '1' ? true : false) : false
        await this.clearOrderComplete()
        await this.loadActivePromotions()
        this.cashRegisterAssignment = await this.loadLastCashRegisterAssignmentByEmployee(this.getUser.employee.id)
        this.isLoading = false
        if (!this.cashRegisterAssignment) {
            Swal.fire('Error', 'No tiene asignado una caja registradora para realizar esta operación', 'error')
        } else {
            await this.loadTables()
        }
    },
    unmounted() {
        window.removeEventListener("resize", this.getWidthScreen)
    }
}
</script>

<style lang="scss" scoped>
#pedidos {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Caja.png');
    background-size: cover;
}
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
#formulario {
    width: 40%;
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
.bgDialog {
    background-color: lighten($color: #E3CD83, $amount: 10);
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
.cantidad {
    width: 32%;
    text-align: right;
}
.tableList {
    background-color: rgba(241, 196, 15, 0.3);
    overflow-y: auto;
}
.lista {
    background-color: rgba(67, 116, 18, 0.5);
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
.sin-comprobante {
    width: 40%;
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
    // border: 1px solid #f1f2f3
}
#pedidos::-webkit-scrollbar-track {
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
    .cantidad {
        width: 60%;
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
    .comprobante {
        font-size: 0.8em;
    }
    .sin-comprobante {
        width: 80%;
        font-size: 0.8em;
    }
}
</style>