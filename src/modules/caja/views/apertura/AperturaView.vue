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
    <div v-else id="beginning-day" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-beginning-day justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Inicio de día"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="control-form justify-content-center mt-5">
                                <div class="left-control">
                                    <v-combobox
                                        v-model="cashRegisterAssignment.cash_register"
                                        :items="cash_registers"
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        required
                                        label="Seleccione caja">
                                    </v-combobox>
                                </div>
                                <div class="right-control text-center">
                                    <v-combobox
                                        v-model="cashRegisterAssignment.employee"
                                        :items="getCompleteNamesOfEmployees()"
                                        item-value="id"
                                        item-title="fullName"
                                        :rules="[rules.requiredSelection]"
                                        required
                                        label="Seleccione empleado">
                                    </v-combobox>
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="middle-control">
                                    <v-text-field
                                        label="Ingrese saldo inicial"
                                        hide-details="auto"
                                        type="number"
                                        :rules="[rules.required]"
                                        v-model="cashRegisterAssignment.initial_balance"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 10px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-broom" class="mb-3 mx-4" rounded color="#679A50" @click="limpiarCampos()">Limpiar campos</v-btn>
                                <v-btn prepend-icon="mdi-timer-lock-open-outline" class="mb-3 mx-5" rounded color="#679A50" @click="iniciarDia()">Iniciar día</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaInicioDia" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="getCashRegisterAssignmentsInOrder()"
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        header-class-name="text-center"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de inicios o cierres de día">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn v-if="item.state == 0" icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="anularInicio(item.id)"></v-btn>
                            </div>
                        </template>
                        <template #item-initial_balance="item">
                            <div class="text-center">
                                {{ item.initial_balance }}
                            </div>
                        </template>
                        <template #item-state="item">
                            <div v-if="item.state == 0">Inicio de día</div>
                            <div v-if="item.state == 1">Cierre de día</div>
                            <div v-if="item.state == 2">Apertura anulada</div>
                        </template>
                    </easy-data-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Swal from "sweetalert2";

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
            cashRegisterAssignment: {
                id: 0,
                initial_balance: 0,
                cash_register: null,
                employee: null
            },
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('caja_registradora', ['cash_registers']),
        ...mapState('asignacion_cajero', ['cash_register_assignments', 'isLoading']),
        ...mapState('empleado', ['employees']),
        ...mapGetters('empleado', ['getCompleteNamesOfEmployees']),
        ...mapGetters('asignacion_cajero', ['getCashRegisterAssignmentsInOrder'])
    },
    methods: {
        ...mapActions('caja_registradora', ['loadCashRegisters']),
        ...mapActions('empleado', ['loadEmployees']),
        ...mapActions('asignacion_cajero', ['loadCashRegisterAssignments', 'createCashRegisterAssignment', 'updateCashRegisterAssignment']),
        async limpiarCampos() {
            this.cashRegisterAssignment.id = 0
            this.cashRegisterAssignment.initial_balance = 0
            this.cashRegisterAssignment.cash_register = null
            this.cashRegisterAssignment.employee = null
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async iniciarDia() {
            this.$refs.form.validate()
            if (this.cashRegisterAssignment.initial_balance == 0 || !this.cashRegisterAssignment.cash_register || !this.cashRegisterAssignment.employee) return
            if (this.cash_register_assignments.some(asignacion => asignacion.state == 0 && asignacion.cash_register.id == this.cashRegisterAssignment.cash_register.id)) {
                Swal.fire('Error', 'Ya se inició el día', 'error')
                return
            }  
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const formData = new FormData()
            formData.append('initial_balance', this.cashRegisterAssignment.initial_balance)
            formData.append('state', 0)
            formData.append('cash_register_id', this.cashRegisterAssignment.cash_register.id)
            formData.append('employee_id', this.cashRegisterAssignment.employee.id)
            const res = await this.createCashRegisterAssignment(formData)
            if (res[0] != 0) {
                Swal.fire('Guardado', 'Se inició el día', 'success')
                this.limpiarCampos()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async anularInicio(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a revertir el inicio de día',
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
                const res = await this.updateCashRegisterAssignment([id, formData])
                if (res[0] != 0) {
                    Swal.fire('Guardado', 'Se anuló el inicio de día', 'success')
                    this.limpiarCampos()
                } else {
                    Swal.fire('Error', res[1], 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadCashRegisterAssignments()
        await this.loadCashRegisters()
        await this.loadEmployees()
        this.headers = [
            { text: "Caja", value: "cash_register.name", sortable: true, width: 35 },
            { text: "Nombre Empleado", value: "employee.name", sortable: true, width: 140 },
            { text: "Apellidos Empleado", value: "employee.surname", sortable: true, width: 150 },
            { text: "Saldo inicial", value: "initial_balance", width: 75 },
            { text: "Estado", value: "state", width: 90 },
            { text: "Acciones", value: "action" }
        ]
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
#beginning-day {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-beginning-day {
    width: 50%;
}
.control-form {
    display: flex;
}
.left-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 50%;
}
.right-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 50%;
}
.middle-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 25%;
}
#tablaInicioDia {
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
#beginning-day::-webkit-scrollbar {
    -webkit-appearance: none;
}
#beginning-day::-webkit-scrollbar:vertical {
    width:1px;
}
#beginning-day::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#beginning-day::-webkit-scrollbar:horizontal {
    height: 10px;
}
#beginning-day::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#beginning-day::-webkit-scrollbar-track {
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
    .panel-beginning-day {
        width: 90%;
    }
    #formulario {
        width: 96%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .control-form {
        display: block;
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
    .botonCargar {
        margin-right: 1px;
    }
    .botonEliminar {
        margin-left: 1px;
    }
}
</style>