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
    <div v-else id="report" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-report justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Reporte de ventas"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center align-items-center">
                                <div class="left-control size-left-control mt-5">
                                    <v-text-field
                                        label="Año de consulta"
                                        :rules="[rules.required]"
                                        v-model="year"
                                        required
                                        type="number">
                                    </v-text-field>
                                </div>
                                <div class="right-control size-right-control">
                                    <v-btn prepend-icon="mdi-card-search" class="mx-4" rounded color="#679A50" @click="changeYear()">
                                        Cambiar año
                                    </v-btn>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-4">
                                <div style="width: 50%" class="left-control text-center">
                                    <label for="txtFechaInicio" style="font-weight: bold">Fecha de inicio</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="start_date"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 50%" class="right-control text-center">
                                    <label for="txtFechaFin" style="font-weight: bold">Fecha de fin</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="end_date"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-card-search" class="mb-2 me-2" rounded color="#679A50" @click="buscarPedidos">Buscar</v-btn>
                                <v-btn prepend-icon="mdi-printer" class="mb-2 ms-2" rounded color="#679A50" @click="imprimirReporte">Imprimir</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaPedidos" class="animate__animated animate__flipInY">
                    <div class="d-flex my-1">
                        <span style="font-weight: bold; font-size: 18px;" class="text-white busquedaText">Filtros:</span>
                        <select v-model="searchField" class="form-control mx-3 bg-green-gray pointer busqueda">
                            <option value="" selected>--Seleccione--</option>
                            <option value="correlative">N° Comprobante</option>
                            <option value="doc_number">Documento de identidad</option>
                            <option value="client">Cliente</option>
                            <option value="payment_method">Método de pago</option>
                            <option value="table_number">Mesa</option>
                            <option value="state">Estado</option>
                            <option value="cash_register">Caja</option>
                            <option value="employee">Empleado</option>
                        </select>
                        <input v-if="searchField != ''" type="text" class="form-control busqueda" v-model="searchValue">
                    </div>
                    <easy-data-table
                        :headers="headers"
                        :items="vouchersFiltered"
                        :search-field="searchField"
                        :search-value="searchValue"
                        :theme-color="themeColor"
                        :rows-per-page="15"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        header-text-direction="center"
                        body-text-direction="center"
                        empty-message="No hay datos de pedidos en la fecha indicada">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-eye" class="text-center me-2" color="green" size="x-small" @click="cargarDetalle(item)"></v-btn>
                                <v-btn icon="mdi-printer" class="text-center me-2" color="blue" size="x-small" @click="generarComprobanteManual(item.id)"></v-btn>
                                <v-btn v-if="item.state.toUpperCase() == 'ACTIVO'" icon="mdi-trash-can-outline" class="text-center" color="#E75D48" size="x-small" @click="anularComprobante(item.id)"></v-btn>
                            </div>
                        </template>
                    </easy-data-table>
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
                            v-for="(item, i) in voucher_details"
                            :key="i"
                            :value="item"
                            class="itemList">
                            <template v-slot:default>
                                <div class="d-flex justify-content-center align-items-center">
                                    <div style="width: 70%">
                                        <v-list-item-title class="tituloMenu" v-text="item.item_menu"></v-list-item-title>
                                        <v-list-item-subtitle class="subtituloMenu" v-text="item.category"></v-list-item-subtitle>
                                    </div>
                                    <div class="d-flex justify-content-right align-items-right" style="width: 20%">
                                        <div>
                                            {{ item.amount }}
                                        </div>
                                        <v-spacer></v-spacer>
                                        <div class="text-right">
                                            S/ {{ item.price_tax }}
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
                                {{ totalVoucher }}
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
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Swal from "sweetalert2"
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            isLoading: true,
            vouchersFiltered: [],
            totalVoucher: 0,
            headers: [],
            searchField: '',
            searchValue: '',
            themeColor: "#856826",
            year: new Date(Date.now()).getFullYear(),
            start_date: this.getFechaActual(),
            end_date: this.getFechaActual(),
            dialog: false,
            rucRestaurante: '',
            razonSocial: '',
            direccion: ''
        }
    },
    computed: {
        ...mapState('comprobante', ['vouchers', 'voucher_details']),
        ...mapState('parametro', ['parameters'])
    },
    methods: {
        ...mapActions('parametro', ['loadParameters']),
        ...mapActions('pedido', ['revertOrder']),
        ...mapActions('comprobante', ['loadVouchersReport', 'loadVouchersById', 'loadVoucherDetailsByVoucher', 'updateVoucher']),
        getFechaActual() {
            const date = new Date(Date.now())
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            return date.toJSON().slice(0, 10)
        },
        getFecha(fecha) {
            const date = new Date(fecha)
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            return date.toJSON().slice(0, 10)
        },
        async buscarPedidos() {
            this.$refs.form.validate()
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            if (this.vouchers && this.vouchers.length > 0) {
                this.vouchersFiltered = [...this.vouchers.filter(x => {
                    const startDate = new Date(Date.parse(this.start_date))
                    const endDate = new Date(Date.parse(this.end_date))
                    const orderDate = new Date(Date.parse(x.issuance_time))
                    if (orderDate >= startDate && orderDate < endDate.setDate(endDate.getDate() + 1))
                        return true
                    else return false
                })]
            } else {
                this.vouchersFiltered = []
            }
            Swal.close()
        },
        async cargarDetalle(item) {
            await this.loadVoucherDetailsByVoucher(item.id)
            if (this.voucher_details) {
                this.totalVoucher = item.total
                this.dialog = true
            }
        },
        imprimirReporte() {
            if (this.vouchersFiltered.length == 0) {
                Swal.fire('Error', 'No hay datos para generar reporte', 'error')
                return
            }
            try {
                // Importar fuentes nuevas
                require('@/assets/fonts/DroidSans-normal')
                require('@/assets/fonts/DroidSans-bold')
                // Iniciar jsPDF
                const pdf = new jsPDF()
                // Aumentar grosor de las líneas
                pdf.setLineWidth(0.3)
                // Construir cabecera
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(13)
                pdf.text("Alojería La Esencia", 90, 20)
                const image = require('@/assets/logo.png')
                pdf.addImage(image, "PNG", 18, 15, 18, 18);
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text("Año: ", 42, 26)
                pdf.text("Fecha inicio: ", 42, 32)
                pdf.text("Fecha fin: ", 90, 32)
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(7)
                pdf.text(this.year.toString(), 48, 26)
                pdf.text(this.start_date, 58, 32)
                pdf.text(this.end_date, 103, 32)
                // Construir detalle
                const arrayOrders = []
                let k = 1
                let total = 0
                this.vouchersFiltered.map(x => {
                    const detalle = [
                        k,
                        x.correlative ? `${x.serie}-${x.correlative}` : 'Sin comprobante',
                        x.issuance_time,
                        x.table_number,
                        x.cantidad_items,
                        'S/ ' + x.total
                    ]
                    arrayOrders.push(detalle)
                    k++
                    total += x.total
                })
                let tabla = null
                autoTable(pdf, {
                    theme: 'plain',
                    startY: 45,
                    margin: { left: 15, right: 15 },
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
                                    5: { halign:'right', lineWidth: { top: 0.2, bottom: 0.2, right: 0.2 }, lineColor: [0, 0, 0] } }, // Cells in first column centered and green
                    head: [[{content:'#', styles:{halign:'center',lineWidth: {top:0.2, left:0.2, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'COMPROBANTE', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'FECHA PEDIDO', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'N° MESA', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'CANTIDAD ÍTEMS', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'TOTAL', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0.2}, lineColor: [0, 0, 0]}}]],
                    body: arrayOrders,
                    didParseCell: function (data) {
                        tabla = data.table
                    }
                })
                // Construir total
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text('TOTAL:', 165, tabla.finalY + 8)
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(7)
                pdf.text('S/ ' + total.toFixed(2), 194, tabla.finalY + 8, { align: 'right' })
                // Construir header y footer
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(6)
                const pageCount = pdf.internal.getNumberOfPages()
                for (let i = 0; i < pageCount; i++) {
                    pdf.setPage(i)
                    pdf.text("Fecha de reporte: " + new Date(Date.now()).toLocaleDateString(), 167, 10)
                    const currentPage = pdf.internal.getCurrentPageInfo().pageNumber
                    pdf.text("Pág. " + currentPage, 18, 287)
                }
                // Descargar PDF
                pdf.save(`Reporte_${this.start_date}_al_${this.end_date}.pdf`)
            } catch (error) {
                Swal.fire({
                    position: 'top-end',
                    text: 'Error al generar reporte de ventas',
                    color: 'white',
                    background: 'red',
                    showConfirmButton: false,
                    timer: 1200
                })
                return false
            }
        },
        limpiar() {
            this.dialog = false
        },
        async changeYear() {
            if (this.year != new Date(Date.now()).getFullYear()) {
                this.start_date = this.getFecha(new Date(this.year, 11, 1))
                this.end_date = this.getFecha(new Date(this.year, 11, 31))
            } else {
                this.start_date = this.getFechaActual()
                this.end_date = this.getFechaActual()
            }
            await this.loadVouchersReport(this.year)
            if (this.vouchers && this.vouchers.length > 0) {
                this.vouchersFiltered = [...this.vouchers.filter(x => {
                    const startDate = new Date(Date.parse(this.start_date))
                    const endDate = new Date(Date.parse(this.end_date))
                    const orderDate = new Date(Date.parse(x.issuance_time))
                    if (orderDate >= startDate && orderDate < endDate.setDate(endDate.getDate() + 1))
                        return true
                    else return false
                })]
            }
        },
        async generarComprobanteManual(id) {
            try {
                debugger
                const comprobante = await this.loadVouchersById(id)
                // Importar fuentes nuevas
                require('@/assets/fonts/DroidSans-normal')
                require('@/assets/fonts/DroidSans-bold')
                // Iniciar jsPDF
                const pdf = new jsPDF()
                // Aumentar grosor de las líneas
                pdf.setLineWidth(0.3)
                // Construir cabecera
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(13)
                pdf.text(this.razonSocial, 70, 22)
                const image = require('@/assets/logo.png')
                pdf.addImage(image, "PNG", 25, 15, 24, 24);
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text("Dirección: ", 64, 29)
                pdf.setFont('DroidSans', 'normal')
                pdf.text(this.direccion, 77, 29)
                pdf.roundedRect(135, 12, 65, 30, 0, 0)
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(16)
                if (comprobante.doc_type === "03")
                    pdf.text("BOLETA DE VENTA", 145, 19)
                else
                    pdf.text("FACTURA", 157, 19)
                pdf.setFontSize(11)
                pdf.text("E L E C T R Ó N I C A", 151, 24)
                pdf.setFontSize(9)
                pdf.text("R.U.C.: " + this.rucRestaurante, 153.9, 30)
                pdf.setFontSize(15)
                const serie = comprobante.serie
                const correlativo = comprobante.correlative
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
                pdf.text(comprobante.client ? (comprobante.client.business_name ? comprobante.client.business_name.toUpperCase() : (comprobante.client.name + ' ' + comprobante.client.surname).toUpperCase()) : '', 22, 50.5)
                pdf.text(comprobante.client ? comprobante.client.doc_number : '', 138, 50.5)
                pdf.text(comprobante.issuance_time, 35, 55)
                pdf.text("", 138.5, 55) // Dirección en blanco hasta ver si aumentamos un textfield para llenar este dato
                pdf.text("SOLES", 29, 59.5)
                // Construir detalle
                await this.loadVoucherDetailsByVoucher(id)
                const arrayVoucherDetail = []
                let k = 1
                this.voucher_details.map(x => {
                    const detalle = [
                        k,
                        `${x.amount} NIU`,
                        '',
                        x.item_menu,
                        'S/ ' + parseFloat(x.price_no_tax).toFixed(2),
                        'S/ ' + parseFloat(x.price_tax).toFixed(2),
                        'S/ ' + parseFloat(x.subtotal).toFixed(2),
                        'S/ ' + parseFloat(x.total).toFixed(2)
                    ]
                    arrayVoucherDetail.push(detalle)
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
                    body: arrayVoucherDetail,
                    didParseCell: function (data) {
                        tabla = data.table
                    }
                })
                // Construir pie de página
                pdf.setFont('DroidSans', 'bold')
                pdf.setFontSize(7)
                pdf.text(comprobante.total_tax_text, 12, tabla.finalY + 12)
                pdf.line(11, tabla.finalY + 15, 100, tabla.finalY + 15)
                pdf.text('Forma de Pago:', 12, tabla.finalY + 27)
                pdf.line(10, tabla.finalY + 45, 200, tabla.finalY + 45)
                pdf.text('Op. Gravadas:', 175, tabla.finalY + 9, { align: 'right' })
                pdf.text('I.G.V.:', 175, tabla.finalY + 15, { align: 'right' })
                pdf.text('Precio Venta:', 175, tabla.finalY + 21, { align: 'right' })
                pdf.setFont('DroidSans', 'normal')
                pdf.setFontSize(7)
                pdf.text('S/ ' + parseFloat(comprobante.total_no_tax).toFixed(2), 195, tabla.finalY + 9, { align: 'right' })
                pdf.line(176, tabla.finalY + 11, 196, tabla.finalY + 11)
                pdf.text('S/ ' + (comprobante.total_no_tax * comprobante.tax_value / 100).toFixed(2), 195, tabla.finalY + 15, { align: 'right' })
                pdf.line(176, tabla.finalY + 17, 196, tabla.finalY + 17)
                pdf.text('S/ ' + parseFloat(comprobante.total_tax).toFixed(2), 195, tabla.finalY + 21, { align: 'right' })
                pdf.line(176, tabla.finalY + 23, 196, tabla.finalY + 23)
                pdf.text('Contado', 31, tabla.finalY + 27)
                // Descargar PDF
                pdf.save(comprobante.doc_type == "03" ? `Boleta_${correlativo}.pdf` : `Factura_${correlativo}.pdf`)
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
        async anularComprobante(id) {
            let res = []
            res = await this.revertOrder(id)
            if (res.rpta != 0) {
                const formVoucher = new FormData()
                formVoucher.append('state', 0)
                res = await this.updateVoucher([id, formVoucher])
                if (res[0] != 0) {
                    await this.loadVouchersReport(this.year)
                    if (this.vouchers && this.vouchers.length > 0) {
                        this.vouchersFiltered = [...this.vouchers.filter(x => {
                            const startDate = new Date(Date.parse(this.start_date))
                            const endDate = new Date(Date.parse(this.end_date))
                            const orderDate = new Date(Date.parse(x.issuance_time))
                            if (orderDate >= startDate && orderDate < endDate.setDate(endDate.getDate() + 1))
                                return true
                            else return false
                        })]
                    }
                    Swal.fire('Éxito', 'Se anuló el comprobante', 'success')
                } else {
                    Swal.fire('Error', 'Se anuló el pedido, pero no se extornó el comprobante' + res.rpta, 'error')
                }
            } else {
                Swal.fire('Error', 'Error no se pudo anular el pedido. ' + res.message, 'error')
            }
        }
    },
    async mounted() {
        await this.loadVouchersReport(this.year)
        await this.loadParameters()
        let parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1002)
        this.razonSocial = parameterFound ? parameterFound.value : ''
        parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1001)
        this.rucRestaurante = parameterFound ? parameterFound.value : ''
        parameterFound = this.parameters.find(p => p.parameter_code == 1000 && p.item_code == 1003)
        this.direccion = parameterFound ? parameterFound.value : ''
        this.headers = [
            { text: "Serie", value: "serie", sortable: true, width: 10 },
            { text: "Correlativo", value: "correlative", sortable: true, width: 25 },
            { text: "Fecha de pedido", value: "issuance_time", sortable: true, width: 130 },
            { text: "Doc Identidad", value: "doc_number", width: 0 },
            { text: "Cliente", value: "client", sortable: true, width: 280 },
            { text: "Método pago", value: "payment_method", sortable: true, width: 100 },
            { text: "N° Mesa", value: "table_number", sortable: true, width: 75 },
            { text: "Total", value: "total", width: 75 },
            { text: "Estado", value: "state", sortable: true, width: 75 },
            { text: "Caja", value: "cash_register", width: 70 },
            { text: "Empleado", value: "employee", width: 200 },
            { text: "Acciones", value: "action", width: 100 }
        ]
        if (this.vouchers && this.vouchers.length > 0) {
            this.vouchersFiltered = [...this.vouchers.filter(x => {
                const startDate = new Date(Date.parse(this.start_date))
                const endDate = new Date(Date.parse(this.end_date))
                const orderDate = new Date(Date.parse(x.issuance_time))
                if (orderDate >= startDate && orderDate < endDate.setDate(endDate.getDate() + 1))
                    return true
                else return false
            })]
        }
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    width: 50%;
    border-radius: 20px;
}
#report {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-report {
    width: 80%;
}
.left-control {
    margin-left: 2em;
    margin-right: 1em;
}
.size-left-control {
    width: 60%;
}
.right-control {
    margin-left: 1em;
    margin-right: 2em;
}
.size-right-control {
    width: 40%;
}
#tablaPedidos {
    padding-bottom: 100px;
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
.tituloMenu {
    font-size: 1em;
}
.subtituloMenu {
    font-size: 0.9em;
}
.texto-total {
    margin-left: 7%;
}
.total {
    margin-right: 7%;
}
.action-wrapper {
    cursor: pointer;
    white-space: nowrap;
}
.busqueda {
    background-color: lighten($color: white, $amount: 30);
    width: 30%;
    height: 80%;
    font-size: 12px
}
.busquedaText {
    background-color: rgba(133, 104, 38, 0.8);
    height: 100%;
}
.customize-table {
    --easy-table-border: 1px solid #856826;
    --easy-table-row-border: 1px solid #856826;

    --easy-table-header-font-color: white;
    --easy-table-header-background-color: #679A50;

    --easy-table-body-even-row-background-color: #CFBF88;
    --easy-table-body-row-background-color: #CFBF88; //lighten($color: #856826, $amount: 40);
    --easy-table-body-row-hover-background-color: #CAE0C3;
    --easy-table-body-row-font-size: 11px;

    --easy-table-footer-background-color: #679A50;
    --easy-table-footer-font-color: white;

    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;

    // --easy-table-scrollbar-track-color: #2d3a4f;
    // --easy-table-scrollbar-color: #2d3a4f;
    // --easy-table-scrollbar-thumb-color: #4c5d7a;;
    // --easy-table-scrollbar-corner-color: #2d3a4f;

    // --easy-table-loading-mask-background-color: #2d3a4f;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#report::-webkit-scrollbar {
    -webkit-appearance: none;
}
#report::-webkit-scrollbar:vertical {
    width:1px;
}
#report::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#report::-webkit-scrollbar:horizontal {
    height: 10px;
}
#report::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#report::-webkit-scrollbar-track {
    border-radius: 10px;  
}
select {
    background-image:
        linear-gradient(45deg, transparent 50%, green 50%),
        linear-gradient(135deg, green 50%, transparent 50%),
        linear-gradient(to right, #ccc, #ccc);
    background-position:
        calc(100% - 18px) calc(1em + 2px),
        calc(100% - 13px) calc(1em + 2px),
        calc(100% - 2.5em) 0.5em;
    background-size:
        5px 5px,
        5px 5px,
        1px 1.5em;
    background-repeat: no-repeat;
}
@media (max-width: 850px) {
    /* For mobile phones: */
    .panel-report {
        width: 90%;
    }
    #formulario {
        width: 95%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaPedidos {
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .left-control {
        margin-left: 0em;
        margin-right: 0.2em;
    }
    .right-control {
        margin-left: 0.2em;
        margin-right: 0em;
    }
    .size-left-control {
        width: 40%;
    }
    .size-right-control {
        width: 60%;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .itemList {
        font-size: 0.8em;
    }
    .tituloMenu {
        font-size: 1.1em;
    }
    .subtituloMenu {
        font-size: 1em;
    }
    .busqueda {
        width: 95%;
        font-size: 12px
    }
    .busquedaText {
        height: 50%;
    }
}
</style>