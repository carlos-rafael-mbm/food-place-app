import {foodplaceApi} from "@/api/foodplaceApi"

export const loadTables = async({commit}) => {
    commit('setLoading')
    const tables = []
    try {
        const { data } = await foodplaceApi.get('/tables')
        for (const entry of Array.prototype.entries.call(data)) {
            tables.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setTables', tables)
    } catch (error) {
        commit('setTables', tables)
    } finally {
        commit('setLoading')
    }
}

export const createTable = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/tables', form)
        const { id, number, state } = data['mesa-creada']
        const mesa_nueva = { id, number, state }
        commit('addTable', mesa_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateTable = async({commit}, form) => {
    try {
        const idTable = form[0]
        const table = form[1]
        const {data} = await foodplaceApi.put(`/tables/${idTable}`, table)
        const { id, number, state } = data['mesa-actualizada']
        const mesa_modificada = { id, number, state }
        commit('updateTable', mesa_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteTable = async ({commit}, id) => {
    await foodplaceApi.delete(`/tables/${id}`)
    commit('deleteTable', id)
}