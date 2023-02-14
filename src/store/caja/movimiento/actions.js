import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCashRegisterMovements = async({commit}, assignment_id) => {
    commit('setLoading')
    const cash_register_movements = []
    try {
        const { data } = await foodplaceApi.get(`/cash_register_movements/search-assignment/${assignment_id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            cash_register_movements.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCashRegisterMovements', cash_register_movements)
    } catch (error) {
        commit('setCashRegisterMovements', cash_register_movements)
    } finally {
        commit('setLoading')
    }
}

export const createCashRegisterMovement = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/cash_register_movements', form)
        const { id, movement_type, amount, movement_datetime, reason, state, cash_register_assignment } = data['movimiento-creado']
        const movimiento_nuevo = { id, movement_type, amount, movement_datetime, reason, state, cash_register_assignment }
        commit('addCashRegisterMovement', movimiento_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateCashRegisterMovement = async({commit}, form) => {
    try {
        const idCashRegisterMovement = form[0]
        const movement = form[1]
        const {data} = await foodplaceApi.put(`/cash_register_movements/${idCashRegisterMovement}`, movement)
        const { id, movement_type, amount, movement_datetime, reason, state, cash_register_assignment } = data['movimiento-actualizado']
        const movimiento_modificado = { id, movement_type, amount, movement_datetime, reason, state, cash_register_assignment }
        commit('updateCashRegisterMovement', movimiento_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}