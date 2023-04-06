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
    <div v-else id="close-day" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-close-day justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Consulta de estado de caja"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <div class="row justify-content-center mb-4">
                    <div id="seleccion-caja" class="animate__animated animate__flipInY">
                        <div class="control-seleccion-caja justify-content-center my-3">
                            <div class="middle-control-seleccion-caja">
                                <v-select
                                    v-if="getUser.role.id == 1 || getUser.role.id == 9"
                                    v-model="cashRegister"
                                    :items="cash_registers"
                                    item-value="id"
                                    item-title="name"
                                    hide-details="auto"
                                    :rules="[rules.requiredSelection]"
                                    required
                                    class="mt-2"
                                    return-object
                                    label="Seleccione caja">
                                </v-select>
                                <v-btn class="my-3" rounded color="#679A50" @click="cargarResumenDia()">Resumen del día</v-btn>
                            </div>
                        </div>
                    </div>
                </div>
                <v-form v-if="showFormBalancing" ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="control-form justify-content-center mt-5">
                                <div class="left-control my-auto text-left">
                                    <v-label text="Saldo inicial" class="texto"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="saldoInicial"
                                        :readonly="true">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center mt-2">
                                <div class="left-control my-auto text-left">
                                    <v-label text="M. Caja (Ingresos)" class="texto"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="ingresosCaja"
                                        :readonly="true">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center mt-2">
                                <div class="left-control my-auto text-left">
                                    <v-label text="M. Caja (Egresos)" class="texto"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="egresosCaja"
                                        :readonly="true">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center mt-2">
                                <div class="left-control my-auto text-left">
                                    <v-label text="Ventas" class="texto"></v-label>
                                    <v-btn class="ms-2" color="#E75D48" icon="mdi-eye" variant="text" size="medium" @click="dialog = true"></v-btn>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="ventas"
                                        :readonly="true">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="left-control">
                                </div>
                                <div class="right-control">
                                    <hr style="border-top: 5px solid; margin-bottom: 10px">
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="left-control my-auto text-left">
                                    <v-label text="Efectivo (billetes, monedas)" class="texto"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="efectivo">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center mt-2">
                                <div class="left-control my-auto text-left">
                                    <v-label text="Efectivo (medios digitales)" class="texto"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="efectivoDigital">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="left-control">
                                </div>
                                <div class="right-control">
                                    <hr style="border-top: 5px solid; margin-bottom: 10px">
                                </div>
                            </div>
                            <div class="control-form justify-content-center mt-2">
                                <div class="left-control my-auto text-left">
                                    <v-label v-if="getDiferencia == 0" text="Diferencia" class="texto"></v-label>
                                    <v-label v-if="getDiferencia < 0" text="Diferencia (faltante)" class="texto" style="color: red"></v-label>
                                    <v-label v-if="getDiferencia > 0" text="Diferencia (sobrante)" class="texto" style="color: blue"></v-label>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        hide-details="auto"
                                        type="number"
                                        density="compact"
                                        variant="outlined"
                                        class="texto"
                                        v-model="getDiferencia"
                                        :readonly="true">
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 10px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-content-save" class="mb-3 mx-5" rounded color="#679A50" @click="consultarCaja()">Consultar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaCierreDia" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="getCashierBalancings"
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        header-class-name="text-center"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de consultas de estado de caja">
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
                        <div style="margin-left: 5%"><strong>Ventas por método de pago</strong></div>
                    </v-toolbar>
                    <v-list class="bgDialog">
                        <v-list-item
                            v-for="(item, i) in paymentMethods"
                            :key="i"
                            :value="item"
                            class="itemList">
                            <template v-slot:default>
                                <div class="d-flex justify-content-center align-items-center">
                                    <div class="me-1">
                                        <v-avatar v-if="item.image" size="small">
                                            <v-img
                                                :src="item.image"
                                                alt="item-method"
                                                cover>
                                            </v-img>
                                        </v-avatar>
                                        <v-avatar v-else size="x-small">
                                            <v-icon icon="mdi-cancel"></v-icon>
                                        </v-avatar>
                                    </div>
                                    <div style="width: 70%">
                                        <v-list-item-title class="tituloMenu" v-text="item.method"></v-list-item-title>
                                    </div>
                                    <div class="d-flex justify-content-right align-items-right" style="width: 20%">
                                        <div class="text-right">
                                            S/ {{ item.total }}
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </v-list-item>
                    </v-list>
                    <v-card-actions class="justify-center">
                        <v-btn prepend-icon="mdi-close-circle" color="white" variant="outlined" @click="dialog = false">Cerrar</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Swal from "sweetalert2"
import { roundNumber } from '@/helpers/maths'

export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            showFormBalancing: false,
            cashRegister: null,
            saldoInicial: 0,
            ingresosCaja: 0,
            egresosCaja: 0,
            ventas: 0,
            efectivo: 0,
            efectivoDigital: 0,
            cashierBalancing: {
                id: 0,
                total_inflow: 0,
                total_outflow: 0,
                end_balance: 0,
                real_balance: 0,
                cash_register_assignment: null
            },
            paymentMethods: null,
            dialog: false,
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('caja_registradora', ['cash_registers']),
        ...mapState('movimiento_caja', ['cash_register_movements']),
        ...mapGetters('balance_caja', ['getCashierBalancingsConsultedInOrder', 'isLoading']),
        ...mapGetters('login', ['getUser']),
        getDiferencia() {
            const saldoInicial = parseFloat(this.saldoInicial ? this.saldoInicial : 0)
            const ingresos = parseFloat(this.ingresosCaja ? this.ingresosCaja : 0)
            const egresos = parseFloat(this.egresosCaja ? this.egresosCaja : 0)
            const ventasDia = parseFloat(this.ventas ? this.ventas : 0)
            const efectivoDia = parseFloat(this.efectivo ? this.efectivo : 0)
            const efectivoDigitalDia = parseFloat(this.efectivoDigital ? this.efectivoDigital : 0)
            const sumaSistema = saldoInicial + ingresos + ventasDia - egresos
            const sumaManual = efectivoDia + efectivoDigitalDia
            return roundNumber(sumaManual - sumaSistema)
        },
        getCashierBalancings() {
            if (this.getUser.role.id == 1 || this.getUser.role.id == 9) {
                return this.getCashierBalancingsConsultedInOrder()
            } else {
                return this.getCashierBalancingsConsultedInOrder().filter(item => item.cash_register_assignment.employee.id == this.getUser.employee.id)
            }
        }
    },
    methods: {
        ...mapActions('caja_registradora', ['loadCashRegisters']),
        ...mapActions('asignacion_cajero', ['loadLastCashRegisterAssignmentByCashRegister', 'loadLastCashRegisterAssignmentByEmployee']),
        ...mapActions('movimiento_caja', ['loadCashRegisterMovements']),
        ...mapActions('balance_caja', ['loadCashierBalancingsToday', 'createCashierBalancing']),
        ...mapActions('pedido', ['loadOrdersByAssigment']),
        ...mapActions('comprobante', ['loadVouchersByAssigment']),
        async limpiarCampos() {
            this.saldoInicial = 0
            this.ingresosCaja = 0
            this.egresosCaja = 0
            this.ventas = 0
            this.efectivo = 0
            this.efectivoDigital = 0
            this.cashierBalancing.id = 0
            this.cashierBalancing.total_inflow = 0
            this.cashierBalancing.total_outflow = 0
            this.cashierBalancing.end_balance = 0
            this.cashierBalancing.real_balance = 0
            this.cashierBalancing.cash_register_assignment = null
            this.showFormBalancing = false
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async cargarResumenDia() {
            if (this.getUser.role.id == 1 || this.getUser.role.id == 9) {
                this.cashierBalancing.cash_register_assignment = await this.loadLastCashRegisterAssignmentByCashRegister(this.cashRegister.id)
                if (!this.cashierBalancing.cash_register_assignment) {
                    this.limpiarCampos()
                    Swal.fire('Error', 'No se realizó la apertura para esta caja registradora', 'error')
                    return
                }
            } else {
                this.cashierBalancing.cash_register_assignment = await this.loadLastCashRegisterAssignmentByEmployee(this.getUser.employee.id)
                if (!this.cashierBalancing.cash_register_assignment) {
                    this.limpiarCampos()
                    Swal.fire('Error', 'No está asignado a ninguna caja registradora', 'error')
                    return
                }
            }
            // Cargar movimientos de entrada y salida
            await this.loadCashRegisterMovements(this.cashierBalancing.cash_register_assignment.id)
            this.saldoInicial = this.cashierBalancing.cash_register_assignment.initial_balance
            this.ingresosCaja = this.cash_register_movements.reduce((accumulator, object) => {
                return object.movement_type.toLowerCase() == 'entrada' ? accumulator + object.amount : accumulator
            }, 0)
            this.egresosCaja = this.cash_register_movements.reduce((accumulator, object) => {
                return object.movement_type.toLowerCase() == 'salida' ? accumulator + object.amount : accumulator
            }, 0)
            // Cargar ingresos por ventas
            const orders = await this.loadOrdersByAssigment(this.cashierBalancing.cash_register_assignment.id)
            this.ventas = orders.reduce((accumulator, object) => {
                return accumulator + object.total
            }, 0)
            this.paymentMethods = await this.loadVouchersByAssigment(this.cashierBalancing.cash_register_assignment.id)
            this.showFormBalancing = true
        },
        async consultarCaja() {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            if (this.efectivo < 0 || this.efectivoDigital < 0) {
                Swal.fire('Error', 'El efectivo que ingresa no puede ser negativo', 'error')
                return
            }
            const saldoInicial = parseFloat(this.saldoInicial ? this.saldoInicial : 0)
            const ingresos = parseFloat(this.ingresosCaja ? this.ingresosCaja : 0)
            const egresos = parseFloat(this.egresosCaja ? this.egresosCaja : 0)
            const ventasDia = parseFloat(this.ventas ? this.ventas : 0)
            const efectivoDia = parseFloat(this.efectivo ? this.efectivo : 0)
            const efectivoDigitalDia = parseFloat(this.efectivoDigital ? this.efectivoDigital : 0)
            const formData = new FormData()
            formData.append('total_inflow', ingresos + ventasDia)
            formData.append('total_outflow', egresos)
            formData.append('end_balance', saldoInicial + ingresos + ventasDia - egresos)
            formData.append('real_balance', efectivoDia + efectivoDigitalDia)
            formData.append('state', 0)
            formData.append('cash_register_assignment_id', this.cashierBalancing.cash_register_assignment.id)
            const res = await this.createCashierBalancing(formData)
            if (res[0] != 0) {
                Swal.fire('Guardado', 'Consulta guardada', 'success')
                this.limpiarCampos()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        }
    },
    async mounted() {
        await this.loadCashierBalancingsToday()
        if (this.getUser.role.id == 1 || this.getUser.role.id == 9)
            await this.loadCashRegisters()
        this.headers = [
            { text: "Caja", value: "cash_register_assignment.cash_register.name", sortable: true, width: 35 },
            { text: "Empleado", value: "cash_register_assignment.employee.name", sortable: true, width: 120 },
            { text: "Fecha/Hora", value: "end_datetime", sortable: true, width: 130 },
            { text: "Saldo inicial", value: "cash_register_assignment.initial_balance", width: 75 },
            { text: "Ingresos", value: "total_inflow", width: 75 },
            { text: "Egresos", value: "total_outflow", width: 75 },
            { text: "Total esperado", value: "end_balance", width: 75 },
            { text: "Total real", value: "real_balance", width: 75 }
        ]
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
    background-color: rgba(227, 205, 131, 0.8);
    border-radius: 20px;
}
#seleccion-caja {
    background-color: rgba(227, 205, 131, 0.8);
    border-radius: 20px;
    width: 60%;
}
#close-day {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Caja.png');
    background-size: cover;
}
.panel-close-day {
    width: 50%;
}
.control-form {
    display: flex;
}
.control-seleccion-caja {
    display: flex;
}
.left-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 40%;
}
.right-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 60%;
}
.middle-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 70%;
}
.middle-control-seleccion-caja {
    margin-left: 2em;
    margin-right: 2em;
    width: 90%;
}
#tablaCierreDia {
    padding-bottom: 100px;
}
.botonCargar {
    margin-right: 10px;
}
.botonEliminar {
    margin-left: 10px;
}
.fondo-tabla {
    background-color: lighten($color: #856826, $amount: 40);
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
    overflow-y: auto;
    z-index: 1000 !important;
}
.bgDialog {
    background-color: lighten($color: #E3CD83, $amount: 10);
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
.itemList {
    border-bottom: 1px solid;
    background-color: rgba(133, 104, 38, 0.5);
    margin: 1% 0%;
}
.tituloMenu {
    font-size: 1em;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#close-day::-webkit-scrollbar {
    -webkit-appearance: none;
}
#close-day::-webkit-scrollbar:vertical {
    width:1px;
}
#close-day::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#close-day::-webkit-scrollbar:horizontal {
    height: 10px;
}
#close-day::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#close-day::-webkit-scrollbar-track {
    border-radius: 10px;  
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
}
@media (max-width: 950px) {
    /* For mobile phones: */
    .panel-close-day {
        width: 90%;
    }
    #formulario {
        width: 96%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #seleccion-caja {
        width: 80%;
    }
    .left-control {
        margin-left: 0.3em;
        margin-right: 0.6em;
        width: 97%;
    }
    .right-control {
        margin-left: 0.3em;
        margin-right: 0.6em;
        width: 97%;
    }
    .middle-control {
        margin-left: 0.3em;
        margin-right: 0.3em;
        width: 97%;
    }
    .middle-control-seleccion-caja {
        margin-left: 0.8em;
        margin-right: 0.8em;
        width: 97%;
    }
    .botonCargar {
        margin-right: 1px;
    }
    .botonEliminar {
        margin-left: 1px;
    }
    .texto {
        font-size: 0.9em;
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
}
</style>