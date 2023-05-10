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
    <div v-else id="client">
        <div class="mx-2 row justify-content-center align-items-center">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Relación de Clientes"
                    class="text-center text-light titulo animate__animated animate__flipInY"
                ></v-card>
            </div>
            <v-form ref="form" lazy-validation>
                <div class="d-flex justify-content-center mb-4">
                    <div id="formulario" class="animate__animated animate__flipInY">
                        <div class="panelFormBase justify-content-center my-2">
                            <div class="panelForm50">
                                <v-combobox
                                    label="Tipo de Documento"                                    
                                    :items=getParameterByParameterCode(1020)                                    
                                    item-value="value"
                                    item-title="item_desc"
                                    prepend-inner-icon="mdi-card-account-details"
                                    :rules="[rules.required]"
                                    hide-details="auto"
                                    v-model="obtained_parameter">
                                </v-combobox>
                            </div>                            
                            <div class="panelForm50">
                                <v-text-field
                                    label="Numero de documento"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                    v-model="client.doc_number"
                                    required>
                                </v-text-field>
                            </div>
                        </div>                   
                        <div v-if="obtained_parameter && obtained_parameter.value === '1'" class="panelFormBase justify-content-center my-2">
                            <div class="panelForm50">
                                <v-text-field
                                    label="Nombres"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                    v-model="client.name"
                                    required>
                                </v-text-field>
                            </div>
                            <div class="panelForm50">
                                <v-text-field
                                    label="Apellidos"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                    v-model="client.surname"
                                    required>
                                </v-text-field>
                            </div>
                        </div>
                        <div v-else-if="obtained_parameter && obtained_parameter.value === '2'" class="panelFormBase justify-content-center my-2">
                            <div class="panelForm100">
                                <v-text-field
                                    label="Razón Social"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-account"
                                    :rules="[rules.required]"
                                    v-model="client.business_name"
                                    required>
                                </v-text-field>
                            </div>
                        </div>                        
                        <div class="panelFormBase justify-content-center my-2">                           
                            <div class="panelForm50">
                                <v-text-field
                                    label="Celular"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-cellphone"
                                    v-model="client.cellphone"
                                    type="number">
                                </v-text-field>
                            </div>
                            <div class="panelForm50">
                                <v-text-field
                                    label="Email"
                                    hide-details="auto"
                                    prepend-inner-icon="mdi-email"
                                    v-model="client.email"
                                    placeholder="mi.email@correo.com"
                                    type="email">
                                </v-text-field>
                            </div>
                        </div>
                        <div v-if="obtained_parameter && obtained_parameter.value === '1'" class="panelFormBase justify-content-center my-2">
                            <div class="panelForm50">
                                <div class="mb-3">
                                    <v-text-field
                                        label="Fecha de nacimiento"
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-calendar-account"
                                        v-model="client.birthday"
                                        type="date">
                                    </v-text-field>
                                </div>
                                <div class="mt-3">
                                    <v-checkbox
                                        label="Es recurrente?"
                                        color="brown"
                                        hide-details
                                        v-model="client.recurrent">
                                    </v-checkbox>
                                </div>
                            </div>
                            <div class="text-center panelForm50">
                                <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                <img v-if="localImage"
                                    :src="localImage"
                                    alt="entry-picture" class="img-thumbnail mb-2">
                                <img v-else-if="client.image"
                                    :src="client.image"
                                    alt="entry-picture" class="img-thumbnail mb-2">
                                <img v-else
                                    src="@/assets/img/no-image.png"
                                    alt="entry-picture" class="img-thumbnail mb-2">
                                <br>
                                <v-btn prepend-icon="mdi-upload" rounded size="small" color="#679A50" @click="onSelectImage">Subir foto</v-btn>
                            </div>
                        </div>
                        <div v-if="obtained_parameter && obtained_parameter.value === '2'" class="panelFormBase justify-content-center my-2">
                            <div class="panelForm50">                                
                                <div class="mt-3">
                                    <v-checkbox
                                        label="Es recurrente?"
                                        color="brown"
                                        hide-details
                                        v-model="client.recurrent">
                                    </v-checkbox>
                                </div>
                            </div>
                            <div class="text-center panelForm50">
                                <input type="file" @change="onSelectedImage" ref="imageSelector" v-show="false" accept="image/png, image/jpeg, image/jpg, image/bmp">
                                <img v-if="localImage"
                                    :src="localImage"
                                    alt="entry-picture" class="img-thumbnail mb-2">
                                <img v-else-if="client.image"
                                    :src="client.image"
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
                            <v-btn prepend-icon="mdi-plus-circle" class="mb-2 mx-4" rounded color="#679A50" @click="nuevoCliente">Nuevo cliente</v-btn>
                            <v-btn prepend-icon="mdi-content-save" class="mb-2 mx-5" rounded color="#679A50" @click="guardarCliente">Guardar</v-btn>
                        </div>
                    </div>
                    <br>
                </div>
            </v-form>
            
            <div v-if="obtained_parameter && obtained_parameter.value === '1'" id="tablaClients" class="animate__animated animate__flipInY">
                <div class="d-flex my-1">
                    <span style="font-weight: bold; font-size: 18px;" class="text-white busquedaText">Búsqueda:</span>
                    <select v-model="searchField" class="form-control mx-3 bg-green-gray pointer busqueda" style="appearance:">
                        <option value="" selected>--Seleccione--</option>
                        <option value="doc_number">DNI</option>
                        <option value="name">Nombres</option>
                        <option value="surname">Apellidos</option>
                    </select>
                    <input type="text" class="form-control busqueda" v-model="searchValue">
                </div>
                <easy-data-table
                    :headers="headersDNI"
                    :items=getDNIClients
                    :search-field="searchField"
                    :search-value="searchValue"
                    :theme-color="themeColor"
                    :rows-per-page="10"
                    table-class-name="customize-table"
                    alternating
                    show-index
                    buttons-pagination
                    rows-per-page-message="Filas por página"
                    empty-message="No hay datos de clientes">
                    <template #item-action="client">
                        <div class="action-wrapper">
                            <v-btn icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarCliente(client.id)"></v-btn>
                            <v-btn icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="eliminarCliente(client.id)"></v-btn>
                        </div>
                    </template>
                    <template #item-name="client">
                        <div style="white-space: nowrap">
                            <v-avatar>
                                <v-img
                                    v-if="client.image"
                                    alt="client-avatar"
                                    :src="client.image"
                                    cover></v-img>
                                <v-icon
                                    v-else
                                    icon="mdi-account-circle"></v-icon>
                            </v-avatar>
                            <span class="ms-3">{{client.name}}</span>
                        </div>
                    </template>
                    <template #item-recurrent="client">
                        <div v-if="client.recurrent == 1">Recurrente</div>
                        <div v-else>Normal</div>
                    </template>
                </easy-data-table>
            </div>
            <div v-if="obtained_parameter && obtained_parameter.value === '2'" id="tablaClients" class="animate__animated animate__flipInY">
                <div class="d-flex my-1">
                    <span style="font-weight: bold; font-size: 18px;" class="text-white busquedaText">Búsqueda:</span>
                    <select v-model="searchField" class="form-control mx-3 bg-green-gray pointer busqueda" style="appearance:">
                        <option value="" selected>--Seleccione--</option>
                        <option value="doc_number">RUC</option>
                        <option value="business_name">Razón social</option>
                    </select>
                    <input type="text" class="form-control busqueda" v-model="searchValue">
                </div>
                <easy-data-table
                    :headers="headersRUC"
                    :items=getRUCClients
                    :search-field="searchField"
                    :search-value="searchValue"
                    :theme-color="themeColor"
                    :rows-per-page="10"
                    table-class-name="customize-table"
                    alternating
                    show-index
                    buttons-pagination
                    rows-per-page-message="Filas por página"
                    empty-message="No hay datos de clientes">
                    <template #item-action="client">
                        <div class="action-wrapper">
                            <v-btn icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarCliente(client.id)"></v-btn>
                            <v-btn icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="eliminarCliente(client.id)"></v-btn>
                        </div>
                    </template>
                    <template #item-business_name="client">
                        <div style="white-space: nowrap">
                            <v-avatar>
                                <v-img
                                    v-if="client.image"
                                    alt="client-avatar"
                                    :src="client.image"
                                    cover></v-img>
                                <v-icon
                                    v-else
                                    icon="mdi-account-circle"></v-icon>
                            </v-avatar>
                            <span class="ms-3">{{client.business_name}}</span>                      
                        </div>
                    </template>
                    <template #item-recurrent="client">
                        <div v-if="client.recurrent == 1">Recurrente</div>
                        <div v-else>Normal</div>
                    </template>
                </easy-data-table>
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
            client: {
                id: 0,
                doc_type: null,
                doc_number: '',
                business_name:'',
                name: '',
                surname: '',
                cellphone: '',
                email: '',
                birthday: '',
                recurrent: true,
                image: ''
            },
            obtained_parameter: null,
            headersDNI: [],
            headersRUC: [],
            searchField: '',
            searchValue: '',
            themeColor: "#856826"
        }
    },    
    computed: {
        ...mapState('cliente', ['clients', 'isLoading']),
        ...mapGetters('cliente', ['getClientById']),
        ...mapGetters('parametro', ['getParameterByParameterCode']),
        getDNIClients(){
            return this.clients.filter(client => client.doc_type==1)
        },
        getRUCClients(){
            return this.clients.filter(client => client.doc_type==2)
        }
    },
    watch:{
        obtained_parameter(oldValue, newValue){
            if(oldValue!=newValue){
                this.client.doc_type=this.obtained_parameter.value
            }            
        }
    },
    methods: {
        ...mapActions('cliente', ['loadClients', 'createClient', 'updateClient', 'deleteClient']),
        ...mapActions('parametro', ['loadParameters']),
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
        nuevoCliente() {
            this.localImage = null
            this.file = null
            this.client.id = 0
            this.client.dni = ''
            this.client.name = ''
            this.client.surname = ''
            this.client.cellphone = ''
            this.client.email = ''
            this.client.birthday = ''
            this.client.recurrent = true
            this.client.image = ''
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarCliente() {
            this.$refs.form.validate()
            if (!this.client.name || !this.client.surname) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const image = await uploadImage(this.file)
            if (image)
                this.client.image = image
            let res = []
            if (this.client.id == 0) {
                const formData = new FormData()
                formData.append('doc_type', this.client.doc_type)
                formData.append('doc_number', this.client.doc_number)
                if(this.client.doc_type==1){
                    formData.append('name', this.client.name ? this.client.name : '')
                    formData.append('surname', this.client.surname ? this.client.surname : '')
                    if(this.client.birthday && this.client.birthday === ''){
                        formData.append('birthday', null)
                    }
                    else{            
                        formData.append('birthday', this.client.birthday)
                    }
                }
                if(this.client.doc_type==2){
                    formData.append('business_name', this.client.business_name ? this.client.business_name : '')
                }               
                formData.append('cellphone', this.client.cellphone ? this.client.cellphone : '')
                formData.append('email', this.client.email ? this.client.email : '')
                formData.append('recurrent', this.client.recurrent ? 1 : 0)
                formData.append('image', this.client.image ? this.client.image : '')
                res = await this.createClient(formData)
            } else {
                const formData = new FormData()
                formData.append('doc_type', this.client.doc_type)
                formData.append('doc_number', this.client.doc_number)
                if(this.client.doc_type==1){
                    formData.append('name', this.client.name ? this.client.name : '')
                    formData.append('surname', this.client.surname ? this.client.surname : '')               
                    if(this.client.birthday && this.client.birthday === ''){
                        //formData.append('birthday', null)
                        formData.append('birthday', this.client.birthday=null)
                    }
                    else{            
                        formData.append('birthday', this.client.birthday)
                    }
                }
                if(this.client.doc_type==2){
                    formData.append('business_name', this.client.business_name ? this.client.business_name : '')
                }   
                formData.append('cellphone', this.client.cellphone ? this.client.cellphone : '')
                formData.append('email', this.client.email ? this.client.email : '')
                formData.append('recurrent', this.client.recurrent ? 1 : 0)
                formData.append('image', this.client.image ? this.client.image : '')
                res = await this.updateClient([this.client.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.client.id == 0 ? 'Cliente registrado correctamente' : 'Cliente actualizado correctamente', 'success')
                this.nuevoCliente()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        async cargarCliente(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let client = this.getClientById(id)
            if (!client) {
                Swal.fire('Error', 'No se pudo cargar los datos del cliente seleccionado', 'error')
            } else {
                this.client = client
                this.client.recurrent = this.client.recurrent == 1 ? true : false
                Swal.close()
            }
        },
        async eliminarCliente(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar los datos del cliente',
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
                    await this.deleteClient(id)
                    Swal.fire('Eliminado', 'Datos del cliente eliminados', 'success')
                } catch (error) {
                    Swal.fire('Error', 'Los datos del cliente no pudieron ser eliminados', 'error')
                }
            }
        }
    },
    async mounted() {
        await this.loadClients()
        await this.loadParameters()
        if (this.getParameterByParameterCode(1020).length > 0)
            this.obtained_parameter = this.getParameterByParameterCode(1020)[0]
        this.headersDNI = [
            { text: "DNI", value: "doc_number" },
            { text: "Nombres", value: "name", sortable: true },
            { text: "Apellidos", value: "surname", sortable: true },
            { text: "Celular", value: "cellphone" },
            { text: "Email", value: "email" },
            { text: "Fecha de nacimiento", value: "birthday" },
            { text: "Recurrente", value: "recurrent", sortable: true },
            { text: "Acciones", value: "action" }
        ]
        this.headersRUC = [
            { text: "RUC", value: "doc_number" },
            { text: "Razón Social", value: "business_name", sortable: true },
            { text: "Celular", value: "cellphone" },
            { text: "Email", value: "email" },
            { text: "Fecha de nacimiento", value: "birthday" },
            { text: "Recurrente", value: "recurrent", sortable: true },
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
    width: 67%;
    border-radius: 20px;
}
#client {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
#tablaClients {
    width: 67%;
    padding-bottom: 100px;
}
img {
    width: 120px;
    box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
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
.panelForm100 {
    margin-left: 16px;
    margin-right: 16px;
    width: 100%;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#client::-webkit-scrollbar {
    -webkit-appearance: none;
}
#client::-webkit-scrollbar:vertical {
    width:1px;
}
#client::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#client::-webkit-scrollbar:horizontal {
    height: 10px;
}
#client::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#client::-webkit-scrollbar-track {
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
    #tablaClients {
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