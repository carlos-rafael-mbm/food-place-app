import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCashierBalancings = async({commit}, assignment_id) => {
    commit('setLoading')
    const cashier_balancings = []
    try {
        const { data } = await foodplaceApi.get(`/cashier_balancings/search-assignment/${assignment_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            cashier_balancings.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCashierBalancings', cashier_balancings)
    } catch (error) {
        commit('setCashierBalancings', cashier_balancings)
    } finally {
        commit('setLoading')
    }
}

export const loadCashierBalancingsToday = async({commit}) => {
    commit('setLoading')
    const cashier_balancings = []
    try {
        const { data } = await foodplaceApi.get('/cashier_balancings/today')
        for (const entry of Array.prototype.entries.call(data)) {
            cashier_balancings.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCashierBalancings', cashier_balancings)
    } catch (error) {
        commit('setCashierBalancings', cashier_balancings)
    } finally {
        commit('setLoading')
    }
}

export const createCashierBalancing = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/cashier_balancings', form)
        const { id, start_datetime, end_datetime, total_inflow, total_outflow, end_balance, real_balance, state, cash_register_assignment } = data['arqueo-creado']
        const arqueo_nuevo = { id, start_datetime, end_datetime, total_inflow, total_outflow, end_balance, real_balance, state, cash_register_assignment }
        commit('addCashierBalancing', arqueo_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateCashierBalancing = async({commit}, form) => {
    try {
        const idCashierBalancing = form[0]
        const balancing = form[1]
        const {data} = await foodplaceApi.put(`/cashier_balancings/${idCashierBalancing}`, balancing)
        const { id, start_datetime, end_datetime, total_inflow, total_outflow, end_balance, real_balance, state, cash_register_assignment } = data['arqueo-actualizado']
        const arqueo_modificado = { id, start_datetime, end_datetime, total_inflow, total_outflow, end_balance, real_balance, state, cash_register_assignment }
        commit('updateCashierBalancing', arqueo_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}