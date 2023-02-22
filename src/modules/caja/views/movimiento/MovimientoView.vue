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
    <div v-else id="movements-day" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-movements-day justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Movimientos del día"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="control-form justify-content-center mt-5">
                                <div class="left-control">
                                    <v-combobox
                                        v-model="cashRegisterMovement.movement_type"
                                        :items="['Entrada', 'Salida']"
                                        :rules="[rules.requiredSelection]"
                                        required
                                        label="Seleccione movimiento">
                                    </v-combobox>
                                </div>
                                <div class="right-control text-center">
                                    <v-text-field
                                        label="Ingrese monto"
                                        type="number"
                                        :rules="[rules.required]"
                                        v-model="cashRegisterMovement.amount"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="control-form justify-content-center">
                                <div class="middle-control">
                                    <v-textarea
                                        bg-color="amber-lighten-4"
                                        color="brown"
                                        label="Motivo del movimiento"
                                        no-resize
                                        rows="4"
                                        v-model="cashRegisterMovement.reason"
                                        :rules="[rules.required]">
                                    </v-textarea>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 10px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-broom" class="mb-3 mx-4" rounded color="#679A50" @click="limpiarCampos()">Limpiar campos</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-3 mx-5" rounded color="#679A50" @click="guardarMovimiento()">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaMovimientos" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="getCashRegisterMovementsInOrder()"
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        header-class-name="text-center"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de movimientos en el día">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn v-if="item.state == 1" icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarMovimiento(item.id)"></v-btn>
                                <v-btn v-if="item.state == 1" icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="anularMovimiento(item.id)"></v-btn>
                            </div>
                        </template>
                        <template #item-initial_balance="item">
                            <div class="text-center">
                                {{ item.amount }}
                            </div>
                        </template>
                        <template #item-state="item">
                            <div v-if="item.state == 0">Anulado</div>
                            <div v-if="item.state == 1">Activo</div>
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
            isLoading: true,
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            cashRegisterMovement: {
                id: 0,
                movement_type: '',
                amount: 0,
                reason: '',
                cash_register_assignment: null
            },
            user: {
                username: '',
                password: '',
                state: true,
                role: null,
                employee: null
            },
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('movimiento_caja', ['cash_register_movements']),
        ...mapGetters('movimiento_caja', ['getCashRegisterMovementsInOrder', 'getCashRegisterMovementById']),
        ...mapGetters('login', ['getUser'])
    },
    methods: {
        ...mapActions('asignacion_cajero', ['loadLastCashRegisterAssignmentByEmployee']),
        ...mapActions('movimiento_caja', ['loadCashRegisterMovements', 'createCashRegisterMovement', 'updateCashRegisterMovement']),
        async limpiarCampos() {
            this.cashRegisterMovement.id = 0
            this.cashRegisterMovement.movement_type = ''
            this.cashRegisterMovement.amount = 0
            this.cashRegisterMovement.reason = ''
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarMovimiento() {
            this.$refs.form.validate()
            if (this.cashRegisterMovement.amount == 0 || !this.cashRegisterMovement.reason || !this.cashRegisterMovement.movement_type) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            if (!this.cashRegisterMovement.cash_register_assignment) {
                Swal.fire('Error', 'No tiene asignado una caja registradora para realizar esta operación', 'error')
                return
            }
            Swal.showLoading()
            let res = []
            if (this.cashRegisterMovement.id == 0) {
                const formData = new FormData()
                formData.append('movement_type', this.cashRegisterMovement.movement_type)
                formData.append('amount', this.cashRegisterMovement.amount)
                formData.append('reason', this.cashRegisterMovement.reason)
                formData.append('state', 1)
                formData.append('cash_register_assignment_id', this.cashRegisterMovement.cash_register_assignment.id)
                res = await this.createCashRegisterMovement(formData)
            } else {
                const formData = new FormData()
                formData.append('movement_type', this.cashRegisterMovement.movement_type)
                formData.append('amount', this.cashRegisterMovement.amount)
                formData.append('reason', this.cashRegisterMovement.reason)
                res = await this.updateCashRegisterMovement([this.cashRegisterMovement.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.cashRegisterMovement.id == 0 ? 'Se guardó movimiento' : 'Se actualizaron los datos del movimiento', 'success')
                this.limpiarCampos()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        cargarMovimiento(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let movement = this.getCashRegisterMovementById(id)
            if (!movement) {
                Swal.fire('Error', 'No se pudo cargar los datos del plato seleccionado', 'error')
            } else {
                this.cashRegisterMovement = movement
                Swal.close()
            }
        },
        async anularMovimiento(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a revertir el movimiento seleccionado',
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
                formData.append('state', 0)
                const res = await this.updateCashRegisterMovement([id, formData])
                if (res[0] != 0) {
                    Swal.fire('Guardado', 'Se anuló el movimiento', 'success')
                    this.limpiarCampos()
                } else {
                    Swal.fire('Error', res[1], 'error')
                }
            }
        }
    },
    async mounted() {
        this.user = this.getUser
        this.cashRegisterMovement.cash_register_assignment = await this.loadLastCashRegisterAssignmentByEmployee(this.user.employee.id)
        if (this.cashRegisterMovement.cash_register_assignment)
            await this.loadCashRegisterMovements(this.cashRegisterMovement.cash_register_assignment.id)
        this.headers = [
            { text: "Movimiento", value: "movement_type", sortable: true, width: 60 },
            { text: "Estado", value: "state", sortable: true, width: 70 },
            { text: "Monto", value: "amount", width: 60 },
            { text: "Motivo", value: "reason", width: 200 },
            { text: "Acciones", value: "action", width: 120 }
        ]
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 260px;
}
#formulario {
    background-color: rgba(227, 205, 131, 0.8);
    border-radius: 20px;
}
#movements-day {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Caja.png');
    background-size: cover;
}
.panel-movements-day {
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
    width: 50%;
}
#tablaMovimientos {
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
#movements-day::-webkit-scrollbar {
    -webkit-appearance: none;
}
#movements-day::-webkit-scrollbar:vertical {
    width:1px;
}
#movements-day::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#movements-day::-webkit-scrollbar:horizontal {
    height: 10px;
}
#movements-day::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#movements-day::-webkit-scrollbar-track {
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
    .panel-movements-day {
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