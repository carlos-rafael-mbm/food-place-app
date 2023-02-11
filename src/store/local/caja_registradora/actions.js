import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCashRegisters = async({commit}) => {
    commit('setLoading')
    const cash_registers = []
    try {
        const { data } = await foodplaceApi.get('/cash_registers')
        for (const entry of Array.prototype.entries.call(data)) {
            cash_registers.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCashRegisters', cash_registers)
    } catch (error) {
        commit('setCashRegisters', cash_registers)
    } finally {
        commit('setLoading')
    }
}

export const createCashRegister = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/cash_registers', form)
        const { id, name, state } = data['caja-registradora-creada']
        const caja_registradora_nueva = { id, name, state }
        commit('addCashRegister', caja_registradora_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateCashRegister = async({commit}, form) => {
    try {
        const idCashRegister = form[0]
        const table = form[1]
        const {data} = await foodplaceApi.put(`/cash_registers/${idCashRegister}`, table)
        const { id, name, state } = data['caja-registradora-actualizada']
        const caja_registradora_modificada = { id, name, state }
        commit('updateCashRegister', caja_registradora_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteCashRegister = async ({commit}, id) => {
    await foodplaceApi.delete(`/cash_registers/${id}`)
    commit('deleteCashRegister', id)
}