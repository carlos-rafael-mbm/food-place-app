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
    <div v-else id="dashboard-page" class="d-flex">
        <div class="text-center d-flex justify-content-center" style="width:100%">
            <div class="panel-dashboard justify-content-center align-items-center">
                <div class="my-3 d-flex align-center flex-column">
                    <v-card
                        title="Dashboard de ventas"
                        class="text-center text-light titulo animate__animated animate__flipInY">
                    </v-card>
                </div>
                <div class="my-5 d-flex justify-content-center align-center flex-column">
                    <div id="formulario" class="mx-auto">
                        <div class="my-3 mx-5">
                            <v-text-field
                                label="Año de consulta"
                                v-model="year"
                                required
                                type="number"
                                density="compact"
                                hide-details="auto">
                            </v-text-field>
                        </div>
                    </div>
                </div>
                <div class="justify-content-center align-items-center" style="padding-bottom: 100px">
                    <v-container class="bg-surface-variant">
                        <v-row dense>
                            <v-col :cols="widthScreen">
                                <div class="graphic-title align-center mb-1">
                                    <v-card
                                        density="compact"
                                        variant="text"
                                        text="Ingresos por día"
                                        class="text-center animate__animated animate__flipInY">
                                    </v-card>
                                    <v-text-field density="compact" hide-details="auto" type="date" v-model="fechaInicialGrafico1" style="font-size: 1em;"></v-text-field>
                                    <v-text-field density="compact" hide-details="auto" type="date" v-model="fechaFinalGrafico1" style="font-size: small;"></v-text-field>
                                    <v-btn icon="mdi-chart-line" class="mt-1 mx-5" size="small" rounded color="#679A50"></v-btn>
                                </div>
                                <VentasDia :fecha-inicial="getFechaInicialGrafico1" :fecha-final="getFechaFinalGrafico1"/>
                            </v-col>
                            <v-col :cols="widthScreen">
                                <div class="graphic-title align-center mb-1">
                                    <v-card
                                        density="compact"
                                        variant="text"
                                        text="Ranking de platos"
                                        class="text-center animate__animated animate__flipInY">
                                    </v-card>
                                    <v-select
                                        density="compact"
                                        hide-details="auto"
                                        style="font-size: small;"
                                        v-model="mesGrafico2"
                                        :items="meses"
                                        item-value="id"
                                        item-title="name"
                                        label="Seleccione el mes"
                                        return-object>
                                    </v-select>
                                    <v-btn icon="mdi-chart-donut" class="mt-1 mx-5" size="small" rounded color="#679A50"></v-btn>
                                </div>
                                <div class="justify-content-center align-items-center">
                                    <div class="ranking-platos">
                                        <RankingPlatos :year-param="year" :month-param="mesGrafico2.id"/>
                                    </div>
                                </div>
                            </v-col>
                            <v-col :cols="12">
                                <div class="productividad-empleado">
                                    <div class="graphic-title align-center mb-1">
                                        <v-card
                                            density="compact"
                                            variant="text"
                                            text="Productividad por empleado"
                                            class="text-center animate__animated animate__flipInY">
                                        </v-card>
                                        <v-select
                                            density="compact"
                                            hide-details="auto"
                                            style="font-size: small;"
                                            v-model="mesGrafico3"
                                            :items="meses"
                                            item-value="id"
                                            item-title="name"
                                            label="Seleccione el mes"
                                            return-object>
                                        </v-select>
                                        <v-btn icon="mdi-chart-bar" class="mt-1 mx-5" size="small" rounded color="#679A50"></v-btn>
                                    </div>
                                </div>
                                <div class="justify-content-center align-items-center">
                                    <div class="ranking-platos">
                                        <ProductividadEmpleado :year-param="year" :month-param="mesGrafico3.id"/>
                                    </div>
                                </div>
                            </v-col>
                            <v-col :cols="widthScreen">
                                <!-- <v-card
                                    title="Próximamente"
                                    class="text-center text-dark animate__animated animate__flipInY">
                                </v-card> -->
                            </v-col>
                        </v-row>
                    </v-container>
                </div>
                <!-- <div class="justify-content-center align-items-center" style="margin-bottom: 100px">
                    <p>Personalice cada gráfico con los filtros que se encuentran en cada panel</p>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import VentasDia from "./VentasXDia.vue"
import RankingPlatos from "./RankingPlatos.vue"
import ProductividadEmpleado from "./ProductividadXEmpleado.vue"
import { mapActions } from "vuex"

export default {
    components: {
        VentasDia,
        RankingPlatos,
        ProductividadEmpleado
    },
    data() {
        return {
            widthScreen: window.innerWidth >= 800 ? 6 : 12,
            isLoading: true,
            fechaInicialGrafico1: this.getFormatoFecha(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - 6))),
            fechaFinalGrafico1: this.getFormatoFecha(new Date(Date.now())),
            year: new Date(Date.now()).getFullYear(),
            meses: [
                { 'id': 1, 'name': 'Enero' },
                { 'id': 2, 'name': 'Febrero' },
                { 'id': 3, 'name': 'Marzo' },
                { 'id': 4, 'name': 'Abril' },
                { 'id': 5, 'name': 'Mayo' },
                { 'id': 6, 'name': 'Junio' },
                { 'id': 7, 'name': 'Julio' },
                { 'id': 8, 'name': 'Agosto' },
                { 'id': 9, 'name': 'Setiembre' },
                { 'id': 10, 'name': 'Octubre' },
                { 'id': 11, 'name': 'Noviembre' },
                { 'id': 12, 'name': 'Diciembre' },
            ],
            mesGrafico2: null,
            mesGrafico3: null,
            data: null
        }
    },
    watch: {
        year(newValue, oldValue) {
            if (newValue != oldValue) {
                if (newValue == new Date(Date.now()).getFullYear()) {
                    this.fechaInicialGrafico1 = this.getFormatoFecha(new Date(new Date(Date.now()).setDate(new Date(Date.now()).getDate() - 6)))
                    this.fechaFinalGrafico1 = this.getFormatoFecha(new Date(Date.now()))
                } else {
                    this.fechaInicialGrafico1 = this.getFormatoFecha(new Date(newValue, 11, 1))
                    this.fechaFinalGrafico1 = this.getFormatoFecha(new Date(newValue, 11, 31))
                }
            }
        }
    },
    computed: {
        getFechaInicialGrafico1() {
            return new Date(this.fechaInicialGrafico1 + ' GMT-0500')
        },
        getFechaFinalGrafico1() {
            return new Date(this.fechaFinalGrafico1 + ' GMT-0500')
        }
    },
    methods: {
        ...mapActions('pedido', ['loadMostRequestedItemsByMonth']),
        getWidthScreen() {
            if (window.innerWidth >= 800) {
                this.widthScreen = 6
            } else {
                this.widthScreen = 12
            }
        },
        getFormatoFecha(fecha) {
            fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset())
            return fecha.toJSON().slice(0, 10)
        }
    },
    async created() {
        const mes = this.meses.filter(mes => mes.id == (new Date(Date.now()).getMonth() + 1))
        this.mesGrafico2 = mes[0]
        this.mesGrafico3 = mes[0]
    },
    async mounted() {
        window.addEventListener("resize", this.getWidthScreen)
        this.isLoading = false
    },
    unmounted() {
        window.removeEventListener("resize", this.getWidthScreen)
    }
}
</script>

<style lang="scss" scoped>
.titulo {
    background-color: rgba(133, 104, 38, 0.9);
    border-radius: 20px;
    font-size: 32px;
    width: 340px;
}
#formulario {
    background-color: rgba(241, 196, 15, 0.6);
    width: 20%;
    border-radius: 20px;
}
#dashboard-page {
    height: 100vh;
    overflow-y: auto;
    background: url('@/assets/Fondo-Adm.png');
    background-size: cover;
}
.panel-dashboard {
    width: 94%;
}
.bg-dashboard {
    background-color: rgba(241, 196, 15, 0.6);
}
.line-control {
    display: flex !important;
}
.middle-control {
    margin-left: 2em;
    margin-right: 2em;
    width: 100%;
}
.left-control {
    margin-left: 2em;
    margin-right: 1em;
    width: 50%;
}
.right-control {
    margin-left: 1em;
    margin-right: 2em;
    width: 50%;
}
#tablaPreparacionArea {
    padding-bottom: 100px;
}
.bgDialog {
    background-color: lighten($color: #F1C40F, $amount: 32);
}
.items-pedidos {
    margin-left: 15%;
    margin-right: 15%;
    overflow-y: auto;
    z-index: 1000 !important;
}
.itemList {
    border-bottom: 1px solid;
    background-color: rgba(133, 104, 38, 0.5);
    margin: 1% 0%;
}
.tituloMenu {
    font-size: 1em;
}
.subtituloMenu {
    font-size: 0.9em;
}
.texto-total {
    margin-left: 7%;
}
.total {
    margin-right: 7%;
}
.graphic-title {
    display: flex;
}
.ranking-platos {
    margin-left: 25%;
    margin-right: 25%;
}
.productividad-empleado {
    margin-left: 25%;
    margin-right: 25%;
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
/* Estilos para motores Webkit y blink (Chrome, Safari, Opera... )*/
#dashboard-page::-webkit-scrollbar {
    -webkit-appearance: none;
}
#dashboard-page::-webkit-scrollbar:vertical {
    width:1px;
}
#dashboard-page::-webkit-scrollbar-button:increment,#item_menu::-webkit-scrollbar-button {
    display: none;
} 
#dashboard-page::-webkit-scrollbar:horizontal {
    height: 10px;
}
#dashboard-page::-webkit-scrollbar-thumb {
    background-color: #797979;
    border-radius: 20px;
}
#dashboard-page::-webkit-scrollbar-track {
    border-radius: 10px;  
}
@media (max-width: 750px) {
    /* For mobile phones: */
    .panel-dashboard {
        width: 98%;
    }
    #formulario {
        width: 70%;
    }
    #tablaPreparacionArea {
        width: 100%;
        margin-left: 0px;
        margin-right: 0px;
    }
    .line-control {
        display: block !important;
    }
    .middle-control {
        margin-left: 0em;
        margin-right: 0em;
        width: 100%;
    }
    .left-control {
        width: 100%;
        margin-left: 0em;
        margin-right: 0em;
    }
    .right-control {
        width: 100%;
        margin-left: 0em;
        margin-right: 0em;
    }
    .items-pedidos {
        margin-left: 0%;
        margin-right: 0%;
    }
    .graphic-title {
        display: block;
    }
    .ranking-platos {
        margin-left: 5%;
        margin-right: 5%;
    }
    .productividad-empleado {
        margin-left: 0px;
        margin-right: 0px;
    }
}
</style>