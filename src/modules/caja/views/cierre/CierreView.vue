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
                        title="Cierre de caja"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <div class="row justify-content-center mb-4">
                    <div id="seleccion-caja" class="animate__animated animate__flipInY">
                        <div class="control-seleccion-caja justify-content-center mt-5">
                            <div class="middle-control-seleccion-caja">
                                <v-combobox
                                    v-model="cashRegister"
                                    :items="cash_registers"
                                    item-value="id"
                                    item-title="name"
                                    hide-details="auto"
                                    :rules="[rules.requiredSelection]"
                                    required
                                    label="Seleccione caja">
                                </v-combobox>
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
                                <v-btn prepend-icon="mdi-content-save" class="mb-3 mx-5" rounded color="#679A50" @click="cerrarCaja()">Guardar y cerrar caja</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaCierreDia" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="getCashierBalancingsClosedInOrder()"
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        header-class-name="text-center"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de cierre de caja">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn v-if="item.state == 1" icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="anularCierre(item.id, item.cash_register_assignment.id)"></v-btn>
                            </div>
                        </template>
                        <template #item-initial_balance="item">
                            <div class="text-center">
                                {{ item.cash_register_assignment.initial_balance }}
                            </div>
                        </template>
                        <template #item-state="item">
                            <div v-if="item.state == 1">Cierre de caja</div>
                            <div v-if="item.state == 2">Cierre anulado</div>
                        </template>
                    </easy-data-table>
                </div>
            </div>
        </div>
    </div>
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
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('caja_registradora', ['cash_registers']),
        ...mapState('movimiento_caja', ['cash_register_movements']),
        ...mapGetters('balance_caja', ['getCashierBalancingsClosedInOrder', 'isLoading']),
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
        }
    },
    methods: {
        ...mapActions('caja_registradora', ['loadCashRegisters']),
        ...mapActions('asignacion_cajero', ['loadLastCashRegisterAssignmentByCashRegister', 'updateCashRegisterAssignment']),
        ...mapActions('movimiento_caja', ['loadCashRegisterMovements']),
        ...mapActions('balance_caja', ['loadCashierBalancingsToday', 'createCashierBalancing', 'updateCashierBalancing']),
        ...mapActions('pedido', ['loadOrdersByAssigment']),
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
            this.cashierBalancing.cash_register_assignment = await this.loadLastCashRegisterAssignmentByCashRegister(this.cashRegister.id)
            if (!this.cashierBalancing.cash_register_assignment) {
                this.limpiarCampos()
                Swal.fire('Error', 'No se realizó la apertura para esta caja registradora', 'error')
                return
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
            this.showFormBalancing = true
        },
        async cerrarCaja() {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
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
            formData.append('state', 1)
            formData.append('cash_register_assignment_id', this.cashierBalancing.cash_register_assignment.id)
            const res = await this.createCashierBalancing(formData)
            if (res[0] != 0) {
                const formAssignment = new FormData()
                formAssignment.append('state', 1)
                const res2 = await this.updateCashRegisterAssignment([this.cashierBalancing.cash_register_assignment.id, formData])
                if (res2[0] != 0) {
                    Swal.fire('Guardado', 'Se cerró la caja', 'success')
                } else {
                    Swal.fire('Guardado', 'Se cerró la caja, pero no se actualizó el estado de cierre', 'success')
                }
                this.limpiarCampos()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async anularCierre(id, idAsignacion) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a revertir el cierre de caja',
                showDenyButton: true,
                denyButtonColor: '#E75D48',
                denyButtonText: ' <i class="fa fa-thumbs-down"></i>  No, mejor no',
                confirmButtonColor: '#679A50',
                confirmButtonText: '<i class="fa fa-thumbs-up"></i>  Sí, estoy seguro',
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
                const formData = new FormData()
                formData.append('state', 2)
                const res = await this.updateCashierBalancing([id, formData])
                if (res[0] != 0) {
                    const formAssignment = new FormData()
                    formAssignment.append('state', 0)
                    const res2 = await this.updateCashRegisterAssignment([idAsignacion, formAssignment])
                    if (res2[0] != 0) {
                        Swal.fire('Guardado', 'Se anuló el cierre de caja', 'success')
                    } else {
                        Swal.fire('Guardado', 'Se anuló el cierre, pero no se actualizó el estado', 'success')
                    }
                    this.limpiarCampos()
                } else {
                    Swal.fire('Error', res[1], 'error')
                }
            }
        }
    },
    async mounted() {
        if (this.getUser.role.id == 1) {
            await this.loadCashierBalancingsToday()
            await this.loadCashRegisters()
            this.headers = [
                { text: "Caja", value: "cash_register_assignment.cash_register.name", sortable: true, width: 35 },
                { text: "Empleado", value: "cash_register_assignment.employee.name", sortable: true, width: 120 },
                { text: "Saldo inicial", value: "cash_register_assignment.initial_balance", width: 75 },
                { text: "Ingresos", value: "total_inflow", width: 75 },
                { text: "Egresos", value: "total_outflow", width: 75 },
                { text: "Total esperado", value: "end_balance", width: 75 },
                { text: "Total real", value: "real_balance", width: 75 },
                { text: "Estado", value: "state", width: 90 },
                { text: "Acciones", value: "action" }
            ]
        } else {
            this.$router.push({name: 'home'})
        }
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 210px;
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
}
</style>