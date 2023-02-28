<template>
    <Line :data="getData" :options="getOptions" :style="dashboardStyles" />
</template>

<script>
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { mapActions } from 'vuex'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default {
    components: {
        Line
    },
    props: ['fechaInicial', 'fechaFinal'],
    data() {
        return {
            arrayOrdersReport: []
        }
    },
    watch: {
        fechaFinal(newFecha, oldFecha) {
            if (newFecha != oldFecha)
                this.getDataReport()
        }
    },
    computed: {
        dashboardStyles() {
            return {
                'background-color': '#f8f9fa'
            }
        },
        getData() {
            const diaFinal = new Date(this.fechaFinal)
            const diaInicial = new Date(this.fechaInicial)
            // Colocar el rangoFechas de fechas en un arreglo
            const rangoFechas = []
            const totales = []
            rangoFechas.push(diaInicial.getFullYear() + '-' + (diaInicial.getMonth() + 1) + '-' + diaInicial.getDate())
            while(diaFinal > diaInicial) {
                diaInicial.setDate(diaInicial.getDate() + 1)
                rangoFechas.push(diaInicial.getFullYear() + '-' + (diaInicial.getMonth() + 1) + '-' + diaInicial.getDate())
            }

            const aux = this.arrayOrdersReport.filter(arreglo => {
                const fechaAux = new Date(arreglo.order_time + ' GMT-0500')
                if (rangoFechas.find(el => el == (fechaAux.getFullYear() + '-' + (fechaAux.getMonth() + 1) + '-' + fechaAux.getDate())))
                    return true
                else
                    return false
            })
            for (const fecha of rangoFechas) {
                let totalDiario = 0
                aux.map(x => {
                    const fechaAux = new Date(x.order_time + ' GMT-0500')
                    if ((fechaAux.getFullYear() + '-' + (fechaAux.getMonth() + 1) + '-' + fechaAux.getDate()) == fecha)
                        totalDiario += x.total
                    return totalDiario
                })
                totales.push(totalDiario)
            }
            return {
                labels: rangoFechas,
                datasets: [{
                    label: 'Ingresos',
                    backgroundColor: '#679a50',
                    data: totales
                }]
            }
        },
        getOptions() {
            return {
                responsive: true,
                maintainAspectRatio: true
            }
        }
    },
    methods: {
        ...mapActions('pedido', ['loadOrdersReport']),
        async getDataReport() {
            // Obtener lista de pedidos del año
            this.arrayOrdersReport = await this.loadOrdersReport(new Date(this.fechaFinal).getFullYear())
        }
    },
    created() {
        this.getDataReport()
    }
}
</script>