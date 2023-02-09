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
    <div v-else id="mesa">
        <div class="mx-2 row justify-content-center align-items-center">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Lista de Mesas"
                    class="text-center text-light titulo animate__animated animate__flipInX"
                ></v-card>
            </div>
            <v-card
                class="mx-auto pa-2 tableList animate__animated animate__flipInY"
                max-width="400">
                <v-list class="lista">
                    <v-list-item
                        v-for="(item, i) in tables"
                        :key="i"
                        :value="item"
                        active-class="itemListActive"
                        class="itemList"
                        rounded="xl">
                        <template v-slot:default="{isActive}">
                            <v-list-item-action @click="isNew=isActive; isNewForm=false; idMesa=item.id">
                                <v-icon>mdi-table-chair</v-icon>
                                <div class="justify-content-center align-items-center" style="width: 100%">
                                    <div class="text-center">
                                        <v-list-item-title v-text="item.number"></v-list-item-title>
                                    </div>
                                </div>
                            </v-list-item-action>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>
        <div style="padding-bottom: 100px">
            <div v-if="isNew" class="mx-2 mt-3 row justify-content-center align-items-center animate__animated animate__flipInY">
                <v-btn
                    icon="mdi-plus-circle"
                    size="60"
                    class="btnAgregar"
                    @click="iniciarFormulario()"></v-btn>
            </div>
            <div v-else class="mx-2 mt-3 row justify-content-center align-items-center animate__animated animate__flipInY">
                <v-btn
                    icon="mdi-square-edit-outline"
                    size="60"
                    color="blue"
                    class="mx-2"
                    @click="actualizarFormulario()"></v-btn>
                <v-btn
                    icon="mdi-trash-can-outline"
                    size="60"
                    color="#E75D48"
                    class="mx-2"
                    @click="eliminarMesa(idMesa)"></v-btn>
            </div>
            <div class="my-3 row justify-content-center align-items-center">
                <v-form v-if="isNewForm" ref="form" lazy-validation>
                    <div class="d-flex justify-content-center my-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center my-4">
                                <div class="left-control" style="width: 60%">
                                    <v-text-field
                                        label="Número de mesa"
                                        prepend-inner-icon="mdi-numeric"
                                        :rules="[rules.required]"
                                        v-model="table.number"
                                        hide-details="auto"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 25%">
                                    <v-checkbox
                                        label="Activo"
                                        color="brown"
                                        hide-details
                                        v-model="table.state">
                                    </v-checkbox>
                                </div>
                                <div class="right-control" style="width: 15%">
                                    <v-btn
                                        icon="mdi-content-save"
                                        size="50"
                                        class="mx-2 btnAgregar"
                                        @click="guardarMesa()"></v-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-form>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Swal from "sweetalert2"

export default {
    data() {
        return {
            isNew: true,
            isNewForm: false,
            idMesa: 0,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            table: {
                id: 0,
                number: '',
                state: true
            }
        }
    },
    computed: {
        ...mapState('mesa', ['tables', 'isLoading']),
        ...mapGetters('mesa', ['getTableById'])
    },
    methods: {
        ...mapActions('mesa', ['loadTables', 'createTable', 'updateTable', 'deleteTable']),
        limpiarFormMesa() {
            this.table.id = 0
            this.table.number = ''
            this.table.state = true
            setTimeout(() => {
                try {
                    this.$refs.form.resetValidation()
                } catch (error) {
                    return
                }
            }, 100)
        },
        iniciarFormulario() {
            this.isNewForm = !this.isNewForm
            this.limpiarFormMesa()
        },
        actualizarFormulario() {
            this.isNewForm = !this.isNewForm
            if (this.isNewForm) {
                this.cargarMesa(this.idMesa)
            } else {
                this.limpiarFormMesa()
            }
        },
        async guardarMesa() {
            this.$refs.form.validate()
            if (!this.table.number) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.table.id == 0) {
                const formData = new FormData()
                formData.append('number', this.table.number)
                formData.append('state', this.table.state ? 1 : 0)
                res = await this.createTable(formData)
            } else {
                const formData = new FormData()
                formData.append('number', this.table.number)
                formData.append('state', this.table.state ? 1 : 0)
                res = await this.updateTable([this.table.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.table.id == 0 ? 'Mesa registrada correctamente' : 'Mesa actualizada correctamente', 'success')
                this.limpiarFormMesa()
                this.isNewForm = false
                this.isNew = true
                this.idMesa = 0
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarMesa(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            console.log(id)
            let table = this.getTableById(id)
            if (!table) {
                Swal.fire('Error', 'No se pudo cargar los datos de la mesa seleccionada', 'error')
            } else {
                this.table = table
                this.table.state = this.table.state == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarMesa(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar los datos de la mesa',
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
                    await this.deleteTable(id)
                    this.idMesa = 0
                    this.isNew = true
                    Swal.fire('Eliminado', 'Mesa eliminada', 'success')
                } catch (error) {
                    Swal.fire('Error', 'La mesa no pudo ser eliminada', 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadTables()
    }
}
</script>

<style lang="scss" scoped>
.tableList {
    background-color: rgba(241, 196, 15, 0.6);
    width: 67%;
    border-radius: 20px;
}
.lista {
    background-color: rgba(241, 196, 15, 0.4);
}
.itemList {
    border: 1px solid;
    background-color: rgba(133, 104, 38, 0.6);
    margin: 3% 5%;
}
.itemListActive {
    background-color: rgba(90, 200, 85, 0.6);
}
#mesa {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
    width: 35%;
}
.left-control {
    margin-left: 2em;
}
.right-control {
    margin-right: 2em;
}
.btnAgregar {
    background-color: rgba(103, 154, 80, 0.9);
    color: white;
    border: 2px solid;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#mesa::-webkit-scrollbar {
    -webkit-appearance: none;
}
#mesa::-webkit-scrollbar:vertical {
    width:1px;
}
#mesa::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#mesa::-webkit-scrollbar:horizontal {
    height: 10px;
}
#mesa::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#mesa::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 950px) {
    #formulario {
        width: 60%;
    }
    .left-control {
        margin-left: 0.7em;
    }
    .right-control {
        margin-right: 0.7em;
    }
}
@media only screen and (max-width: 500px) {
    #formulario {
        width: 95%;
    }
    .left-control {
        margin-left: 0.7em;
    }
    .right-control {
        margin-right: 0.7em;
    }
}
</style>