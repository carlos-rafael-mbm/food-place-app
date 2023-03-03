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
    <div v-else id="supply" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-supply justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Insumos"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 50%" class="left-control mt-5">
                                    <label for="txtCategoria" style="font-weight: bold">Categoría</label>
                                    <v-select
                                        v-model="supply.category_supply"
                                        :items="categories_supply"
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"
                                        return-object
                                        required>
                                    </v-select>
                                </div>
                                <div style="width: 50%" class="right-control mt-5">
                                    <label for="txtUnidadMedida" style="font-weight: bold">Unid. Medida</label>
                                    <v-select
                                        v-model="supply.measurement_unit"
                                        :items="measurement_units"
                                        item-value="id"
                                        item-title="abbreviation"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"
                                        return-object
                                        required>
                                    </v-select>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center">
                                <div style="width: 100%" class="middle-control">
                                    <label for="txtNombreInsumo" style="font-weight: bold">Nombre</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-shaker"
                                        :rules="[rules.required]"
                                        v-model="supply.name"
                                        placeholder="Ingrese insumo"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#E75D48" @click="nuevoInsumo()">Nuevo insumo</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#E75D48" @click="guardarInsumo()">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaInsumos" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="supplies"
                        :theme-color="themeColor"
                        :rows-per-page="15"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de insumos">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarInsumo(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarInsumo(item.id)"></v-btn>
                            </div>
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
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            supply: {
                id: 0,
                name: '',
                measurement_unit: null,
                category_supply: null
            },
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapState('categoria_insumo', ['categories_supply']),
        ...mapState('unidad_medida', ['measurement_units']),
        ...mapState('insumo', ['supplies', 'isLoading']),
        ...mapGetters('insumo', ['getSupplyById'])
    },
    methods: {
        ...mapActions('categoria_insumo', ['loadCategoriesSupply']),
        ...mapActions('unidad_medida', ['loadMeasurementUnits']),
        ...mapActions('insumo', ['loadSupplies', 'createSupply', 'updateSupply', 'deleteSupply']),
        nuevoInsumo() {
            this.supply.id = 0
            this.supply.name = ''
            this.supply.measurement_unit = null
            this.supply.category_supply = null
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarInsumo() {
            this.$refs.form.validate()
            if (!this.supply.name || !this.supply.measurement_unit.id || !this.supply.category_supply.id) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.supply.id == 0) {
                const formData = new FormData()
                formData.append('name', this.supply.name)
                formData.append('measurement_unit_id', this.supply.measurement_unit.id)
                formData.append('category_supply_id', this.supply.category_supply.id)
                res = await this.createSupply(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.supply.name)
                formData.append('measurement_unit_id', this.supply.measurement_unit.id)
                formData.append('category_supply_id', this.supply.category_supply.id)
                res = await this.updateSupply([this.supply.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.supply.id == 0 ? 'Insumo registrado correctamente' : 'Insumo actualizado correctamente', 'success')
                this.nuevoInsumo()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarInsumo(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const insumo = this.getSupplyById(id)
            if (!insumo) {
                Swal.fire('Error', 'No se pudo cargar los datos del insumo seleccionado', 'error')
            } else {
                this.supply = insumo
                this.supply.state = this.supply.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarInsumo(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar el insumo seleccionado',
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
                    await this.deleteSupply(id)
                    Swal.fire('Eliminado', 'El insumo fue eliminado', 'success')
                } catch (error) {
                    Swal.fire('Error', 'El insumo no pudo ser eliminado', 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadSupplies()
        await this.loadCategoriesSupply()
        await this.loadMeasurementUnits()
        this.headers = [
                { text: "Nombre", value: "name", sortable: true },
                { text: "Categoría", value: "category_supply.name" },
                { text: "Unid. Medida", value: "measurement_unit.abbreviation" },
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
    width: 300px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
#supply {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.panel-supply {
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
.middle-control {
    margin-left: 2em;
    margin-right: 2em;
}
#tablaInsumos {
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
#supply::-webkit-scrollbar {
    -webkit-appearance: none;
}
#supply::-webkit-scrollbar:vertical {
    width:1px;
}
#supply::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#supply::-webkit-scrollbar:horizontal {
    height: 10px;
}
#supply::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#supply::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .panel-supply {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaInsumos {
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
    .middle-control {
        margin-left: 0em;
        margin-right: 0em;
    }
}
</style>