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
    <div v-else id="branch" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-branch justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Listado de Almacenes"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 65%" class="left-control mt-5">
                                    <label for="txtNombreAlmacen" style="font-weight: bold">Nombre del almacén</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-warehouse"
                                        :rules="[rules.required]"
                                        v-model="branch.name"
                                        placeholder="Ingrese un nombre"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 35%" class="right-control mt-5">
                                    <label for="txtEstado" style="font-weight: bold"></label>
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="branch.state">
                                    </v-checkbox>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center align-items-center">
                                <div style="width: 100%" class="middle-control">
                                    <label for="txtDireccion" style="font-weight: bold">Dirección</label>
                                    <v-text-field
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-map-marker"
                                        v-model="branch.address"
                                        placeholder="Ingrese dirección"
                                        required>
                                    </v-text-field>
                                </div>
                            </div>
                            <hr style="border-top: 5px solid; margin-bottom: 5px">
                            <div class="text-center">
                                <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#E75D48" @click="nuevoAlmacen()">Nuevo almacén</v-btn>
                                <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#E75D48" @click="guardarAlmacen()">Guardar</v-btn>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div id="tablaAlmacenes" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items="branches"
                        :theme-color="themeColor"
                        :rows-per-page="5"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de almacenes">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-1" color="blue" size="x-small" @click="cargarAlmacen(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-1" color="#E75D48" size="x-small" @click="eliminarAlmacen(item.id)"></v-btn>
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
            branch: {
                id: 0,
                name: '',
                address: '',
                state: true
            },
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapState('almacen', ['branches', 'isLoading']),
        ...mapGetters('almacen', ['getBranchById'])
    },
    methods: {
        ...mapActions('almacen', ['loadBranches', 'createBranch', 'updateBranch', 'deleteBranch']),
        nuevoAlmacen() {
            this.branch.id = 0
            this.branch.name = ''
            this.branch.address = ''
            this.branch.state = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarAlmacen() {
            this.$refs.form.validate()
            if (!this.branch.name) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.branch.id == 0) {
                const formData = new FormData()
                formData.append('name', this.branch.name)
                formData.append('address', this.branch.address ? this.branch.address : '')
                formData.append('state', this.branch.state ? 1 : 0)
                res = await this.createBranch(formData)
            } else {
                const formData = new FormData()
                formData.append('name', this.branch.name)
                formData.append('address', this.branch.address ? this.branch.address : '')
                formData.append('state', this.branch.state ? 1 : 0)
                res = await this.updateBranch([this.branch.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.branch.id == 0 ? 'Almacén registrado correctamente' : 'Almacén actualizado correctamente', 'success')
                this.nuevoAlmacen()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarAlmacen(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const branch = this.getBranchById(id)
            if (!branch) {
                Swal.fire('Error', 'No se pudo cargar los datos del almacén seleccionado', 'error')
            } else {
                this.branch = branch
                this.branch.state = this.branch.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarAlmacen(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar el almacén seleccionado',
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
                    await this.deleteBranch(id)
                    Swal.fire('Eliminada', 'El almacén fue eliminado', 'success')
                } catch (error) {
                    Swal.fire('Error', 'El almacén no pudo ser eliminado', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadBranches()
        this.headers = [
                { text: "Nombre", value: "name", sortable: true },
                { text: "Dirección", value: "address", sortable: true },
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
    width: 354px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
#branch {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.panel-branch {
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
#tablaAlmacenes {
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
#branch::-webkit-scrollbar {
    -webkit-appearance: none;
}
#branch::-webkit-scrollbar:vertical {
    width:1px;
}
#branch::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#branch::-webkit-scrollbar:horizontal {
    height: 10px;
}
#branch::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#branch::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .panel-branch {
        width: 90%;
    }
    #formulario {
        width: 90%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaAlmacenes {
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