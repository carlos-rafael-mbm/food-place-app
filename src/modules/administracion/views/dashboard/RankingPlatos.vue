<template>
    <Doughnut :data="getData" :options="getOptions" :style="dashboardStyles" />
</template>

<script>
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'
import { Doughnut } from 'vue-chartjs'
import { mapActions } from 'vuex'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    components: {
        Doughnut
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
            const resultItems = []
            const resultPositions = []
            if (data)
                data.forEach((item, i) => {
                    if (i < 5) {
                        resultItems.push(item.item + '-' + item.categoria)
                        resultPositions.push(parseInt(item.amount))
                    } else if(i == 5) {
                        resultItems.push('Otros')
                        resultPositions.push(parseInt(item.amount))
                    } else {
                        resultPositions[5] += parseInt(item.amount)
                    }
                })
            return {
                labels: resultItems,
                datasets: [{
                    backgroundColor: ['#4B79DC', '#679a50', '#E46651', '#F1C40F', '#DD1B16', '#96775B', '#679a50'],
                    data: resultPositions
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
        ...mapActions('pedido', ['loadMostRequestedItemsByMonth']),
        async getDataReport() {
            this.datos = await this.loadMostRequestedItemsByMonth([this.yearParam, this.monthParam])
        }
    }
}
</script>