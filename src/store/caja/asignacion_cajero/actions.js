import {foodplaceApi} from "@/api/foodplaceApi"

export const loadCashRegisterAssignments = async({commit}) => {
    commit('setLoading')
    const cash_register_assignments = []
    try {
        const { data } = await foodplaceApi.get('/cash_register_assignments/today')
        for (const entry of Array.prototype.entries.call(data)) {
            cash_register_assignments.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setCashRegisterAssignments', cash_register_assignments)
    } catch (error) {
        commit('setCashRegisterAssignments', cash_register_assignments)
    } finally {
        commit('setLoading')
    }
}

export const loadLastCashRegisterAssignmentByEmployee = async(_, employee_id) => {
    try {
        const { data } = await foodplaceApi.get(`/cash_register_assignments/last-assignment-employee/${employee_id}`)
        const { id, assignment_datetime, initial_balance, state, cash_register, employee } = data['asignacion-consultada']
        const cash_register_assignment = { id, assignment_datetime, initial_balance, state, cash_register, employee }
        return cash_register_assignment
    } catch (error) {
        return null
    }
}

export const loadLastCashRegisterAssignmentByCashRegister = async(_, cash_register_id) => {
    try {
        const { data } = await foodplaceApi.get(`/cash_register_assignments/last-assignment-cash-register/${cash_register_id}`)
        const { id, assignment_datetime, initial_balance, state, cash_register, employee } = data['asignacion-consultada']
        const cash_register_assignment = { id, assignment_datetime, initial_balance, state, cash_register, employee }
        return cash_register_assignment
    } catch (error) {
        return null
    }
}

export const createCashRegisterAssignment = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/cash_register_assignments', form)
        const { id, assignment_datetime, initial_balance, state, cash_register, employee } = data['asignacion-creada']
        const asignacion_nueva = { id, assignment_datetime, initial_balance, state, cash_register, employee }
        commit('addCashRegisterAssignment', asignacion_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateCashRegisterAssignment = async({commit}, form) => {
    try {
        const idCashRegisterAssignment = form[0]
        const assignment = form[1]
        const {data} = await foodplaceApi.put(`/cash_register_assignments/${idCashRegisterAssignment}`, assignment)
        const { id, assignment_datetime, initial_balance, state, cash_register, employee } = data['asignacion-actualizada']
        const asignacion_modificada = { id, assignment_datetime, initial_balance, state, cash_register, employee }
        commit('updateCashRegisterAssignment', asignacion_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}