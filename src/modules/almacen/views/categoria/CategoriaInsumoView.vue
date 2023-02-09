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
    <div v-else id="category-supply" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-category justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Categorías de insumos"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div class="left-control mt-5">
                                    <label for="txtNombreCategorySupply" style="font-weight: bold">Nombre de categoría</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-shape"
                                        :rules="[rules.required]"
                                        v-model="category_supply.name"
                                        placeholder="Ingrese un nombre"
                                        required>
                                    </v-text-field>
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="category_supply.state">
                                    </v-checkbox>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#E75D48" @click="nuevaCategoria">Nueva categoría</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#E75D48" @click="guardarCategoria">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaCategorias" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="categories_supply"
                        :theme-color="themeColor"
                        :rows-per-page="5"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de categorías de insumos">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarCategoria(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarCategoria(item.id)"></v-btn>
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
            category_supply: {
                id: 0,
                name: '',
                state: true
            },
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapState('categoria_insumo', ['categories_supply', 'isLoading']),
        ...mapGetters('categoria_insumo', ['getCategorySupplyById'])
    },
    methods: {
        ...mapActions('categoria_insumo', ['loadCategoriesSupply', 'createCategorySupply', 'updateCategorySupply', 'deleteCategorySupply']),
        nuevaCategoria() {
            this.category_supply.id = 0
            this.category_supply.name = ''
            this.category_supply.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarCategoria() {
            this.$refs.form.validate()
            if (!this.category_supply.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.category_supply.id == 0) {
                const formData = new FormData()
                formData.append('name', this.category_supply.name)
                formData.append('state', this.category_supply.state ? 1 : 0)
                res = await this.createCategorySupply(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.category_supply.name)
                formData.append('state', this.category_supply.state ? 1 : 0)
                res = await this.updateCategorySupply([this.category_supply.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.category_supply.id == 0 ? 'Categoría registrada correctamente' : 'Categoría actualizada correctamente', 'success')
                this.nuevaCategoria()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarCategoria(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const categoria = this.getCategorySupplyById(id)
            if (!categoria) {
                Swal.fire('Error', 'No se pudo cargar los datos de la promoción seleccionada', 'error')
            } else {
                this.category_supply = categoria
                this.category_supply.state = this.category_supply.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarCategoria(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar la categoría seleccionada',
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
                    await this.deleteCategorySupply(id)
                    Swal.fire('Eliminado', 'La categoría fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La categoría no pudo ser eliminada', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadCategoriesSupply()
        this.headers = [
                { text: "Nombre", value: "name", sortable: true, width: 180 },
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
#category-supply {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.panel-category {
    width: 50%;
}
.left-control {
    width: 100%;
    margin-left: 5em;
    margin-right: 5em;
}
#tablaCategorias {
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
#category-supply::-webkit-scrollbar {
    -webkit-appearance: none;
}
#category-supply::-webkit-scrollbar:vertical {
    width:1px;
}
#category-supply::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#category-supply::-webkit-scrollbar:horizontal {
    height: 10px;
}
#category-supply::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#category-supply::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .titulo {
        width: 350px;
    }
    .panel-category {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaCategorias {
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .left-control {
        margin-left: 0.3em;
        margin-right: 0.3em;
    }
}
</style>