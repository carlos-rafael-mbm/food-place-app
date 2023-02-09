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
    <div v-else id="measurement-unit" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-unit justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Unidades de medida"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 70%" class="left-control mt-5">
                                    <label for="txtNombreUnidadMedida" style="font-weight: bold">Unidad de medida</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-weight-kilogram"
                                        :rules="[rules.required]"
                                        v-model="measurement_unit.description"
                                        placeholder="Ej: Kilogramo, Litro"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 30%" class="right-control mt-5">
                                    <label for="txtNombreUnidadMedida" style="font-weight: bold">Abreviatura</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-scale-balance"
                                        :rules="[rules.required]"
                                        v-model="measurement_unit.abbreviation"
                                        placeholder="Ej: Kg., Lt."
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center align-items-center">
                                <div class="text-center">
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="measurement_unit.state">
                                    </v-checkbox>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#E75D48" @click="nuevaUnidadMedida()">Nueva unidad</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#E75D48" @click="guardarUnidadMedida()">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaUnidades" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="measurement_units"
                        :theme-color="themeColor"
                        :rows-per-page="5"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de unidades de medida">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarUnidadMedida(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarUnidadMedida(item.id)"></v-btn>
                            </div>
                        </template>
                        <template #item-state="item">
                            <div v-if="item.state == 1">Activo</div>
                            <div v-else>Inactivo</div>
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
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            measurement_unit: {
                id: 0,
                description: '',
                abbreviation: '',
                state: true
            },
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapState('unidad_medida', ['measurement_units', 'isLoading']),
        ...mapGetters('unidad_medida', ['getMeasurementUnitById'])
    },
    methods: {
        ...mapActions('unidad_medida', ['loadMeasurementUnits', 'createMeasurementUnit', 'updateMeasurementUnit', 'deleteMeasurementUnit']),
        nuevaUnidadMedida() {
            this.measurement_unit.id = 0
            this.measurement_unit.description = ''
            this.measurement_unit.abbreviation = ''
            this.measurement_unit.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarUnidadMedida() {
            this.$refs.form.validate()
            if (!this.measurement_unit.description || !this.measurement_unit.abbreviation) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.measurement_unit.id == 0) {
                const formData = new FormData()
                formData.append('description', this.measurement_unit.description)
                formData.append('abbreviation', this.measurement_unit.abbreviation)
                formData.append('state', this.measurement_unit.state ? 1 : 0)
                res = await this.createMeasurementUnit(formData)
            } else {
                const formData = new FormData()
                formData.append('description', this.measurement_unit.description)
                formData.append('abbreviation', this.measurement_unit.abbreviation)
                formData.append('state', this.measurement_unit.state ? 1 : 0)
                res = await this.updateMeasurementUnit([this.measurement_unit.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.measurement_unit.id == 0 ? 'Unidad de medida registrada correctamente' : 'Unidad de medida actualizada correctamente', 'success')
                this.nuevaUnidadMedida()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarUnidadMedida(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const unidad_medida = this.getMeasurementUnitById(id)
            if (!unidad_medida) {
                Swal.fire('Error', 'No se pudo cargar los datos de la unidad de medida seleccionada', 'error')
            } else {
                this.measurement_unit = unidad_medida
                this.measurement_unit.state = this.measurement_unit.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarUnidadMedida(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar la unidad de medida seleccionada',
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
                try {
                    await this.deleteMeasurementUnit(id)
                    Swal.fire('Eliminado', 'La unidad de medida fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La unidad de medida no pudo ser eliminada', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadMeasurementUnits()
        this.headers = [
                { text: "Nombre", value: "description", sortable: true },
                { text: "Abreviatura", value: "abbreviation", sortable: true },
                { text: "Estado", value: "state" },
                { text: "Acciones", value: "action", width: 100 }
            ]
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(231, 93, 72, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 400px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
#measurement-unit {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.panel-unit {
    width: 50%;
}
.left-control {
    margin-left: 2em;
    margin-right: 1em;
}
.right-control {
    margin-left: 1em;
    margin-right: 2em;
}
#tablaUnidades {
    padding-bottom: 100px;
}
.customize-table {
    --easy-table-border: 1px solid #856826;
    --easy-table-row-border: 1px solid #856826;

    --easy-table-header-font-color: white;
    --easy-table-header-background-color: #E75D48;

    --easy-table-body-even-row-background-color: #CFBF88;
    --easy-table-body-row-background-color: #CFBF88; //lighten($color: #856826, $amount: 40);
    --easy-table-body-row-hover-background-color: #D5ADA7;

    --easy-table-footer-background-color: #E75D48;
    --easy-table-footer-font-color: white;

    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#measurement-unit::-webkit-scrollbar {
    -webkit-appearance: none;
}
#measurement-unit::-webkit-scrollbar:vertical {
    width:1px;
}
#measurement-unit::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#measurement-unit::-webkit-scrollbar:horizontal {
    height: 10px;
}
#measurement-unit::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#measurement-unit::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .titulo {
        width: 350px;
    }
    .panel-unit {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaUnidades {
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
}
</style>