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
    <div v-else id="preparation-area" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-preparation-area justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Áreas de preparación"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="line-control justify-content-center align-items-center mt-5">
                                <div class="right-control">
                                    <v-text-field
                                        label="Nombre del área"
                                        :rules="[rules.required]"
                                        v-model="preparationArea.name"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="line-control justify-content-center">
                                <div class="left-control text-center">
                                    <v-textarea
                                        bg-color="amber-lighten-4"
                                        color="brown"
                                        label="Describe el área de preparación"
                                        no-resize
                                        rows="3"
                                        v-model="preparationArea.description">
                                    </v-textarea>
                                </div>
                                <div class="right-control">
                                    <div class="d-flex justify-content-center">
                                        <div class="mx-auto text-center">
                                            <v-checkbox
                                                label="Activo"
                                                color="brown"
                                                hide-details
                                                v-model="preparationArea.state">
                                            </v-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevaAreaPreparacion()">Nueva área</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarAreaPreparacion()">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaPreparacionArea" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="preparation_areas"
                        :theme-color="themeColor"
                        :rows-per-page="5"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de áreas de preparación">
                        <template #expand="item">
                            <div v-if="item.description" class="text-left ps-15">
                                {{item.description}}
                            </div>
                            <div v-else class="text-left ps-15">
                                Sin descripción
                            </div>
                        </template>
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarAreaPreparacion(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarAreaPreparacion(item.id)"></v-btn>
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
import Swal from "sweetalert2"

export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            preparationArea: {
                id: 0,
                name: '',
                description: '',
                state: true
            },
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('area_preparacion', ['isLoading', 'preparation_areas']),
        ...mapGetters('area_preparacion', ['getPreparationAreaById']),
    },
    methods: {
        ...mapActions('area_preparacion', ['loadPreparationAreas', 'createPreparationArea', 'updatePreparationArea', 'deletePreparationArea']),
        nuevaAreaPreparacion() {
            this.preparationArea.id = 0
            this.preparationArea.name = ''
            this.preparationArea.description = ''
            this.preparationArea.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarAreaPreparacion() {
            this.$refs.form.validate()
            if (!this.preparationArea.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.preparationArea.id == 0) {
                const formData = new FormData()
                formData.append('name', this.preparationArea.name)
                formData.append('description', this.preparationArea.description ? this.preparationArea.description : '')
                formData.append('state', this.preparationArea.state ? 1 : 0)
                res = await this.createPreparationArea(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.preparationArea.name)
                formData.append('description', this.preparationArea.description ? this.preparationArea.description : '')
                formData.append('state', this.preparationArea.state ? 1 : 0)
                res = await this.updatePreparationArea([this.preparationArea.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.preparationArea.id == 0 ? 'Área de preparación registrada correctamente' : 'Área de preparación actualizada correctamente', 'success')
                this.nuevaAreaPreparacion()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        cargarAreaPreparacion(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let area = this.getPreparationAreaById(id)
            if (!area) {
                Swal.fire('Error', 'No se pudo cargar los datos del área de preparación seleccionada', 'error')
            } else {
                this.preparationArea = area
                this.preparationArea.state = this.preparationArea.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarAreaPreparacion(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar el área de preparación seleccionada',
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
                    await this.deletePreparationArea(id)
                    Swal.fire('Eliminado', 'Área de preparación fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'Área de preparación no pudo ser eliminada', 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadPreparationAreas()
        this.headers = [
            { text: "Nombre", value: "name", sortable: true, width: 150 },
            { text: "Estado", value: "state", sortable: true },
            { text: "Acciones", value: "action", width: 100 }
        ]
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 340px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    // width: 50%;
    border-radius: 20px;
}
#preparation-area {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-preparation-area {
    width: 50%;
}
.line-control {
    display: flex !important;
}
.middle-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 100%;
}
.left-control {
    margin-left: 2em;
    margin-right: 1em;
    width: 50%;
}
.right-control {
    margin-left: 1em;
    margin-right: 2em;
    width: 50%;
}
#tablaPreparacionArea {
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
#preparation-area::-webkit-scrollbar {
    -webkit-appearance: none;
}
#preparation-area::-webkit-scrollbar:vertical {
    width:1px;
}
#preparation-area::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#preparation-area::-webkit-scrollbar:horizontal {
    height: 10px;
}
#preparation-area::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#preparation-area::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 850px) {
    /* For mobile phones: */
    .panel-preparation-area {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaPreparacionArea {
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .line-control {
        display: block !important;
    }
    .middle-control {
        margin-left: 0em;
        margin-right: 0em;
        width: 100%;
    }
    .left-control {
        width: 100%;
        margin-left: 0em;
        margin-right: 0em;
    }
    .right-control {
        width: 100%;
        margin-left: 0em;
        margin-right: 0em;
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