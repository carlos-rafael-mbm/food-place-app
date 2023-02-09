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
    <div v-else id="promotion" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-promotion justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Promociones"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 60%" class="left-control mt-5">
                                    <label for="txtNombrePromocion" style="font-weight: bold">Nombre de promoción</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-percent-circle"
                                        :rules="[rules.required]"
                                        v-model="promotion.name"
                                        placeholder="Ingrese un nombre"
                                        required>
                                    </v-text-field>
                                    <br>
                                    <v-textarea
                                        bg-color=""
                                        color="brown"
                                        label="Describe tu promoción"
                                        no-resize
                                        rows="3"
                                        v-model="promotion.description">
                                    </v-textarea>
                                </div>
                                <div style="width: 40%" class="right-control mt-7 text-center">
                                    <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                    <img v-if="localImage"
                                        :src="localImage"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <img v-else-if="promotion.image"
                                        :src="promotion.image"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <img v-else
                                        src="@/assets/img/no-image.png"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <br>
                                    <v-btn prepend-icon="mdi-upload" rounded size="small" color="#679A50" @click="onSelectImage">Subir foto</v-btn>
                                    <br>
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="promotion.state">
                                    </v-checkbox>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mb-4">
                                <div style="width: 50%" class="left-control text-center">
                                    <label for="txtFechaInicio" style="font-weight: bold">Fecha de inicio</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="promotion.start_date"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 50%" class="right-control text-center">
                                    <label for="txtFechaFin" style="font-weight: bold">Fecha de fin</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="promotion.end_date"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevaPromocion">Nueva promoción</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarPromocion">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaPromociones" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="promotions"
                        :theme-color="themeColor"
                        :rows-per-page="5"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de promociones">
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
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarPromocion(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarPromocion(item.id)"></v-btn>
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
import uploadImage from '@/helpers/uploadImage';

export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            localImage: null,
            file: null,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
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
            headers: [],
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('promocion', ['promotions', 'isLoading']),
        ...mapGetters('promocion', ['getPromotionById'])
    },
    methods: {
        ...mapActions('promocion', ['loadPromotions', 'createPromotion', 'updatePromotion', 'deletePromotion']),
        onSelectedImage(event) {
            const file = event.target.files[0]
            if (!file) {
                this.localImage = null
                this.file = null
                return
            }
            this.file = file
            const fr = new FileReader()
            fr.onload = () => this.localImage = fr.result
            fr.readAsDataURL(file)
        },
        onSelectImage() {
            this.$refs.imageSelector.click()
        },
        nuevaPromocion() {
            this.localImage = null
            this.file = null
            this.promotion.id = 0
            this.promotion.name = ''
            this.promotion.start_date = null
            this.promotion.end_date = null
            this.promotion.description = ''
            this.promotion.discount = ''
            this.promotion.image = ''
            this.promotion.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarPromocion() {
            this.$refs.form.validate()
            if (!this.promotion.name || !this.promotion.start_date || !this.promotion.end_date) return
            if (this.promotion.end_date < this.promotion.start_date) {
                Swal.fire('Error', 'La fecha fin debe ser mayor o igual a la fecha de inicio de la promoción', 'error')
                return
            }
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const image = await uploadImage(this.file)
            if (image)
                this.promotion.image = image
            let res = []
            if (this.promotion.id == 0) {
                const formData = new FormData()
                formData.append('name', this.promotion.name)
                formData.append('start_date', this.promotion.start_date)
                formData.append('end_date', this.promotion.end_date)
                formData.append('description', this.promotion.description ? this.promotion.description : '')
                formData.append('discount', this.promotion.discount ? this.promotions.discount : '')
                formData.append('image', this.promotion.image ? this.promotion.image : '')
                formData.append('state', this.promotion.state ? 1 : 0)
                res = await this.createPromotion(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.promotion.name)
                formData.append('start_date', this.promotion.start_date)
                formData.append('end_date', this.promotion.end_date)
                formData.append('description', this.promotion.description ? this.promotion.description : '')
                formData.append('image', this.promotion.image ? this.promotion.image : '')
                formData.append('state', this.promotion.state ? 1 : 0)
                res = await this.updatePromotion([this.promotion.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.promotion.id == 0 ? 'Promoción registrada correctamente' : 'Promoción actualizada correctamente', 'success')
                this.nuevaPromocion()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarPromocion(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let promocion = this.getPromotionById(id)
            if (!promocion) {
                Swal.fire('Error', 'No se pudo cargar los datos de la promoción seleccionada', 'error')
            } else {
                this.promotion = promocion
                this.promotion.state = this.promotion.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarPromocion(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar la promoción seleccionada',
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
                    await this.deletePromotion(id)
                    Swal.fire('Eliminado', 'La promoción fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La promoción no pudo ser eliminada', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadPromotions()
        this.headers = [
                { text: "Nombre", value: "name", sortable: true, width: 160 },
                { text: "Fecha inicio", value: "start_date", width: 90 },
                { text: "Fecha fin", value: "end_date", width: 90 },
                { text: "Estado", value: "state" },
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
    width: 300px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    // width: 50%;
    border-radius: 20px;
}
#promotion {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-promotion {
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
#tablaPromociones {
    padding-bottom: 100px;
}
img {
    width: 100px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
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
#promotion::-webkit-scrollbar {
    -webkit-appearance: none;
}
#promotion::-webkit-scrollbar:vertical {
    width:1px;
}
#promotion::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#promotion::-webkit-scrollbar:horizontal {
    height: 10px;
}
#promotion::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#promotion::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .panel-promotion {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaPromociones {
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