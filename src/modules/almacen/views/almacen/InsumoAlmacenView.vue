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
    <div v-else id="supply-branch">
        <div class="mx-5 row justify-content-center align-items-center">
            <div class="my-3 d-flex align-center flex-column">
                <v-card
                    title="Asignación de insumos"
                    class="text-center text-light titulo animate__animated animate__flipInY"
                ></v-card>
            </div>
        </div>
        <div class="text-center d-flex justify-content-center">
            <div id="list-branch" class="justify-content-center align-items-center animate__animated animate__flipInY">
                <div class="text-center" style="width: 100%">
                    <v-slide-group
                        v-model="idx_branch"
                        center-active
                        show-arrows>
                        <v-slide-group-item
                            v-for="branch in branches"
                            :key="branch.id"
                            v-slot="{ isSelected, toggle }">
                            <v-card
                                :class="isSelected ? 'seleccionado' : 'no-seleccionado'"
                                class="ma-3"
                                height="150"
                                width="100"
                                @click="toggle(); isAssignment = !isSelected; !isSelected && this.cargarBranchWarehouseDetail(branch.id)">
                                <div class="d-flex fill-height align-center justify-center">
                                    <div class="imgBranchCardSelect" v-if="isSelected">
                                        <v-icon
                                            size="48"
                                            icon="mdi-close-circle-outline">
                                        </v-icon>
                                        <div class="bgBranchCardSelect">{{branch.name}}</div>
                                    </div>
                                    <div v-else class="bgBranchCard">
                                        <v-icon
                                            size="48"
                                            icon="mdi-warehouse">
                                        </v-icon>
                                        <br>
                                        {{branch.name}}
                                    </div>
                                </div>
                            </v-card>
                        </v-slide-group-item>
                    </v-slide-group>
                </div>
            </div>
        </div>
        <div v-if="isAssignment" class="d-flex mt-5" style="margin-bottom: 100px">
            <div class="col-6">
                <div class="left-list">
                    <div class="row justify-content-center align-items-center">
                        <v-card
                            class="text-center text-light titulo-list mb-1 animate__animated animate__flipInY">
                            <v-card-text class="titulo-list-text">Lista de insumos</v-card-text>
                        </v-card>
                    </div>
                    <div class="div-draggable">
                        <draggable
                            class="list-group animate__animated animate__flipInY"
                            :list="supplies"
                            :move="checkMove"
                            group="food"
                            itemKey="id">
                            <template #item="{ element }">
                                <div class="list-group-item element-list">
                                    <div class="d-flex justify-content-center align-items-center lista-responsive">
                                        <div class="col-md-5 col-4">{{ element.name }}</div>
                                        <div class="text-right col-md-5 col-4">{{ element.category_supply.name }}</div>
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
                            <v-card-text class="titulo-list-text">Insumos en almacén</v-card-text>
                        </v-card>
                    </div>
                    <div class="div-draggable">
                        <draggable
                            class="list-group animate__animated animate__flipInY"
                            :list="supplies_branch"
                            group="food"
                            @change="asignar"
                            itemKey="id">
                            <template #item="{ element }">
                                <div class="list-group-item element-list">
                                    <div class="d-flex justify-content-center align-items-center lista-responsive">
                                        <div class="col-md-5 col-4">{{ element.name }}</div>
                                        <div class="text-right col-md-5 col-4">{{ element.category_supply.name }}</div>
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

export default {
    data() {
        return {
            idx_branch: null,
            isAssignment: false,
            rules: {
                required: value => !!value || 'Campo requerido'
            },
            branch: {
                id: 0,
                name: '',
                address: '',
                state: true
            },
            supplies_branch: []
        }
    },
    components: {
        draggable
    },
    computed: {
        ...mapState('almacen', ['isLoading', 'branches', 'branch_warehouses_detail']),
        ...mapState('insumo', ['supplies']),
        ...mapGetters('almacen', ['getBranchById', 'getSuppliesFromDetail', 'getDetailByBranch'])
    },
    methods: {
        ...mapActions('almacen', ['loadBranches', 'loadBranchWarehousesDetail', 'createBranchWarehouseDetail', 'deleteBranchWarehouseDetail']),
        ...mapActions('insumo', ['loadSupplies']),
        async cargarBranchWarehouseDetail(id) {
            await this.loadBranchWarehousesDetail(id)
            await this.loadSupplies()
            this.branch = await this.getBranchById(id)
            this.supplies_branch = await this.getSuppliesFromDetail
        },
        checkMove: function(evt){
            const existe = this.supplies_branch.find(m => m.id === evt.draggedContext.element.id)
            return existe ? false : true
        },
        asignar: async function(evt) {
            if (evt.added) {
                const formData = new FormData()
                formData.append('stock', 0)
                formData.append('branch_id', this.branch.id)
                formData.append('supply_id', evt.added.element.id)
                const res = await this.createBranchWarehouseDetail(formData)
                if (res[0] != 0) {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Insumo asignado al almacén',
                        color: 'white',
                        background: '#5AC855',
                        showConfirmButton: false,
                        timer: 1300
                    })
                } else {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Error al asignar insumo al almacén',
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
                    const branch_warehouse_det = await this.getDetailByBranch(this.branch.id, evt.removed.element.id)
                    await this.deleteBranchWarehouseDetail(branch_warehouse_det.id)
                    Swal.fire({
                        position: 'top-end',
                        text: 'Se quitó la asignación del insumo al almacén',
                        color: 'white',
                        background: '#5AC855',
                        showConfirmButton: false,
                        timer: 1300
                    })
                } catch (error) {
                    Swal.fire({
                        position: 'top-end',
                        text: 'Error al quitar asignación del insumo',
                        color: 'white',
                        background: 'red',
                        showConfirmButton: false,
                        timer: 1300
                    })
                }
                await this.loadSupplies()
            }
        }
    },
    mounted() {
        this.loadBranches()
        this.loadSupplies()
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
#supply-branch {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
#list-branch {
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
.imgBranchCardSelect {
    background-color: rgba(103, 154, 80, 0.7);
    width: 100%;
}
.bgBranchCard {
    background-color: rgba(241, 196, 15, 0.6);
    font-size: 10px;
    font-weight: bold;
    &:hover {
        background-color: rgba(103, 154, 80, 0.6);
    }
}
.bgBranchCardSelect {
    font-size: 12px;
    font-weight: bold;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    width: 50%;
    border-radius: 20px;
}
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#supply-branch::-webkit-scrollbar {
    -webkit-appearance: none;
}
#supply-branch::-webkit-scrollbar:vertical {
    width:1px;
}
#supply-branch::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#supply-branch::-webkit-scrollbar:horizontal {
    height: 10px;
}
#supply-branch::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
    // border: 1px solid #f1f2f3;
}
#supply-branch::-webkit-scrollbar-track {
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