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
    <div v-else id="stock-count">
        <div class="text-center d-flex justify-content-center stock-count-panel" style="margin-bottom: 100px;">
            <div class="panel-count justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Conteo de existencias"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <v-form ref="form" lazy-validation>
                    <div class="row justify-content-center mb-4">
                        <div id="formulario" class="animate__animated animate__flipInY">
                            <div class="d-flex justify-content-center">
                                <div style="width: 50%" class="left-control mt-5">
                                    <label for="txtFechaIngreso" style="font-weight: bold">Fecha de ingreso</label>
                                    <v-text-field
                                        hide-details="auto"
                                        type="date"
                                        :rules="[rules.required]"
                                        v-model="kardex.date"
                                        required>
                                    </v-text-field>
                                </div>
                                <div style="width: 50%" class="right-control mt-5">
                                    <label for="txtAlmacenes" style="font-weight: bold">Almacén</label>
                                    <v-select
                                        v-model="kardex.branch"
                                        :items="getActiveBranches()"
                                        item-value="id"
                                        item-title="name"
                                        :rules="[rules.requiredSelection]"
                                        label="Seleccione"
                                        single-line
                                        required
                                        return-object
                                        :change="cargarInsumos()">
                                    </v-select>
                                </div>
                            </div>
                        </div>
                        <br>
                    </div>
                </v-form>
                <div class="row justify-content-center align-items-center" v-if="showSupplies">
                    <v-card
                        class="pa-2 table-list animate__animated animate__flipInY"
                        max-width="1000" max-height="600">
                        <v-list class="lista">
                            <div class="d-flex">
                                <div style="width: 46%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Insumos</h6>
                                </div>
                                <div style="width: 12%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Stock neto</h6>
                                </div>
                                <div style="width: 12%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Stock utilizado</h6>
                                </div>
                                <div style="width: 15%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6><v-icon>mdi-counter</v-icon></h6>
                                </div>
                                <div style="width: 15%; border-bottom: 1px solid; margin: 0 10px">
                                    <h6>Stock real utilizado</h6>
                                </div>
                            </div>
                            <v-list-item
                                v-for="(item, i) in suppliesToStockCount"
                                :key="i"
                                :value="item"
                                class="item-list">
                                <template v-slot:default>
                                    <div class="d-flex justify-content-center align-items-center">
                                        <div style="width: 46%">
                                            <v-list-item-title class="titulo-menu text-left">
                                                <v-icon color="red" size="small" v-if="item.stock <= 10">mdi-flag-variant</v-icon>
                                                <v-icon color="yellow" size="small" v-if="item.stock > 10 && item.stock <=20">mdi-flag-variant</v-icon>
                                                <v-icon color="#045799" size="small" v-if="item.stock > 20">mdi-flag-variant</v-icon>
                                                {{ item.supply_name }}
                                            </v-list-item-title>
                                            <v-list-item-subtitle class="subtitulo-menu text-left">
                                                {{ item.category_supply_name }} ({{ item.measurement_unit_name }})
                                            </v-list-item-subtitle>
                                        </div>
                                        <div class="cantidad" style="width: 12%">
                                            {{item.stock}}
                                        </div>
                                        <div class="cantidad" style="width: 12%">
                                            {{item.amount_used}}
                                        </div>
                                        <div style="width: 15%">
                                            <input type="number" :value="item.stock_count.toFixed(2)" min="0" max="1000" class="cantidad cantidad-edit text-right">
                                        </div>
                                        <div style="width: 15%">
                                            {{(item.stock - item.stock_count).toFixed(2)}}
                                        </div>
                                    </div>
                                </template>
                            </v-list-item>
                        </v-list>
                    </v-card>
                    <div class="text-center">
                        <v-btn icon="mdi-receipt-text-check" class="mx-2 my-2" color="#E75D48" rounded @click="guardarKardex()">
                            <v-icon>mdi-receipt-text-check</v-icon>
                            <v-tooltip
                                activator="parent"
                                location="bottom">
                                Guardar conteo
                            </v-tooltip>
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
                movement_type: 'Salida',
                employee: null,
                branch: null
            },
            suppliesToStockCount: [],
            showSupplies: false,
            headers: [],
            themeColor: "#679a50"
        }
    },
    computed: {
        ...mapGetters('almacen', ['getSuppliesToStockCount', 'getDetailByBranch', 'getActiveBranches']),
        ...mapGetters('login', ['getUser'])
    },
    methods: {
        ...mapActions('almacen', ['loadBranches', 'loadBranchWarehousesDetailOutput', 'updateBranchWarehouseDetail', 'updateSupplyControl']),
        ...mapActions('kardex', ['createKardex', 'createKardexDetail']),
        ...mapActions('salida_insumo', ['deleteAllSuppliesOutput']),
        getFechaActual() {
            const date = new Date(Date.now())
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
            return date.toJSON().slice(0, 10)
        },
        async cargarInsumos() {
            if (this.kardex.branch) {
                this.suppliesToStockCount = await this.loadBranchWarehousesDetailOutput(this.kardex.branch.id)
                this.showSupplies = true
            }
        },
        async nuevoKardex() {
            this.kardex.id = 0
            this.kardex.date = new Date(Date.now()).toISOString().split('T')[0]
            this.kardex.movement_type = 'Salida'
            this.kardex.branch = null
            this.suppliesToStockCount = await this.loadBranchWarehousesDetailOutput(this.kardex.branch.id)
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
            let tieneCantidades = this.suppliesToStockCount.some(x => x.stock_count != x.stock)
            if (!tieneCantidades) {
                Swal.fire('Error', 'No existen cambios en el stock de los insumos', 'error')
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
            formKardex.append('movement_type', this.kardex.movement_type)
            formKardex.append('employee_id', this.kardex.employee.id)
            const res = await this.createKardex(formKardex)
            if (res[0] != 0) {
                for (const item of this.suppliesToStockCount) {
                    if (item.stock_count && item.stock != item.stock_count) {
                        const formDetalle = new FormData()
                        formDetalle.append('amount', item.stock - item.stock_count)
                        formDetalle.append('price', 0)
                        formDetalle.append('branch_warehouse_detail_id', item.id)
                        formDetalle.append('kardex_id', res[0])
                        const resDetalle = await this.createKardexDetail(formDetalle)
                        if (resDetalle[0] == 0) {
                            hasError = true
                            await Swal.fire({
                                position: 'top-end',
                                text: `El ítem ${item.supply_name} no se agregó al kardex. ${resDetalle[1]}`,
                                color: 'white',
                                background: '#D96E4C',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                        const formSupply = new FormData()
                        formSupply.append('stock', item.stock_count)
                        const resSupply = await this.updateBranchWarehouseDetail([item.id, formSupply])
                        if (resSupply[0] == 0) {
                            hasError = true
                            await Swal.fire({
                                position: 'top-end',
                                text: `No se pudo actualizar el stock del ítem ${item.supply_name}. ${resSupply[1]}`,
                                color: 'white',
                                background: '#D96E4C',
                                timerProgressBar: true,
                                showConfirmButton: false,
                                timer: 1500
                            })
                        }
                    }
                }
                const resSupplyOutput = await this.deleteAllSuppliesOutput()
                if (resSupplyOutput[0] == 0) {
                    await Swal.fire({
                        position: 'top-end',
                        text: 'Error al limpiar todas las salidas de los insumos',
                        color: 'white',
                        background: '#D96E4C',
                        timerProgressBar: true,
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
                if (hasError) {
                    Swal.fire('Error', 'El conteo se realizó con errores', 'error')
                } else {
                    Swal.fire('Guardado', 'Conteo registrado correctamente', 'success')
                    this.nuevoKardex()
                }
            } else {
                Swal.fire('Error', res[1], 'error')
            }
        }
    },
    async mounted() {
        await this.loadBranches()
        this.kardex.employee = this.getUser.employee
        this.isLoading = false
    }
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
#stock-count {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Alm.png');
    background-size: cover;
}
.stock-count-panel {
    width: 100%;
}
.panel-count {
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
    text-align: center;
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
#stock-count::-webkit-scrollbar {
    -webkit-appearance: none;
}
#stock-count::-webkit-scrollbar:vertical {
    width:1px;
}
#stock-count::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#stock-count::-webkit-scrollbar:horizontal {
    height: 10px;
}
#stock-count::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#stock-count::-webkit-scrollbar-track {
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
@media (max-width: 1100px) {
    .panel-count {
        width: 80%;
    }
}
@media (max-width: 650px) {
    /* For mobile phones: */
    .stock-count-panel {
        width: 650px;
        overflow-x: scroll;
    }
    .panel-count {
        width: 90%;
    }
    #formulario {
        width: 70%;
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
    // .table-list {
    //     width: 500px;
    // }
    .item-list {
        margin: 0% -10px;
    }
}
</style>