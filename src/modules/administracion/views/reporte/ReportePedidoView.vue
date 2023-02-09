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
                                    <v-btn prepend-icon="mdi-card-search" class="mx-4" rounded color="#679A50">
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
                    <easy-data-table
                        :headers="headers"
                        :items="arrayOrdersReportFiltered"
                        :theme-color="themeColor"
                        :rows-per-page="15"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        header-text-direction="center"
                        body-text-direction="center"
                        empty-message="No hay datos de pedidos en la fecha indicada"
                        @click-row="cargarDetalle">
                        <template #expand="item">
                            <div v-if="item.promotion_name" class="text-left ps-15">
                                {{item.promotion_name}}
                            </div>
                            <div v-else class="text-left ps-15">
                                No se aplicó promoción
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
                            v-for="(item, i) in order_details_agrupado"
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
            arrayOrdersReport: [],
            arrayOrdersReportFiltered: [],
            order_details_agrupado: [],
            headers: [],
            themeColor: "#856826",
            year: new Date(Date.now()).getFullYear(),
            start_date: this.getFechaActual(),
            end_date: this.getFechaActual(),
            dialog: false
        }
    },
    computed: {
        ...mapState('pedido', ['order_details']),
        getTotal: function() {
            return this.order_details_agrupado.reduce((accumulator, object) => {
                return accumulator + (object.amount * object.price)
            }, 0)
        }
    },
    methods: {
        ...mapActions('pedido', ['loadOrdersReport', 'loadOrderDetails', 'clearOrderDetails']),
        getFechaActual() {
            const date = new Date(Date.now())
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            return date.toJSON().slice(0, 10)
        },
        getOrdersDetailGroupByItem() {
            const res = this.order_details.reduce((accumulator, object) => {
                let idx = accumulator[0].indexOf(object.menu_detail.item_menu.id)
                if (idx > -1) {
                    accumulator[1][idx].amount += object.amount
                } else {
                    accumulator[0].push(object.menu_detail.item_menu.id)
                    accumulator[1].push(object)
                }
                return accumulator
            }, [[],[]])
            this.order_details_agrupado = res[1]
        },
        async buscarPedidos() {
            this.$refs.form.validate()
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            if (this.arrayOrdersReport.length == 0) {
                this.arrayOrdersReport = await this.loadOrdersReport(this.year)
            }
            this.arrayOrdersReportFiltered = [...this.arrayOrdersReport.filter(x => {
                const startDate = new Date(Date.parse(this.start_date))
                const endDate = new Date(Date.parse(this.end_date))
                const orderDate = new Date(Date.parse(x.order_time))
                if (orderDate >= startDate && orderDate <= endDate.setDate(endDate.getDate() + 1))
                    return true
                else return false
            })]
            Swal.close()
        },
        async cargarDetalle(item) {
            await this.loadOrderDetails(item.id)
            if (this.order_details) {
                console.log(this.order_details)
                this.getOrdersDetailGroupByItem()
                this.dialog = true
            }
        },
        imprimirReporte() {
            if (this.arrayOrdersReportFiltered.length == 0) {
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
                const image = require('@/assets/logo.jpg')
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
                this.arrayOrdersReportFiltered.map(x => {
                    const detalle = [
                        k,
                        x.correlative ? `${x.serie}-${x.correlative}` : 'Sin comprobante',
                        x.order_time,
                        x.table_number,
                        x.promotion_name ? x.promotion_name : 'No aplicó promoción',
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
                                    5: { halign:'center', lineWidth: { top: 0.2, bottom: 0.2}, lineColor: [0, 0, 0] },
                                    6: { halign:'right', lineWidth: { top: 0.2, bottom: 0.2, right: 0.2 }, lineColor: [0, 0, 0] } }, // Cells in first column centered and green
                    head: [[{content:'#', styles:{halign:'center',lineWidth: {top:0.2, left:0.2, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'COMPROBANTE', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'FECHA PEDIDO', styles:{halign:'center',lineWidth: {top:0.2, left:0, bottom:0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'N° MESA', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
                            {content:'PROMOCIÓN', styles:{halign:'center',lineWidth: {top: 0.2, left: 0, bottom: 0.2, right: 0}, lineColor: [0, 0, 0]}},
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
            this.clearOrderDetails()
        }
    },
    async mounted() {
        this.arrayOrdersReport = await this.loadOrdersReport(this.year)
        this.headers = [
            { text: "Serie", value: "serie", sortable: true, width: 50 },
            { text: "Correlativo", value: "correlative", sortable: true, width: 60 },
            { text: "Fecha de pedido", value: "order_time", sortable: true, width: 130 },
            { text: "N° Mesa", value: "table_number", sortable: true, width: 85 },
            { text: "Cantidad de ítems", value: "cantidad_items", width: 60 },
            { text: "Total", value: "total" },
        ]
        this.arrayOrdersReportFiltered = [...this.arrayOrdersReport.filter(x => {
            const startDate = new Date(Date.parse(this.start_date))
            const endDate = new Date(Date.parse(this.end_date))
            const orderDate = new Date(Date.parse(x.order_time))
            if (orderDate >= startDate && orderDate <= endDate.setDate(endDate.getDate() + 1))
                return true
            else return false
        })]
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
    // width: 50%;
    border-radius: 20px;
}
#report {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-report {
    width: 50%;
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
.customize-table {
    --easy-table-border: 1px solid #856826;
    --easy-table-row-border: 1px solid #856826;

    --easy-table-header-font-color: white;
    --easy-table-header-background-color: #679A50;

    --easy-table-body-even-row-background-color: #CFBF88;
    --easy-table-body-row-background-color: #CFBF88; //lighten($color: #856826, $amount: 40);
    --easy-table-body-row-hover-background-color: #CAE0C3;

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
@media (max-width: 850px) {
    /* For mobile phones: */
    .panel-report {
        width: 90%;
    }
    #formulario {
        width: 90%;
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
}
</style>