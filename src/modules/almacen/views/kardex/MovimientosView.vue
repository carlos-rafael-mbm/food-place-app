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
    <div v-else id="entry">
        <div class="text-center d-flex justify-content-center" style="width:100%; margin-bottom: 100px;">
            <div class="panel-entry justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Movimiento de insumos"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 40%" class="left-control mt-3">
                                    <label for="txtFechaIngreso" style="font-weight: bold">Fecha</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="kardex.date"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 40%" class="right-control mt-3">
                                    <label for="txtAlmacenes" style="font-weight: bold">Almacén</label>
                                    <v-select
                                        v-model="obtained_origin"
                                        :items="getActiveBranches()"
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"
                                        single-line
                                        required
                                        return-object>
                                    </v-select>
                                </div>                                                               
                            </div>
                            <div class="d-flex justify-content-center">
                                <div style="width: 40%" class="left-control mt-3">
                                    <label for="txtMovimientos" style="font-weight: bold">Movimiento</label>
                                    <v-select
                                        v-model="obtained_movement"
                                        :items="[{id:1, name:'Entrada'}, {id:2, name:'Salida'}, {id:3, name:'Transferencia'}]"
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"                                
                                        single-line
                                        required
                                        return-object>
                                    </v-select>
                                </div>
                                <div style="width: 40%" class="right-control mt-3">
                                    <label for="txtRazonesMovimiento" style="font-weight: bold">Motivo</label>
                                    <v-select
                                        :hide-no-data=true
                                        v-model="obtained_reason"
                                        :items=obtained_movement?getMovementReasonsByType(obtained_movement.id):[]
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"
                                        single-line
                                        required
                                        return-object>
                                    </v-select>
                                </div>                               
                            </div>
                            <div v-if="obtained_reason && obtained_reason.name==='Otros'" class="d-flex justify-content-center">
                                <div style="width: 80%" class="middle-control mt-3 mb-3">
                                    <label for="txtEspecificacion" style="font-weight: bold">Especificación</label>
                                    <v-text-field
                                        hide-details="auto"
                                        :rules="[rules.required]"
                                        v-model="kardex.specification"
                                        label="Ingresa el motivo"
                                        required>
                                    </v-text-field>
                                </div>                                                                                              
                            </div>
                            <div v-if="obtained_movement && obtained_movement.id=== 3" class="d-flex justify-content-center">
                                <div style="width: 40%" class="left-control mt-3">
                                    <label for="txtAlmacenes2" style="font-weight: bold">Almacen de destino</label>
                                    <v-select
                                        :hide-no-data=true
                                        v-model="obtained_destiny"
                                        :items= obtained_origin?getActiveBranchesDestiny(obtained_origin.id):[]
                                        label="Seleccione"
                                        item-value="id"
                                        item-title="name"                              
                                        single-line
                                        required
                                        return-object>
                                    </v-select>
                                </div>                                                             
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>                
                <div v-if="showSupplies" class="row justify-content-center align-items-center">
                    <v-card
                        class="pa-2 table-list animate__animated animate__flipInY"
                        max-width="1000" max-height="600">
                        <v-list class="lista">
                            <div class="d-flex">
                                <div style="width: 58%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Insumos</h6>
                                </div>
                                <div style="width: 22%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Stock</h6>
                                </div>
                                <div style="width: 20%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>#</h6>
                                </div>
                            </div>
                            <v-list-item
                                v-for="(item, i) in suppliesToEntry"
                                :key="i"
                                :value="item"
                                class="item-list">
                                <template v-slot:default>
                                    <div class="d-flex justify-content-center align-items-center">
                                        <div style="width: 58%">
                                            <v-list-item-title class="titulo-menu text-left">
                                                <v-icon color="red" size="small" v-if="item.stock <= 10">mdi-flag-variant</v-icon>
                                                <v-icon color="yellow" size="small" v-if="item.stock > 10 && item.stock <=20">mdi-flag-variant</v-icon>
                                                <v-icon color="#045799" size="small" v-if="item.stock > 20">mdi-flag-variant</v-icon>
                                                {{ item.name }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="subtitulo-menu text-left">
                                                {{ item.category_supply.name }} ({{ item.measurement_unit.abbreviation }})
                                            </v-list-item-subtitle>
                                        </div>
                                        <div class="cantidad text-center" style="width: 22%">
                                            {{item.stock}}
                                        </div>
                                        <div style="width: 20%">
                                            <input type="number" v-model="item.stock_in" min="0" max="1000000" class="cantidad cantidad-edit">
                                        </div>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <div class="text-center">
                        <v-btn icon="mdi-receipt-text-check" class="mx-2 my-2" color="#E75D48" rounded @click="obtained_movement.id===3?guardarTransferencia():guardarKardex()">
                            <v-icon>mdi-receipt-text-check</v-icon>
                            <v-tooltip
                                activator="parent"
                                location="bottom">
                                Guardar entrada
                            </v-tooltip>
                        </v-btn>
                    </div>
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import Swal from "sweetalert2";

export default {
    data() {
        return {
            rules: {
                required: value => !!value || 'Campo requerido',
                requiredSelection: value => {
                    if (value instanceof Array && value.length == 0) {
                        return 'Campo requerido'
                    }
                    return !!value || 'Campo requerido'
                }
            },
            isLoading: true,
            kardex: {
                id: 0,
                date: this.getFechaActual(),
                specification: '',
                movement_reason: null,
                employee: null,
                branch: null
            },
            obtained_movement: null,
            obtained_reason: null,
            obtained_origin: null,
            obtained_destiny: null,
            suppliesToEntry: [],
            showSupplies: false,
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapGetters('almacen', ['getSuppliesToEntry', 'getDetailByBranch', 'getActiveBranches', 'getActiveBranchesDestiny']),
        ...mapGetters('kardex', ['getMovementReasonsByType']),
        ...mapGetters('login', ['getUser']),
        ...mapState('almacen', ['branch_warehouses_detail'])
    },
    watch:{
        obtained_reason(oldValue, newValue){            
            if(oldValue!=newValue){
                if(this.obtained_reason){
                    this.kardex.movement_reason=this.obtained_reason.id
                }
            }            
        },
        obtained_movement(oldValue, newValue){            
            if(oldValue!=newValue){
                if(this.obtained_movement){
                    this.obtained_destiny=null
                    this.obtained_reason=null
                    this.cargarInsumos()              
                }
            }            
        },
        obtained_origin(oldValue, newValue){            
            if(oldValue!=newValue){
                if(this.obtained_origin){
                    this.kardex.branch=this.obtained_origin
                    this.obtained_destiny=null
                    this.cargarInsumos()
                }
            }            
        },
        obtained_destiny(oldValue, newValue){            
            if(oldValue!=newValue){
                if(this.obtained_destiny){
                    this.cargarInsumosInterseccion()
                }
            }            
        },
    },
    methods: {
        ...mapActions('almacen', ['loadBranches', 'loadBranchWarehousesDetail', 'updateBranchWarehouseDetail']),
        ...mapActions('kardex', ['createKardex', 'createKardexDetail', 'loadMovementReasons']),
        getFechaActual() {
            const date = new Date(Date.now())
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            return date.toJSON().slice(0, 10)
        },
        async cargarInsumos() {
            if (this.kardex.branch) {
                await this.loadBranchWarehousesDetail(this.kardex.branch.id)
                this.suppliesToEntry = this.getSuppliesToEntry
                this.showSupplies = true
            }
        },
        async cargarInsumosInterseccion(){           
            const branch1Detail=[...this.branch_warehouses_detail]
            await this.loadBranchWarehousesDetail(this.obtained_destiny.id)
            const branch2Detail=[...this.branch_warehouses_detail]
            const commonSupplies = []
            for (const supply1 of branch1Detail) {
                for (const supply2 of branch2Detail) {
                    if (supply1.supply.id === supply2.supply.id) {
                        commonSupplies.push(supply1)
                        break
                    }
                }
            }
            this.suppliesToEntry=commonSupplies.map(detail=>detail.supply)
        },      
        nuevoKardex() {
            this.kardex.id = 0
            this.kardex.date = new Date(Date.now()).toISOString().split('T')[0]
            this.obtained_movement = null
            this.obtained_origin = null
            this.obtained_reason = null
            this.kardex.branch = null
            this.suppliesToEntry = this.getSuppliesToEntry
            this.showSupplies = false
            setTimeout(() => {
                this.$refs.form.resetValidation()
            }, 200);
        },
        async guardarKardex() {
            this.$refs.form.validate()
            if (!this.kardex.branch) {
                Swal.fire('Error', 'Debe seleccionar un almacén', 'error')
                return
            }
            if (!this.obtained_reason) {
                Swal.fire('Error', 'Debe seleccionar un motivo', 'error')
                return
            }
            let tieneCantidades = this.suppliesToEntry.some(x => x.stock_in > 0)
            if (!tieneCantidades) {
                Swal.fire('Error', 'No existen movimientos en insumos', 'error')
                return
            }
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            let hasError = false
            const formKardex = new FormData()
            formKardex.append('date', this.kardex.date)
            if(this.kardex.specification){
                formKardex.append('specification', this.kardex.specification)
            }
            formKardex.append('movement_reason_id', this.kardex.movement_reason)
            formKardex.append('employee_id', this.kardex.employee.id)
            const res = await this.createKardex(formKardex)            
            if (res[0] != 0) {
                for (const item of this.suppliesToEntry) {
                    if (item.stock_in && item.stock_in > 0) {
                        const branch_warehouse_det = await this.getDetailByBranch(this.kardex.branch.id, item.id)
                        const formDetalle = new FormData()
                        formDetalle.append('amount', item.stock_in)
                        formDetalle.append('price', item.price_in ? item.price_in : 0)
                        formDetalle.append('branch_warehouse_detail_id', branch_warehouse_det.id)
                        formDetalle.append('kardex_id', res[0])
                        const resDetalle = await this.createKardexDetail(formDetalle)
                        if (resDetalle[0] == 0) {
                            hasError = true
                            await Swal.fire({
                                position: 'top-end',
                                text: `El ítem ${item.name} no se agregó al kardex. ${resDetalle[1]}`,
                                color: 'white',
                                background: '#D96E4C',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                        const formSupply = new FormData()                        
                        formSupply.append('stock',this.obtained_movement.id===1?item.stock + item.stock_in:item.stock - item.stock_in)
                        const resSupply = await this.updateBranchWarehouseDetail([branch_warehouse_det.id, formSupply])
                        if (resSupply[0] == 0) {
                            hasError = true
                            await Swal.fire({
                                position: 'top-end',
                                text: `No se pudo actualizar el stock del ítem ${item.name}. ${resSupply[1]}`,
                                color: 'white',
                                background: '#D96E4C',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                }
                if (hasError) {
                    Swal.fire('Error', 'El registro se creó con errores', 'error')
                } else {
                    Swal.fire('Guardado', 'Insumos ingresados correctamente', 'success')
                    this.nuevoKardex()
                }
            } else {
                Swal.fire('Error', res[1], 'error')
            }                        
        },
        async recorrerDetalle(kardex_id, mtype) {
            let branch_id = 0        
            let hasError = false
            if(mtype==="S") {
                branch_id = this.kardex.branch.id
                await this.loadBranchWarehousesDetail(this.kardex.branch.id)
            }else{
                branch_id = this.obtained_destiny.id
                await this.loadBranchWarehousesDetail(this.obtained_destiny.id)
            }
            for (const item of this.suppliesToEntry) {
                if (item.stock_in && item.stock_in > 0) {
                    const branch_warehouse_det = await this.getDetailByBranch(branch_id, item.id)
                    const formDetalle = new FormData()
                    formDetalle.append('amount', item.stock_in)
                    formDetalle.append('price', item.price_in ? item.price_in : 0)
                    formDetalle.append('branch_warehouse_detail_id', branch_warehouse_det.id)
                    formDetalle.append('kardex_id', kardex_id)
                    const resDetalle = await this.createKardexDetail(formDetalle)
                    if (resDetalle[0] == 0) {
                        hasError = true
                        await Swal.fire({
                            position: 'top-end',
                            text: `El ítem ${item.name} no se agregó al kardex. ${resDetalle[1]}`,
                            color: 'white',
                            background: '#D96E4C',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }
                    const formSupply = new FormData()                      
                    formSupply.append('stock',mtype==="S"?branch_warehouse_det.stock - item.stock_in:branch_warehouse_det.stock + item.stock_in)
                    const resSupply = await this.updateBranchWarehouseDetail([branch_warehouse_det.id, formSupply])
                    if (resSupply[0] == 0) {
                        hasError = true
                        await Swal.fire({
                            position: 'top-end',
                            text: `No se pudo actualizar el stock del ítem ${item.name}. ${resSupply[1]}`,
                            color: 'white',
                            background: '#D96E4C',
                            timerProgressBar: true,
                            showConfirmButton: false,
                            timer: 1500
                        })
                    }                
                }
            }
            return hasError
        },
        async guardarTransferencia() {
            this.$refs.form.validate()
            if (!this.kardex.branch) {
                Swal.fire('Error', 'Debe seleccionar un almacén', 'error')
                return
            }
            if (!this.obtained_destiny) {
                Swal.fire('Error', 'Debe seleccionar un almacén de destino', 'error')
                return
            }
            if (!this.obtained_reason) {
                Swal.fire('Error', 'Debe seleccionar un motivo', 'error')
                return
            }
            let tieneCantidades = this.suppliesToEntry.some(x => x.stock_in > 0)
            if (!tieneCantidades) {
                Swal.fire('Error', 'No existen movimientos en insumos', 'error')
                return
            }
            new Swal({
                title: 'Espere por favor',
                allowOutsideClick: false
            })
            Swal.showLoading()
            const formKardex = new FormData()
            formKardex.append('date', this.kardex.date)
            if(this.kardex.specification){
                formKardex.append('specification', this.kardex.specification)
            }
            formKardex.append('movement_reason_id', this.kardex.movement_reason)
            formKardex.append('employee_id', this.kardex.employee.id)
            const res = await this.createKardex(formKardex)            
            if (res[0] != 0) {
                let hasError = await this.recorrerDetalle(res[0], "S")
                if (hasError) {
                    Swal.fire('Error', 'Error durante salida de insumos del almacén de origen', 'error')
                } else {
                    hasError = await this.recorrerDetalle(res[0], "E")
                    if(hasError){
                        Swal.fire('Error', 'Error durante ingreso de insumos al almacén de destino', 'error')
                    } else{
                        Swal.fire('Guardado', 'Insumos ingresados correctamente', 'success')
                        this.nuevoKardex()
                    }
                }
            } else {
                Swal.fire('Error', res[1], 'error')
            }                        
        }
    },    
    async mounted() {
        await this.loadBranches()
        await this.loadMovementReasons()
        this.kardex.employee = this.getUser.employee
        this.isLoading = false
    },
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(231, 93, 72, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 300px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    border-radius: 20px;
}
#entry {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.panel-entry {
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
    margin-left: 1em;
    margin-right: 1em;
}
.table-list {
    background-color: rgba(231, 93, 72, 0.6);
    width: 100%;
    overflow-y: auto;
}
.lista {
    background-color: #679a50;
    opacity: 80%;
    overflow-x: hidden;
}
.item-list {
    border-bottom: 1px solid;
    // background-color: rgba(133, 104, 38, 0.6);
    margin: 0%;
}
.cantidad {
    width: 90%;
    text-align: right;
    font-size: 0.9em;
}
.cantidad-edit {
    background-color: white;
    border: 1px solid;
    border-radius: 4px;
}
.titulo-menu {
    font-size: 1em;
}
.subtitulo-menu {
    font-size: 0.9em;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#entry::-webkit-scrollbar {
    -webkit-appearance: none;
}
#entry::-webkit-scrollbar:vertical {
    width:1px;
}
#entry::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#entry::-webkit-scrollbar:horizontal {
    height: 10px;
}
#entry::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#entry::-webkit-scrollbar-track {
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
@media (max-width: 650px) {
    /* For mobile phones: */
    .panel-entry {
        width: 90%;
    }
    #formulario {
        width: 98%;
        margin-left: 0px;
        margin-right: 0px;
    }
    #tablaInsumos {
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
    .item-list {
        margin: 0% -10px;
    }
}
</style>