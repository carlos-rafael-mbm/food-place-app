<template>
    <Bar :data="getData" :options="getOptions" :style="dashboardStyles" />
</template>

<script>
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'
import { mapActions } from 'vuex'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default {
    components: {
        Bar
    },
    props: ['yearParam', 'monthParam'],
    data() {
        return {
            datos: null
        }
    },
    watch: {
        monthParam(newMonth, oldMonth) {
            if (newMonth != oldMonth)
                this.getDataReport()
        },
        yearParam(newYear, oldYear) {
            if (newYear != oldYear)
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
            const data = this.datos
            const resultEmployees = []
            const resultProductivity = []
            if (data)
                data.forEach((item, i) => {
                    if (i < 5) {
                        resultEmployees.push(item.empleado)
                        resultProductivity.push(parseInt(item.atendidos))
                    } else if(i == 5) {
                        resultEmployees.push('Otros')
                        resultProductivity.push(parseInt(item.atendidos))
                    } else {
                        resultProductivity[5] += parseInt(item.atendidos)
                    }
                })
            return {
                labels: resultEmployees,
                datasets: [{
                    label: 'Productividad',
                    backgroundColor: ['#4B79DC', '#679a50', '#E46651', '#F1C40F', '#DD1B16', '#96775B', '#679a50'],
                    data: resultProductivity
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
    created() {
        this.getDataReport()
    },
    methods: {
        ...mapActions('pedido', ['loadEmployeeProductivity']),
        async getDataReport() {
            this.datos = await this.loadEmployeeProductivity([this.yearParam, this.monthParam])
        }
    }
}
</script>