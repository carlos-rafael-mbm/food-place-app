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
    <div v-else id="item_menu" class="d-flex">
        <div class="text-center py-4 panel1" style="max-width:25%">
            <v-card
                class="mx-auto animate__animated animate__flipInY"
                max-width="75%"
                variant="outlined">
                <v-img
                    heigth="100%"
                    :src="require('@/assets/img/Tazas-con-girasoles.jpg')"
                    cover>
                    <div class="fill-height bottom-gradient"></div>
                </v-img>
            </v-card>
            <v-card
                class="mx-auto my-3 border-0 animate__animated animate__flipInY"
                max-width="50%"
                variant="outlined">
                <img class="img mx-2 my-2" alt="Empresa" src="@/assets/logo.jpg">
            </v-card>
        </div>
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div id="auxiliar" style="width:42%"></div>
            <div class="formulario justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Relación de platos"
                        class="text-center text-light titulo animate__animated animate__flipInY"
                    ></v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="d-flex justify-content-center mb-2">
                        <div class="row justify-content-center align-items-center animate__animated animate__flipInY">
                            <div class="my-2 text-center">
                                <v-expansion-panels>
                                    <v-expansion-panel class="panelItemMenu">
                                        <v-expansion-panel-title>
                                            <template v-slot:default="{ expanded }">
                                                <v-row no-gutters>
                                                    <v-col cols="4" class="d-flex justify-start">
                                                        Platos - Bebidas
                                                    </v-col>
                                                    <v-col cols="8" class="text-brown">
                                                        <v-fade-transition leave-absolute>
                                                            <span
                                                                v-if="expanded"
                                                                key="0">
                                                                Ingresa o modifica los datos del plato/bebida
                                                            </span>
                                                            <span
                                                                v-else
                                                                key="1">
                                                                Ingresa o modifica los datos del plato/bebida
                                                            </span>
                                                        </v-fade-transition>
                                                    </v-col>
                                                </v-row>
                                            </template>
                                        </v-expansion-panel-title>
                                        <v-expansion-panel-text>
                                            <div class="panelFormBase justify-content-center">
                                                <div class="panelForm" style="width: 100%">
                                                    <v-select
                                                        v-model="item_menu.preparation_area"
                                                        :items="getActivePreparationAreas()"
                                                        item-value="id"
                                                        item-title="name"
                                                        :rules="[rules.requiredSelection]"
                                                        label="Seleccione un área de preparación"
                                                        required
                                                        return-object>
                                                    </v-select>
                                                </div>
                                            </div>
                                            <div class="panelFormBase justify-content-center">
                                                <div class="panelForm">
                                                    <v-select
                                                        v-model="item_menu.category"
                                                        :items="categories"
                                                        item-value="id"
                                                        item-title="name"
                                                        :rules="[rules.requiredSelection]"
                                                        label="Seleccione una categoría"
                                                        required
                                                        return-object>
                                                    </v-select>
                                                </div>
                                                <div class="panelForm">
                                                    <v-text-field
                                                        label="Nombre del plato o bebida"
                                                        hide-details="auto"
                                                        prepend-inner-icon="mdi-food-fork-drink"
                                                        :rules="[rules.required]"
                                                        v-model="item_menu.name"
                                                        required>
                                                    </v-text-field>
                                                </div>
                                            </div>
                                            <div class="panelFormBase justify-content-center">
                                                <div class="panelForm">
                                                    <div class="d-flex justify-content-center my-2">
                                                        <div style="width: 40%">
                                                            <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                                            <img v-if="localImage"
                                                                :src="localImage"
                                                                alt="entry-picture" class="img-thumbnail mb-2">
                                                            <img v-else-if="item_menu.image"
                                                                :src="item_menu.image"
                                                                alt="entry-picture" class="img-thumbnail mb-2">
                                                            <img v-else
                                                                src="@/assets/img/no-image.png"
                                                                alt="entry-picture" class="img-thumbnail mb-2">
                                                            <br>
                                                            <v-btn prepend-icon="mdi-upload" rounded size="small" color="#679A50" @click="onSelectImage">Subir foto</v-btn>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="panelForm">
                                                    <v-checkbox
                                                        v-model="disabled"
                                                        label="¿Quieres decir algo más?">
                                                    </v-checkbox>
                                                    <v-textarea
                                                        bg-color="amber-lighten-4"
                                                        color="brown"
                                                        label="Describe tu plato o cuenta su historia"
                                                        no-resize
                                                        rows="3"
                                                        v-model="item_menu.brief"
                                                        v-show="disabled">
                                                    </v-textarea>
                                                </div>
                                            </div>
                                            <div class="panelFormBase justify-content-center">
                                                <div class="panelForm">
                                                    <v-text-field
                                                        label="Costo"
                                                        prefix="S/"
                                                        v-model="item_menu.cost"
                                                        type="number">
                                                    </v-text-field>
                                                </div>
                                                <div class="panelForm">
                                                    <v-checkbox
                                                        label="Activo"
                                                        color="brown"
                                                        hide-details
                                                        v-model="item_menu.state">
                                                    </v-checkbox>
                                                </div>
                                            </div>
                                            <hr style="border-top: 5px solid; margin-bottom: 2px">
                                            <div class="text-center">
                                                <v-btn prepend-icon="mdi-plus-circle" class="mt-1 mx-4" rounded color="#679A50" @click="nuevoItemMenu">Nuevo ítem</v-btn>
                                                <v-btn prepend-icon="mdi-content-save" class="mt-1 mx-5" rounded color="#679A50" @click="guardarItemMenu">Guardar</v-btn>
                                            </div>
                                        </v-expansion-panel-text>
                                    </v-expansion-panel>
                                </v-expansion-panels>
                            </div>
                        </div>
                    </div>
                </v-form>
                <div class="d-flex my-1">
                    <span style="font-weight: bold; font-size: 18px;" class="text-white busquedaText">Búsqueda:</span>
                    <select v-model="searchField" class="form-control mx-3 bg-green-gray pointer busqueda" style="appearance:">
                        <option value="" selected>--Seleccione--</option>
                        <option value="name">Nombre</option>
                        <option value="category.name">Categoría</option>
                    </select>
                    <input type="text" class="form-control busqueda" v-model="searchValue">
                </div>
                <div id="tablaItemMenu" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="items_menu"
                        :search-field="searchField"
                        :search-value="searchValue"
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de platos y/o bebidas">
                        <template #expand="item">
                            <div v-if="item.brief" class="text-left ps-15">
                                {{item.brief}}
                            </div>
                            <div v-else class="text-left ps-15">
                                Sin comentarios adicionales
                            </div>
                        </template>
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarItemMenu(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="eliminarItemMenu(item.id)"></v-btn>
                            </div>
                        </template>
                        <template #item-cost="item">
                            S/ {{item.cost}}
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
import { mapActions, mapGetters, mapState } from 'vuex';
import Swal from 'sweetalert2'
import uploadImage from '@/helpers/uploadImage';

export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            disabled: false,
            localImage: null,
            file: null,
            rules: {
                required: value => !!value || 'Campo requerido',
                number: value => !isNaN(parseFloat(value)) || 'El valor no es un número',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            isLoading: true,
            item_menu: {
                id: 0,
                name: '',
                brief: '',
                image: '',
                cost: 0,
                state: true,
                category: null,
                preparation_area: null
            },
            headers: [],
            searchField: '',
            searchValue: '',
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('plato', ['categories', 'items_menu']),
        ...mapGetters('plato', ['getItemMenuById']),
        ...mapGetters('area_preparacion', ['getActivePreparationAreas'])
    },
    methods: {
        ...mapActions('plato', ['loadCategories', 'loadItemsMenu', 'createItemMenu', 'updateItemMenu', 'deleteItemMenu', 'getImageObject']),
        ...mapActions('area_preparacion', ['loadPreparationAreas']),
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
        nuevoItemMenu() {
            this.localImage = null
            this.file = null
            this.item_menu.id = 0
            this.item_menu.name = ''
            this.item_menu.brief = ''
            this.item_menu.image = ''
            this.item_menu.cost = 0
            this.item_menu.state = true
            this.item_menu.category = null
            this.item_menu.preparation_area = null
            this.searchField = ''
            this.searchValue = ''
            this.disabled = false
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarItemMenu() {
            this.$refs.form.validate()
            if (!this.item_menu.category.id || !this.item_menu.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const image = await uploadImage(this.file)
            if (image)
                this.item_menu.image = image
            let res = []
            if (this.item_menu.id == 0) {
                const formData = new FormData()
                formData.append('name', this.item_menu.name)
                formData.append('brief', this.item_menu.brief ? this.item_menu.brief : '')
                formData.append('image', this.item_menu.image ? this.item_menu.image : '')
                formData.append('cost', this.item_menu.cost ? this.item_menu.cost : 0)
                formData.append('state', this.item_menu.state ? 1 : 0)
                formData.append('category_id', this.item_menu.category.id)
                formData.append('preparation_area_id', this.item_menu.preparation_area.id)
                res = await this.createItemMenu(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.item_menu.name)
                formData.append('brief', this.item_menu.brief ? this.item_menu.brief : '')
                formData.append('image', this.item_menu.image ? this.item_menu.image : '')
                formData.append('cost', this.item_menu.cost ? this.item_menu.cost : 0)
                formData.append('state', this.item_menu.state ? 1 : 0)
                formData.append('category_id', this.item_menu.category.id)
                formData.append('preparation_area_id', this.item_menu.preparation_area.id)
                res = await this.updateItemMenu([this.item_menu.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.item_menu.id == 0 ? 'Plato/bebida registrado correctamente' : 'Plato/bebida actualizado correctamente', 'success')
                this.nuevoItemMenu()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarItemMenu(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let item_menu = this.getItemMenuById(id)
            if (!item_menu) {
                Swal.fire('Error', 'No se pudo cargar los datos del plato seleccionado', 'error')
            } else {
                this.item_menu = item_menu
                this.item_menu.state = this.item_menu.state == 1 ? true : false
                this.disabled = this.item_menu.brief ? true : false
                Swal.close()
            }
        },
        async eliminarItemMenu(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar el plato / bebida seleccionado',
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
                    await this.deleteItemMenu(id)
                    Swal.fire('Eliminado', 'El plato / bebida fue eliminado', 'success')
                } catch (error) {
                    Swal.fire('Error', 'El plato / bebida no pudo ser eliminado', 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadCategories()
        await this.loadPreparationAreas()
        if (this.getActivePreparationAreas().length > 0)
            this.item_menu.preparation_area = this.getActivePreparationAreas()[0]
        await this.loadItemsMenu()
        this.headers = [
            { text: "Nombre", value: "name", sortable: true },
            { text: "Categoría", value: "category.name", sortable: true },
            { text: "Área de preparación", value: "preparation_area.name", sortable: true },
            { text: "Costo", value: "cost" },
            { text: "Estado", value: "state" },
            { text: "Acciones", value: "action" }
        ]
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
#item_menu {
    height: 90vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#item_menu::-webkit-scrollbar {
    -webkit-appearance: none;
}
#item_menu::-webkit-scrollbar:vertical {
    width:1px;
}
#item_menu::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#item_menu::-webkit-scrollbar:horizontal {
    height: 10px;
}
#item_menu::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#item_menu::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.img {
  border-radius: 50%;
  max-width: 90%;
  height: auto;
  filter: sepia(50%);
}
.bottom-gradient {
  background-image: linear-gradient(
    to top right, rgba(133, 104, 38,.33), rgba(246, 242, 116,.2)
  );
}
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
.panel1 {
    height: 100%;
    border-right: 1px solid;
    position: fixed;
}
.panelItemMenu {
    background-color: rgba(246, 242, 116, 0.6);
    width: 100%;
    border-radius: 20px;
    color: black;
}
.formulario {
    margin-left: 100px;
    margin-right: 100px;
    width: 100%
}
.panelFormBase {
    display: flex !important;
}
.panelForm {
    margin-left: 4px;
    margin-right: 4px;
    width: 50%;
}
#tablaItemMenu {
    // width: 50%;
    padding-bottom: 50px;
}
thead {
    background-color: #679A50;
}
tbody {
    background-color: lighten($color: #856826, $amount: 40);
}
tbody>tr:hover {
    background-color: lighten($color: #679A50, $amount: 40);
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
.action-wrapper {
    cursor: pointer;
    white-space: nowrap;
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
@media only screen and (max-width: 950px) {
    .panel1 {
        display: none;
    }
    #auxiliar {
        display: none;
    }
    .formulario {
        margin-left: 1px;
        margin-right: 1px;
        width: 90%;
    }
    .panelFormBase {
        display: block !important;
    }
    .panelForm {
        margin-left: 1px;
        margin-right: 1px;
        width: 100%;
    }
    #tablaItemsMenu {
        width: 90%;
    }
    #item_menu {
        height: 94vh;
    }
    .busqueda {
        height: 50%;
        font-size: 12px
    }
    .busquedaText {
        height: 50%;
    }
}
</style>