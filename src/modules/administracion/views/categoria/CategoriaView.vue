<template>
    <div class="row justify-content-center align-items-center" style="height: 90vh" v-if="isLoadingCategory">
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
    <div v-else id="category" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-category justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Categorías"
                        class="text-center text-light titulo animate__animated animate__flipInY"
                    ></v-card>
                    <!-- <h1 class="text-center text-light">Listado de Categorías</h1> -->
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center mb-2">
                                <div style="width: 60%" class="left-control mt-4">
                                    <label for="txtNombreCategoria" style="font-weight: bold">Nombre de categoría</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-shape"
                                        :rules="[rules.required]"
                                        v-model="category.name"
                                        placeholder="Ingrese un nombre"
                                        required>
                                    </v-text-field>
                                    <br>
                                    <!-- <input type="text" id="txtNombreCategoria" class="form-control" v-model="category.name"><br> -->
                                    <!-- <input type="checkbox" id="chkEstadoCategoria" v-model="category.state">
                                    <label for="chkEstadoCategoria">Activo</label> -->
                                    <div class="d-flex">
                                        <v-checkbox
                                            label="Activo"
                                            color="brown"
                                            hide-details
                                            v-model="category.state">
                                        </v-checkbox>
                                        <v-checkbox
                                            label="Combo"
                                            color="brown"
                                            hide-details
                                            v-model="category.is_block">
                                        </v-checkbox>
                                    </div>
                                </div>
                                <div style="width: 40%" class="right-control mt-3 text-center">
                                    <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                    <img v-if="localImage"
                                        :src="localImage"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <img v-else-if="category.image"
                                        :src="category.image"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <img v-else
                                        src="@/assets/img/no-image.png"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <br>
                                    <v-btn prepend-icon="mdi-upload" rounded size="small" color="#679A50" @click="onSelectImage">Subir foto</v-btn>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevaCategoria">Nueva categoría</v-btn>
                                <!-- <button class="btn btn-success mb-2 mx-4" @click="nuevaCategoria">
                                    Nueva categoría
                                    <i class="fa fa-plus"></i>
                                </button> -->
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarCategoria">Guardar</v-btn>
                                <!-- <button class="btn btn-success mb-2 mx-4" @click="guardarCategoria">
                                    Guardar
                                    <i class="fa-regular fa-floppy-disk"></i>
                                </button> -->
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaCategorias" class="animate__animated animate__flipInY">
                    <div class="align-center">
                        <v-table height="100vh" density="compact" class="fondo-tabla">
                            <thead class="text-white text-center">
                                <tr>
                                    <th scope="col" style="width: 10px" class="border-top-0 border-end">#</th>
                                    <th scope="col" class="border-top-0 border-end">Nombre</th>
                                    <th scope="col" class="border-top-0 border-end">Estado</th>
                                    <th scope="col" class="border-top-0 border-end">Tipo</th>
                                    <th scope="col" class="border-top-0 border-end-0 text-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="category, index in categories" :key="category.id" >
                                    <th scope="row" class="border-end border-bottom border-top text-center">{{index+1}}</th>
                                    <td style="display:none" class="border-end border-bottom border-top">{{category.id}}</td>
                                    <td class="border-end border-bottom border-top" style="width: 30%">{{category.name}}</td>
                                    <td class="border-end border-bottom border-top" v-if="category.state === 1">Activo</td>
                                    <td class="border-end border-bottom border-top" v-else>Inactivo</td>
                                    <td class="border-end border-bottom border-top" v-if="category.is_block === 1">Combo</td>
                                    <td class="border-end border-bottom border-top" v-else>Individual</td>
                                    <td class="border-bottom border-top text-center text-nowrap">
                                        <v-btn icon="mdi-square-edit-outline" class="botonCargar my-1" color="blue" size="x-small" @click="cargarCategoria(category.id)"></v-btn>
                                        <v-btn icon="mdi-trash-can-outline" class="botonEliminar my-1" color="#E75D48" size="x-small" @click="eliminarCategoria(category.id)"></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div>
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
    data() {
        return {
            localImage: null,
            file: null,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            category: {
                id: 0,
                name: '',
                image: '',
                is_block: false,
                state: true
            }
        }
    },
    computed: {
        ...mapState('plato', ['categories', 'isLoadingCategory']),
        ...mapGetters('plato', ['getCategoryById'])
    },
    methods: {
        ...mapActions('plato', ['loadCategories', 'createCategory', 'updateCategory', 'deleteCategory']),
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
        nuevaCategoria() {
            this.localImage = null
            this.file = null
            this.category.id = 0
            this.category.name = ''
            this.category.image = ''
            this.category.is_block = false
            this.category.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarCategoria() {
            this.$refs.form.validate()
            if (!this.category.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const image = await uploadImage(this.file)
            if (image)
                this.category.image = image
            let res = []
            if (this.category.id == 0) {
                const formData = new FormData()
                formData.append('name', this.category.name)
                formData.append('image', this.category.image ? this.category.image : '')
                formData.append('is_block', this.category.is_block ? 1 : 0)
                formData.append('state', this.category.state ? 1 : 0)
                res = await this.createCategory(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.category.name)
                formData.append('image', this.category.image ? this.category.image : '')
                formData.append('is_block', this.category.is_block ? 1 : 0)
                formData.append('state', this.category.state ? 1 : 0)
                res = await this.updateCategory([this.category.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.category.id == 0 ? 'Categoría registrada correctamente' : 'Categoría actualizada correctamente', 'success')
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
            let categoria = this.getCategoryById(id)
            if (!categoria) {
                Swal.fire('Error', 'No se pudo cargar los datos de la categoría seleccionada', 'error')
            } else {
                this.category = categoria
                this.category.state = this.category.state == 1 ? true : false
                this.category.is_block = this.category.is_block == 1 ? true : false
                // let imageCategory = await getImageObject(this.category.image)
                // if (imageCategory) {
                //     try {
                //         const [ext, ...fileName] = this.category.image.split('.').reverse();
                //         if (ext && fileName) {
                //             imageCategory = `data:image/${ext};base64, ` + imageCategory
                //             this.localImage = imageCategory
                //             // Generar file
                //             const res = await fetch(this.localImage);
                //             const blob = await res.blob();
                //             const file = new File([blob], this.category.image, { type: `image/${ext}` });
                //             if (file) this.file = file
                //         }
                //     } catch (error) {
                //         Swal.fire('Error', 'Error al cargar la imagen', 'error')
                //     }
                // } else {
                //     this.localImage = null
                //     this.file = null
                // }
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
                    await this.deleteCategory(id)
                    Swal.fire('Eliminado', 'La categoría fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La categoría no pudo ser eliminada', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadCategories()
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
#category {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-category {
    width: 50%;
}
.left-control {
    margin-left: 2em;
}
.right-control {
    margin-right: 2em;
}
// #category::after {
//     content: "";
//     background: url('@/assets/Fondo-Adm.png');
//     background-size: cover;
//     opacity: 0.7;
//     top: 0;
//     left: 0;
//     bottom: 0;
//     right: 0;
//     position: absolute;
//     z-index: -1;
// }
#tablaCategorias {
    width: 100%;
    padding-bottom: 100px;
}
// thead>tr:first-child th:first-child {
//     border-top-left-radius: 20px;
// }
// thead>tr:first-child th:last-child {
//     border-top-right-radius: 20px;
// }
thead {
    background-color: #679A50;
}
tbody {
    background-color: lighten($color: #856826, $amount: 40);
}
// tbody>tr:last-child th:first-child {
//     border-bottom-left-radius: 20px;
// }
// tbody>tr:last-child td:last-child {
//     border-bottom-right-radius: 20px;
// }
tbody>tr:hover {
    background-color: lighten($color: #679A50, $amount: 40);
}
img {
    width: 100px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
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
#category::-webkit-scrollbar {
    -webkit-appearance: none;
}
#category::-webkit-scrollbar:vertical {
    width:1px;
}
#category::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#category::-webkit-scrollbar:horizontal {
    height: 10px;
}
#category::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#category::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 950px) {
    /* For mobile phones: */
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
        margin-left: 0.7em;
    }
    .right-control {
        margin-right: 0.7em;
    }
    .botonCargar {
        margin-right: 1px;
    }
    .botonEliminar {
        margin-left: 1px;
    }
}
</style>