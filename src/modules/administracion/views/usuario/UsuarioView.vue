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
    <div v-else id="usuario">
        <div class="mx-2 row justify-content-center align-items-center">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Relación de Usuarios"
                    class="text-center text-light titulo animate__animated animate__flipInY"
                ></v-card>
            </div>
            <v-form ref="form" lazy-validation>
                <div class="d-flex justify-content-center mb-4">
                    <div id="formulario" class="animate__animated animate__flipInY">
                        <div class="panelFormBase justify-content-center mt-4">
                            <div class="panelForm100">
                                <v-combobox
                                    v-model="user.employee"
                                    :items="getCompleteNamesOfEmployees()"
                                    item-value="id"
                                    item-title="fullName"
                                    :rules="[rules.requiredSelection]"
                                    label="Seleccione un trabajador"
                                    density="comfortable"
                                    required>
                                </v-combobox>
                            </div>
                        </div>
                        <div class="panelFormBase justify-content-center mb-4">
                            <div class="panelForm50">
                                <v-text-field
                                    label="Usuario"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                    v-model="user.username"
                                    @keyup="lowercase()"
                                    :readonly="!isNew"
                                    required>
                                </v-text-field>
                            </div>
                            <div class="panelForm50">
                                <v-text-field
                                    label="Contraseña"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-lock"
                                    :rules="[rules.required]"
                                    v-model="user.password"
                                    required>
                                </v-text-field>
                            </div>
                        </div>
                        <div class="panelFormBase justify-content-center">
                            <div class="panelForm70">
                                <v-combobox
                                    v-model="user.role"
                                    :items="roles"
                                    item-value="id"
                                    item-title="name"
                                    :rules="[rules.requiredSelection]"
                                    label="Seleccione un rol"
                                    density="comfortable"
                                    required>
                                </v-combobox>
                            </div>
                            <div class="panelForm30">
                                <v-checkbox
                                    label="Activo"
                                    color="brown"
                                    hide-details
                                    v-model="user.state">
                                </v-checkbox>
                            </div>
                        </div>
                        <hr style="border-top: 5px solid; margin-bottom: 5px">
                        <div class="text-center">
                            <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevoUsuario">Nuevo usuario</v-btn>
                            <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarUsuario">Guardar</v-btn>
                        </div>
                    </div>
                    <br>
                </div>
            </v-form>
            
            <div id="tablaUsers" class="animate__animated animate__flipInY">
                <div class="d-flex my-1">
                    <span style="font-weight: bold; font-size: 18px;" class="text-white busquedaText">Búsqueda:</span>
                    <select v-model="searchField" class="form-control mx-3 bg-green-gray pointer busqueda" style="appearance:">
                        <option value="" selected>--Seleccione--</option>
                        <option value="fullName">Empleado</option>
                        <option value="username">Usuario</option>
                        <option value="roleName">Rol</option>
                    </select>
                    <input type="text" class="form-control busqueda" v-model="searchValue">
                </div>
                <easy-data-table
                    :headers="headers"
                    :items="getListUsers()"
                    :search-field="searchField"
                    :search-value="searchValue"
                    :theme-color="themeColor"
                    :rows-per-page="10"
                    table-class-name="customize-table"
                    alternating
                    show-index
                    buttons-pagination
                    rows-per-page-message="Filas por página"
                    empty-message="No hay datos de usuarios">
                    <template #item-action="usuario">
                        <div class="action-wrapper">
                            <v-btn icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarUsuario(usuario.username)"></v-btn>
                            <v-btn icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="eliminarUsuario(usuario.username)"></v-btn>
                        </div>
                    </template>
                    <template #item-state="usuario">
                        <div v-if="usuario.state == 1">Activo</div>
                        <div v-else>Inactivo</div>
                    </template>
                </easy-data-table>
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
            isNew: true,
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            user: {
                username: '',
                password: '',
                state: true,
                role: null,
                employee: null
            },
            headers: [],
            searchField: '',
            searchValue: '',
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('empleado', ['employees']),
        ...mapState('usuario', ['users', 'roles']),
        ...mapGetters('empleado', ['getCompleteNamesOfEmployees', 'getCompleteNamesOfEmployee']),
        ...mapGetters('usuario', ['getListUsers', 'getUserByUsername', 'getUserByEmployee'])
    },
    methods: {
        ...mapActions('empleado', ['loadEmployees']),
        ...mapActions('usuario', ['loadUsers', 'loadRoles', 'createUser', 'updateUser', 'deleteUser']),
        lowercase() {
            this.user.username = this.user.username.toLowerCase();
        },
        nuevoUsuario() {
            this.user.username = ''
            this.user.password = ''
            this.user.state = true
            this.user.role = null
            this.user.employee = null
            this.isNew = true
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarUsuario() {
            this.$refs.form.validate()
            if (!this.user.employee.id || !this.user.username || !this.user.password || !this.user.role.id) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let res = []
            if (this.isNew) {
                const existsUser = this.getUserByEmployee(this.user.employee.id)
                if (existsUser) {
                    Swal.fire('Error', `El trabajador ${this.user.employee.fullName} ya tiene un usuario asignado`, 'error')
                    return
                }
                const formData = new FormData()
                formData.append('username', this.user.username)
                formData.append('password', this.user.password)
                formData.append('state', this.user.state ? 1 : 0)
                formData.append('role_id', this.user.role.id)
                formData.append('employee_id', this.user.employee.id)
                res = await this.createUser(formData)
            } else {
                const formData = new FormData()
                formData.append('password', this.user.password)
                formData.append('state', this.user.state ? 1 : 0)
                formData.append('role_id', this.user.role.id)
                formData.append('employee_id', this.user.employee.id)
                res = await this.updateUser([this.user.username, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.isNew ? 'Usuario registrado correctamente' : 'Usuario actualizado correctamente', 'success')
                this.nuevoUsuario()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarUsuario(username) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let user = this.getUserByUsername(username)
            if (!user) {
                Swal.fire('Error', 'No se pudo cargar los datos del usuario seleccionado', 'error')
            } else {
                this.user = user
                this.user.password = ''
                this.user.employee = this.getCompleteNamesOfEmployee(this.user.employee.id)
                this.user.state = this.user.state == 1 ? true : false
                this.isNew = false
                Swal.close()
            }
        },
        async eliminarUsuario(username) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar los datos del usuario',
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
                    await this.deleteUser(username)
                    Swal.fire('Eliminado', 'Datos del usuario eliminados', 'success')
                } catch (error) {
                    Swal.fire('Error', 'Los datos del usuario no pudieron ser eliminados', 'error')
                }
            }
        }
    },
    mounted() {
        this.loadUsers()
        this.loadRoles()
        this.loadEmployees()
        this.headers = [
            { text: "Empleado", value: "fullName", sortable: true },
            { text: "Usuario", value: "username", sortable: true },
            { text: "Rol", value: "roleName", sortable: true },
            { text: "Estado", value: "state", sortable: true },
            { text: "Acciones", value: "action" }
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
    width: 56%;
    border-radius: 20px;
}
#usuario {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
#tablaUsers {
    width: 67%;
    padding-bottom: 100px;
}
.panelFormBase {
    display: flex !important;
}
.panelForm30 {
    margin-left: 16px;
    margin-right: 16px;
    width: 30%;
}
.panelForm40 {
    margin-left: 16px;
    margin-right: 16px;
    width: 40%;
}
.panelForm50 {
    margin-left: 16px;
    margin-right: 16px;
    width: 50%;
}
.panelForm70 {
    margin-left: 16px;
    margin-right: 16px;
    width: 70%;
}
.panelForm100 {
    margin-left: 16px;
    margin-right: 16px;
    width: 100%;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#usuario::-webkit-scrollbar {
    -webkit-appearance: none;
}
#usuario::-webkit-scrollbar:vertical {
    width:1px;
}
#usuario::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#usuario::-webkit-scrollbar:horizontal {
    height: 10px;
}
#usuario::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#usuario::-webkit-scrollbar-track {
    border-radius: 10px;  
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
    /* For mobile phones: */
    #formulario {
        width: 100%;
    }
    #tablaUsers {
        width: 100%;
    }
    .panelFormBase {
        display: block !important;
    }
    .panelForm30 {
        margin-left: 8px;
        margin-right: 8px;
        width: 95%;
    }
    .panelForm40 {
        margin-left: 8px;
        margin-right: 8px;
        width: 95%;
    }
    .panelForm50 {
        margin-left: 8px;
        margin-right: 8px;
        width: 95%;
    }
    .panelForm70 {
        margin-left: 8px;
        margin-right: 8px;
        width: 95%;
    }
    .panelForm100 {
        margin-left: 8px;
        margin-right: 8px;
        width: 95%;
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