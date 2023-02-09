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
    <div v-else id="menu">
        <div class="mx-5 row justify-content-center align-items-center">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Mantenimiento de la carta"
                    class="text-center text-light titulo animate__animated animate__flipInY"
                ></v-card>
            </div>
        </div>
        <div class="text-center d-flex justify-content-center">
            <div id="lista-menu" class="justify-content-center align-items-center animate__animated animate__flipInY">
                <div class="text-center" style="width: 20%;">
                    <v-btn
                        icon
                        size="80"
                        class="btnAgregar"
                        @click="activateForm">
                        <v-icon v-if="!isNew" size="x-large">mdi-plus-circle-outline</v-icon>
                        <v-icon v-else size="x-large">mdi-square-edit-outline</v-icon>
                        <v-tooltip
                            activator="parent"
                            location="bottom"
                            text="Crear nueva carta">
                        </v-tooltip>
                    </v-btn>
                </div>
                <div style="width: 80%">
                    <v-slide-group
                        v-model="idx_menu"
                        center-active
                        show-arrows>
                        <v-slide-group-item
                            v-for="menu in menus"
                            :key="menu.id"
                            v-slot="{ isSelected, toggle }">
                            <v-card
                                :class="isSelected ? 'seleccionado' : 'no-seleccionado'"
                                class="ma-3"
                                height="150"
                                width="100"
                                @click="toggle(); isAssignment = !isSelected; !isSelected && this.cargarMenuDetail(menu.id)">
                                <div class="d-flex fill-height align-center justify-center">
                                    <img class="imgMenuCard" v-if="menu.image" :src="menu.image" />
                                    <div class="imgMenuCardSelect" v-if="isSelected">
                                        <v-icon
                                            size="48"
                                            icon="mdi-close-circle-outline">
                                        </v-icon>
                                        <div class="bgMenuCardSelect">{{menu.name}}</div>
                                        <div class="row align-center justify-center">
                                            <v-btn
                                                icon="mdi-square-edit-outline"
                                                class="me-1"
                                                size="x-small"
                                                color="blue"
                                                @click="cargarMenu(menu.id)">
                                            </v-btn>
                                            <v-btn
                                                icon="mdi-trash-can-outline"
                                                class="ms-1"
                                                size="x-small"
                                                color="red"
                                                @click="eliminarMenu(menu.id)">
                                            </v-btn>
                                        </div>
                                    </div>
                                    <div v-else class="bgMenuCard">{{menu.name}}</div>
                                    <!-- <v-scale-transition>
                                    </v-scale-transition> -->
                                </div>
                            </v-card>
                        </v-slide-group-item>
                    </v-slide-group>
                </div>
            </div>
        </div>
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-form justify-content-center align-items-center">
                <v-form v-if="isNew" ref="form" lazy-validation>
                    <div class="d-flex justify-content-center my-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center mb-2">
                                <div style="width: 60%" class="left-control mt-4">
                                    <label for="txtNombreMenu" style="font-weight: bold">Nombra tu carta</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-shape"
                                        :rules="[rules.required]"
                                        v-model="menu.name"
                                        required>
                                    </v-text-field>
                                    <br>
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="menu.state">
                                    </v-checkbox>
                                </div>
                                <div style="width: 40%" class="right-control mt-3 text-center">
                                    <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                    <img v-if="localImage"
                                        :src="localImage"
                                        alt="entry-picture" class="img-thumbnail mb-2">
                                    <img v-else-if="menu.image"
                                        :src="menu.image"
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
                                <v-btn prepend-icon="mdi-close-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevoMenu">Limpiar</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarMenu">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
            </div>
        </div>
        <div v-if="isAssignment" class="d-flex mt-5" style="margin-bottom: 100px">
            <div class="col-6">
                <div class="left-list">
                    <div class="row justify-content-center align-items-center">
                        <v-card
                            class="text-center text-light titulo-list mb-1 animate__animated animate__flipInY">
                            <v-card-text class="titulo-list-text">Lista de platos y bebidas</v-card-text>
                        </v-card>
                    </div>
                    <div class="div-draggable">
                        <draggable
                            class="list-group animate__animated animate__flipInY"
                            :list="getActiveItemMenu()"
                            :move="checkMove"
                            group="food"
                            itemKey="id">
                            <template #item="{ element }">
                                <div class="list-group-item element-list">
                                    <div class="d-flex justify-content-center align-items-center lista-responsive">
                                        <div class="col-md-2 col-4 avatar">
                                            <v-avatar v-if="element.image">
                                                <v-img
                                                    :src="element.image"
                                                    alt="element"
                                                    cover>
                                                </v-img>
                                            </v-avatar>
                                            <v-avatar v-else>
                                                <v-icon icon="mdi-cancel"></v-icon>
                                            </v-avatar>
                                        </div>
                                        <div class="col-md-5 col-4">{{ element.name }}</div>
                                        <div class="text-right col-md-5 col-4">{{ element.category.name }}</div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>
            <div class="col-6" style="margin-bottom: 100px">
                <div class="right-list">
                    <div class="row justify-content-center align-items-center">
                        <v-card
                            class="text-center text-light titulo-list mb-1 animate__animated animate__flipInY">
                            <v-card-text class="titulo-list-text">Platos y bebidas de la carta</v-card-text>
                        </v-card>
                    </div>
                    <div class="div-draggable">
                        <draggable
                            class="list-group animate__animated animate__flipInY"
                            :list="items_menu_carta"
                            group="food"
                            @change="asignar"
                            itemKey="id">
                            <template #item="{ element }">
                                <div class="list-group-item element-list">
                                    <div class="d-flex justify-content-center align-items-center lista-responsive">
                                        <div class="col-md-2 col-4 avatar">
                                            <v-avatar v-if="element.image">
                                                <v-img
                                                    :src="element.image"
                                                    alt="element"
                                                    cover>
                                                </v-img>
                                            </v-avatar>
                                            <v-avatar v-else>
                                                <v-icon icon="mdi-cancel"></v-icon>
                                            </v-avatar>
                                        </div>
                                        <div class="col-md-5 col-4">{{ element.name }}</div>
                                        <div class="text-right col-md-5 col-4">{{ element.category.name }}</div>
                                    </div>
                                </div>
                            </template>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from 'sweetalert2'
import { mapActions, mapGetters, mapState } from 'vuex'
import draggable from "vuedraggable"
import uploadImage from '@/helpers/uploadImage';

export default {
    data() {
        return {
            idx_menu: null,
            isNew: false,
            isAssignment: false,
            localImage: null,
            file: null,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            menu: {
                id: 0,
                name: '',
                image: '',
                state: true
            },
            items_menu_carta: []
        }
    },
    components: {
        draggable
    },
    computed: {
        ...mapState('carta', ['isLoading', 'menus', 'menu_details']),
        ...mapState('plato', ['items_menu']),
        ...mapGetters('carta', ['getMenuById', 'getItemMenuFromDetail', 'getMenuDetailByMenu']),
        ...mapGetters('plato', ['getActiveItemMenu'])
    },
    methods: {
        ...mapActions('carta', ['loadMenus', 'createMenu', 'updateMenu', 'deleteMenu', 'loadMenuDetails', 'createMenuDetail', 'deleteMenuDetail']),
        ...mapActions('plato', ['loadItemsMenu']),
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
        nuevoMenu() {
            this.localImage = null
            this.file = null
            this.menu.id = 0
            this.menu.name = ''
            this.menu.image = ''
            this.menu.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarMenu() {
            this.$refs.form.validate()
            if (!this.menu.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const image = await uploadImage(this.file)
            if (image)
                this.menu.image = image
            let res = []
            if (this.menu.id == 0) {
                const formData = new FormData()
                formData.append('name', this.menu.name)
                formData.append('image', this.menu.image ? this.menu.image : '')
                formData.append('state', this.menu.state ? 1 : 0)
                res = await this.createMenu(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.menu.name)
                formData.append('image', this.menu.image ? this.menu.image : '')
                formData.append('state', this.menu.state ? 1 : 0)
                res = await this.updateMenu([this.menu.id, formData])
            }
            if (res[0] != 0) {
                await this.loadMenus()
                Swal.fire('Guardado', this.menu.id == 0 ? 'Carta registrada correctamente' : 'Carta actualizada correctamente', 'success')
                this.activateForm()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarMenu(id) {
            this.isNew = true
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let menu = this.getMenuById(id)
            if (!menu) {
                Swal.fire('Error', 'No se pudo cargar los datos de la carta seleccionada', 'error')
            } else {
                this.menu = menu
                this.menu.state = this.menu.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarMenu(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar la carta seleccionada',
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
                    await this.deleteMenu(id)
                    Swal.fire('Eliminado', 'La carta fue eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La carta no pudo ser eliminada', 'error')
                }
            }
        },
        async cargarMenuDetail(id) {
            await this.loadMenuDetails(id)
            this.menu = await this.getMenuById(id)
            this.items_menu_carta = await this.getItemMenuFromDetail()
        },
        activateForm() {
            this.isNew = !this.isNew
            this.nuevoMenu()
        },
        checkMove: function(evt){
            const existe = this.items_menu_carta.find(m => m.id === evt.draggedContext.element.id)
            return existe ? false : true
        },
        asignar: async function(evt) {
            if (evt.added) {
                const formData = new FormData()
                formData.append('menu_id', this.menu.id)
                formData.append('item_menu_id', evt.added.element.id)
                formData.append('selling_price', evt.added.element.cost)
                formData.append('state', 1)
                let res = await this.createMenuDetail(formData)
                if (res[0] != 0) {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Item agregado a la carta',
                        color: 'white',
                        background: '#5AC855',
                        showConfirmButton: false,
                        timer: 1300
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Error al agregar item a la carta',
                        color: 'white',
                        background: '#D96E4C',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1300
                    })
                }
            } 
            else {
                try {
                    const menu_det = await this.getMenuDetailByMenu(this.menu.id, evt.removed.element.id)
                    await this.deleteMenuDetail(menu_det.id)
                    Swal.fire({
                        position: 'top-end',
                        text: 'Item eliminado de la carta',
                        color: 'white',
                        background: '#5AC855',
                        showConfirmButton: false,
                        timer: 1300
                    })
                } catch (error) {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Error al eliminar item de la carta',
                        color: 'white',
                        background: 'red',
                        showConfirmButton: false,
                        timer: 1300
                    })
                }
            }
        }
    },
    mounted() {
        this.loadMenus()
        this.loadItemsMenu()
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
#menu {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
#lista-menu {
    width: 90%;
    display: flex !important;
}
.left-control {
    margin-left: 2em;
}
.right-control {
    margin-right: 2em;
}
.btnAgregar {
    background-color: rgba(103, 154, 80, 0.9);
    color: white
}
img {
    width: 100px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
.seleccionado {
    background-color: rgba(241, 196, 15, 0.6);
}
.no-seleccionado {
    // background-color: transparent;
    background-color: rgba(241, 196, 15, 0.6);
    border: 1px solid;
}
.imgMenuCard {
    pointer-events: none;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
}
.imgMenuCardSelect {
    background-color: rgba(103, 154, 80, 0.7);
}
.bgMenuCard {
    background-color: rgba(241, 196, 15, 0.6);
    font-size: 10px;
    font-weight: bold;
    &:hover {
        background-color: rgba(103, 154, 80, 0.6);
    }
}
.bgMenuCardSelect {
    font-size: 12px;
    font-weight: bold;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    width: 50%;
    border-radius: 20px;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#menu::-webkit-scrollbar {
    -webkit-appearance: none;
}
#menu::-webkit-scrollbar:vertical {
    width:1px;
}
#menu::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#menu::-webkit-scrollbar:horizontal {
    height: 10px;
}
#menu::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#menu::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.panel-form {
    width: 80%;
}
.left-list {
    margin-left: 80px;
    margin-right: 80px;
}
.right-list {
    margin-left: 80px;
    margin-right: 80px;
}
.titulo-list {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    width: 70%;
    margin-left: 2px;
    margin-right: 2px;
}
.titulo-list-text {
    font-size: 1.3em;
}
.element-list {
    background-color: rgba(241, 196, 15, 0.6);
}
.div-draggable {
    height: 80vh;
    overflow-y: scroll;
    overflow-x: hidden;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
.div-draggable::-webkit-scrollbar {
    -webkit-appearance: none;
}
.div-draggable::-webkit-scrollbar:vertical {
    width:3px;
}
.div-draggable::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.div-draggable::-webkit-scrollbar:horizontal {
    height: 10px;
}
.div-draggable::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
.div-draggable::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 1025px) {
    /* For mobile phones: */
    #formulario {
        width: 95%;
    }
    .left-list {
        margin: 0px 0px 0px 10px;
    }
    .right-list {
        margin: 0px 10px 0px 0px;
    }
    .lista-responsive {
        font-size: 1em;
    }
    .lista-responsive>div {
        overflow: hidden;
        text-overflow: clip;
    }
    .avatar {
        font-size: 18px;
    }
    .panel-form {
        width: 90%;
    }
    .titulo-list {
        width: 85%;
    }
    .titulo-list-text {
        font-size: 1em;
    }
    .div-draggable {
        height: 54vh;
    }
    .div-draggable::-webkit-scrollbar:vertical {
        width:10px;
    }
    .left-control {
        margin-left: 0.8em;
    }
    .right-control {
        margin-right: 0.8em;
    }
}
@media only screen and (max-width: 800px) {
    .lista-responsive {
        font-size: 0.6em;
    }
    .left-control {
        margin-left: 2em;
    }
    .right-control {
        margin-right: 2em;
    }
    .left-list {
        margin-left: 10px;
        margin-right: 0px;
    }
    .right-list {
        margin-left: 0px;
        margin-right: 0px;
    }
}
@media only screen and (max-width: 420px) {
    .lista-responsive {
        font-size: 0.6em;
    }
    .titulo-list-text {
        font-size: 0.8em;
    }
    .div-draggable {
        height: 45vh;
    }
    .left-control {
        margin-left: 0.7em;
    }
    .right-control {
        margin-right: 0.7em;
    }
}
</style>