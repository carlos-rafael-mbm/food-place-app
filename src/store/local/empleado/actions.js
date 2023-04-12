import {foodplaceApi} from "@/api/foodplaceApi"

export const loadEmployees = async({commit}) => {
    commit('setLoading')
    const employees = []
    try {
        const { data } = await foodplaceApi.get('/employees')
        for (const entry of Array.prototype.entries.call(data)) {
            employees.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setEmployees', employees)
    } catch (error) {
        commit('setEmployees', employees)
    } finally {
        commit('setLoading')
    }
}

export const loadCashiers = async({commit}) => {
    commit('setLoading')
    const cashiers = []
    try {
        const { data } = await foodplaceApi.get('/employees/cashiers')
        for (const entry of Array.prototype.entries.call(data)) {
            cashiers.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setEmployees', cashiers)
    } catch (error) {
        commit('setEmployees', cashiers)
    } finally {
        commit('setLoading')
    }
}

export const createEmployee = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/employees', form)
        const { id, dni, name, surname, cellphone, email, birthday, image, state } = data['empleado-creado']
        const empleado_nuevo = { id, dni, name, surname, cellphone, email, birthday, image, state }
        commit('addEmployee', empleado_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateEmployee = async({commit}, form) => {
    try {
        const idEmployee = form[0]
        const employee = form[1]
        const {data} = await foodplaceApi.put(`/employees/${idEmployee}`, employee)
        const { id, dni, name, surname, cellphone, email, birthday, image, state } = data['empleado-actualizado']
        const empleado_modificado = { id, dni, name, surname, cellphone, email, birthday, image, state }
        commit('updateEmployee', empleado_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteEmployee = async ({commit}, id) => {
    await foodplaceApi.delete(`/employees/${id}`)
    commit('deleteEmployee', id)
}
