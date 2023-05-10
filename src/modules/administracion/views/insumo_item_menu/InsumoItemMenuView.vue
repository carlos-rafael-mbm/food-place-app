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
    <div v-else id="nuevo-control">
        <div class="d-flex justify-content-center align-items-center">
            <div class="my-3 col-auto align-center">
                <div class="text-center titulo animate__animated animate__flipInY">
                    Selecciona un platillo
                </div>
            </div>
        </div>
        <div class="justify-content-center align-items-center">
            <v-expansion-panels class="mx-auto panel-active-menu-global" multiple v-model="itemsMenu">
                <v-expansion-panel class="panel-active-menu animate__animated animate__flipInY" v-for="category in categories" :key="category.id">
                    <v-expansion-panel-title>
                        <template v-slot:default>
                            <v-row no-gutters>
                                <v-col cols="6" class="d-flex justify-start">
                                    {{ category.name }}
                                </v-col>
                            </v-row>
                        </template>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-card
                            class="mx-auto table-list"
                            max-height="400">
                            <v-list class="lista">
                                <v-list-item
                                    v-for="(item, i) in getActiveMenuByCategory(category.id)"
                                    :key="i"
                                    :value="item"
                                    @click=loadSuppliesByItem(item.item_menu)
                                    class="item-list">
                                    <template v-slot:default>
                                        <div class="d-flex justify-content-center align-items-center">
                                            <div class="left-control me-1">
                                                <v-avatar v-if="item.item_menu.image" size="x-small">
                                                    <v-img
                                                        :src="item.item_menu.image"
                                                        alt="item-menu"
                                                        cover>
                                                    </v-img>
                                                </v-avatar>
                                                <v-avatar v-else size="x-small">
                                                    <v-icon icon="mdi-cancel"></v-icon>
                                                </v-avatar>
                                            </div>
                                            <div>
                                                <v-list-item-title class="titulo-menu" v-text="item.item_menu.name"></v-list-item-title>
                                                <!-- <v-list-item-subtitle class="subtitulo-menu" v-text="item.item_menu.category.name"></v-list-item-subtitle> -->
                                            </div>
                                            <v-spacer></v-spacer>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-card>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>            
        </div>
        <div class="justify-content-center align-items-center">
            <div style="margin-top: 10px">
                <v-form ref="form">
                    <div class="d-flex justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="panelFormBase justify-content-center my-2">
                                <div class="panelForm100">
                                    <v-text-field
                                        label="Platillo"
                                        :readonly=true
                                        hide-details="auto"
                                        prepend-inner-icon="mdi-food"
                                        :rules="[rules.required]"
                                        :model-value="control.item_menu ? control.item_menu.name : null">
                                    </v-text-field>
                                </div>
                            </div>
                            <div class="panelFormBase justify-content-center my-2">                                
                                <div class="panelForm30">
                                    <v-text-field
                                        label="Cantidad"
                                        hide-details="auto"
                                        :prepend-inner-icon="iconAmount"
                                        :rules="[rules.required]"
                                        v-model="control.amount"
                                        required>
                                    </v-text-field>
                                </div>
                                <div class="panelForm50">
                                    <v-combobox 
                                        label="Insumo"                                    
                                        :items=branch_warehouses_detail
                                        item-value="id"
                                        item-title="supply.name"
                                        :prepend-inner-icon="iconSupply"                                    
                                        :rules="[rules.required]"
                                        hide-details="auto"
                                        v-model="obtained_supply">
                                    </v-combobox>
                                </div>
                                <div class="d-flex panelForm20 justify-content-center align-items-center">
                                    <v-label 
                                        :text="supply_unit">
                                    </v-label> 
                                </div>                                                                          
                            </div>
                        </div>          
                    </div>
                </v-form>
            </div>
            <div class="d-flex justify-content-center align-items-center">
                <div class="text-center">
                    <v-btn style="font-size: small"  class="ms-1 mb-2" rounded icon="mdi-plus-thick" color="#679a50" @click="guardarControl()"></v-btn>
                </div>
            </div>
            <div style="margin-bottom: 100px;" class="row justify-content-center align-items-center">
                <div id="tableSupplies" class="animate__animated animate__flipInY">
                    <easy-data-table
                        :headers="headers"
                        :items=supplies_control
                        :theme-color="themeColor"
                        :rows-per-page="10"
                        table-class-name="customize-table"
                        alternating
                        show-index
                        buttons-pagination
                        rows-per-page-message="Filas por página"
                        empty-message="No hay datos de insumos">
                        <template #item-action="item">
                            <div class="action-wrapper">
                                <v-btn icon="mdi-square-edit-outline" class="text-center me-2" color="blue" size="x-small" @click="cargarControl(item.id)"></v-btn>
                                <v-btn icon="mdi-trash-can-outline" class="text-center ms-2" color="#E75D48" size="x-small" @click="eliminarControl(item.id)"></v-btn>
                            </div>
                        </template>
                        <!-- <template #item-action="client">
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
                        </template> -->
                    </easy-data-table>
                </div>
            </div>          
        </div>        
    </div>    
</template>

<script>
import Swal from 'sweetalert2'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    components: {
        EasyDataTable: window['vue3-easy-data-table'],
    },
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            control:{
                id: 0,
                amount: 0,
                branch_warehouse_detail: null,
                item_menu: null,
            },
            iconSupply: window.innerWidth>=1200?'mdi-shaker':'',
            iconAmount: window.innerWidth>=1200?'mdi-counter':'',
            headers: [],
            supply_unit: 'Und.',
            obtained_supply: null,        
            isLoading: true,
            categories: [],
            itemsMenu: null,       
            themeColor: "#856826"
        }
    },
    computed: {
        ...mapState('control_insumo', ['supplies_control']),
        ...mapState('almacen', ['branch_warehouses_detail']),
        ...mapState('pedido', ['active_menu']),
        ...mapGetters('control_insumo',['getSupplyControlById']),
        ...mapGetters('login', ['getUser'])
    },
    watch:{
        obtained_supply(oldValue, newValue){
            if(oldValue!=newValue){
                if(this.obtained_supply){
                    this.supply_unit=this.obtained_supply.supply.measurement_unit.abbreviation
                    this.control.branch_warehouse_detail=this.obtained_supply
                }                
            }
        }
    },
    methods: {
        ...mapActions('control_insumo', ['createSupplyControl','loadSuppliesControl','updateSupplyControl','deleteSupplyControl']),
        ...mapActions('almacen', ['loadBranchWarehousesDetailByMain']),
        ...mapActions('pedido', ['loadActiveMenu']),     
        async loadSuppliesByItem(item){
            this.control.item_menu=item
            await this.loadSuppliesControl(item.id)
        },
        nuevoControl() {
            this.control.id = 0
            this.control.amount = 0
            this.control.branch_warehouse_detail = null
            this.obtained_supply = null
            this.supply_unit = 'Und.'
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarControl() {
            this.$refs.form.validate()
            if (!this.control.amount || !this.control.branch_warehouse_detail || !this.control.item_menu) return
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()            
            let res = []
            if (this.control.id == 0) {
                const formData = new FormData()
                formData.append('amount', this.control.amount)
                formData.append('branch_warehouse_detail_id', this.control.branch_warehouse_detail.id)
                formData.append('item_menu_id', this.control.item_menu.id)
                res = await this.createSupplyControl(formData)
            } else {
                const formData = new FormData()
                formData.append('amount', this.control.amount)
                formData.append('branch_warehouse_detail_id', this.control.branch_warehouse_detail.id)
                formData.append('item_menu_id', this.control.item_menu.id)
                res = await this.updateSupplyControl([this.control.id, formData])
            }
            if (res[0] != 0) {
                Swal.fire('Guardado', this.control.id == 0 ? 'Control de insumo registrado correctamente' : 'Control de insumo actualizado correctamente', 'success')
                this.nuevoControl()
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        },
        getActiveMenuByCategory(id) {
            return this.active_menu.filter(item => item.item_menu.category.id == id)
        },        
        async cargarControl(id) {
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let control = this.getSupplyControlById(id)
            if (!control) {
                Swal.fire('Error', 'No se pudo cargar los datos del insumo seleccionado', 'error')
            } else {
                this.control = control
                this.obtained_supply = control.branch_warehouse_detail
                Swal.close()
            }
        },
        async eliminarControl(id) {
            const {isConfirmed} = await Swal.fire({
                title: '¿Está seguro?',
                text: 'Se va a eliminar los datos del insumo',
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
                    await this.deleteSupplyControl(id)
                    Swal.fire('Eliminado', 'Datos del insumo eliminados', 'success')
                } catch (error) {
                    Swal.fire('Error', 'Los datos del insumo no pudieron ser eliminados', 'error')
                }
            }
        }        
    },
    async mounted() {
        await this.loadActiveMenu()
        await this.loadBranchWarehousesDetailByMain()
        this.headers = [
            { text: "Insumo", value: "branch_warehouse_detail.supply.name", width: 200},
            { text: "Cantidad", value: "amount", width: 70},
            { text: "Unidad de Medida", value: "branch_warehouse_detail.supply.measurement_unit.abbreviation", width: 150},
            { text: "Acciones", value: "action"}
        ]
        const map = new Map()
        for (const item of this.active_menu) {
            if(!map.has(item.item_menu.category.id)){
                map.set(item.item_menu.category.id, true)    // set any value to Map
                const nuevo = item.item_menu.category
                nuevo.amount = 0
                this.categories.push(nuevo)
            }
        }
        this.isLoading = false
    }
}
</script>

<style lang="scss" scoped>
#nuevo-control {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Ate.png');
    background-size: cover;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    width: 50%;
    border-radius: 20px;
}
.titulo {
    background-color: rgba(241, 196, 15, 0.6);
    border: 4px solid #856826;
    border-radius: 20px;
    width: 300px;
}
.seleccionado {
    background-color: rgba(103, 154, 80, 0.7);
    font-size: 1em;
    font-weight: bold;
}
.no-seleccionado {
    background-color: rgba(241, 196, 15, 0.6);
    border: 1px solid;
    font-size: 1em;
    font-weight: bold;
}
.slide-table {
    width: 70%;
}
.table-list {
    background-color: rgba(241, 196, 15, 0.3);
    width: 100%;
    overflow-y: auto;
}
.area-custom {
    width: 45%;
}
.lista {
    background-color: rgba(67, 116, 18, 0.5);
}
.item-list {
    border-bottom: 1px solid;
    // background-color: rgba(133, 104, 38, 0.6);
    margin: 1% 0px;
}
.cantidad {
    width: 25%;
    text-align: right;
}
.texto-cantidad {
    font-size: 0.8em;
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
}
.bgDialog {
    background-color: lighten($color: #F1C40F, $amount: 32);
}
.titulo-menu {
    font-size: 1em;
}
.subtitulo-menu {
    font-size: 0.9em;
}
.panel-active-menu-global {
    width: 50%;
}
.panel-active-menu {
    // background-color: rgba(246, 242, 116, 0.2);
    background-color: rgba(241, 196, 15, 0.6);
    width: 100%;
    border-radius: 20px;
    color: black;
}
.v-expansion-panel-text:deep(.v-expansion-panel-text__wrapper) {
    padding: 5px 5px 10px 5px;
}
.v-list {
    padding: 0px;
}
.v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
    padding-inline-start: 16px;
    padding-inline-end: 16px;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
.panelFormBase {
    display: flex !important;
}
.panelForm20 {
    margin-left: 10px;
    margin-right: 10px;
    width: 20%;
}
.panelForm30 {
    margin-left: 10px;
    margin-right: 10px;
    width: 30%;
}
.panelForm40 {
    margin-left: 10px;
    margin-right: 10px;
    width: 40%;
}
.panelForm50 {
    margin-left: 10px;
    margin-right: 10px;
    width: 50%;
}
.panelForm100 {
    margin-left: 10px;
    margin-right: 10px;
    width: 100%;
}
#tableSupplies {
    width: 50%;
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
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#nuevo-control::-webkit-scrollbar {
    -webkit-appearance: none;
}
#nuevo-control::-webkit-scrollbar:vertical {
    width:1px;
}
#nuevo-control::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#nuevo-control::-webkit-scrollbar:horizontal {
    height: 10px;
}
#nuevo-control::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#nuevo-control::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.table-list::-webkit-scrollbar {
    -webkit-appearance: none;
}
.table-list::-webkit-scrollbar:vertical {
    width: 6px;
}
.table-list::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.table-list::-webkit-scrollbar:horizontal {
    height: 10px;
}
.table-list::-webkit-scrollbar-thumb {
    background-color: rgba(67, 116, 18, 0.5);
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
.table-list::-webkit-scrollbar-track {
    border-radius: 10px;  
}
.bgDialog::-webkit-scrollbar {
    -webkit-appearance: none;
}
.bgDialog::-webkit-scrollbar:vertical {
    width:1px;
}
.bgDialog::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
.bgDialog::-webkit-scrollbar:horizontal {
    height: 10px;
}
.bgDialog::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
.bgDialog::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media only screen and (max-width: 850px) {
    .slide-table {
        width: 92%;
    }
    .area-custom {
        width: 92%;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .texto-cantidad {
        font-size: 0.9em;
    }
    .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline-start: 7px;
        padding-inline-end: 7px;
    }
}
@media only screen and (max-width: 430px) {
    .item-list {
        font-size: 0.8em;
        margin: 1% 0;
    }
    .cantidad {
        width: 20%;
    }
    .texto-cantidad {
        font-size: 0.9em;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .titulo-menu {
        font-size: 1.2em;
    }
    .subtitulo-menu {
        font-size: 1.05em;
    }
    .panel-active-menu-global {
        width: 97%;
    }
    .v-list-item--density-default:not(.v-list-item--nav).v-list-item--one-line {
        padding-inline-start: 7px;
        padding-inline-end: 7px;
    }
    #formulario {
        width: 97%;
    }
    .panelForm20 {
        margin-left: 7px;
        margin-right: 7px;
    }
    .panelForm30 {
        margin-left: 7px;
        margin-right: 7px;
    }
    .panelForm40 {
        margin-left: 7px;
        margin-right: 7px;
    }
    .panelForm50 {
        margin-left: 7px;
        margin-right: 7px;
    }
    #tableSupplies {
        width: 97%;
    }
}
</style>