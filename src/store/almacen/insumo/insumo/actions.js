import {foodplaceApi} from "@/api/foodplaceApi"

export const loadSupplies = async({commit}) => {
    commit('setLoading')
    const supplies = []
    try {
        const { data } = await foodplaceApi.get('/supplies')
        for (const entry of Array.prototype.entries.call(data)) {
            supplies.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setSupplies', supplies)
    } catch (error) {
        commit('setSupplies', supplies)
    } finally {
        commit('setLoading')
    }
}

export const createSupply = async ({commit}, insumo) => {
    try {
        const {data} = await foodplaceApi.post('/supplies', insumo)
        const { id, name, stock, measurement_unit, category_supply } = data['insumo-creado']
        const insumo_nuevo = { id, name, stock, measurement_unit, category_supply }
        commit('addSupply', insumo_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateSupply = async({commit}, form) => {
    try {
        const idInsumo = form[0]
        const insumo = form[1]
        const {data} = await foodplaceApi.put(`/supplies/${idInsumo}`, insumo)
        const { id, name, stock, measurement_unit, category_supply } = data['insumo-actualizado']
        const insumo_modificado = { id, name, stock, measurement_unit, category_supply }
        commit('updateSupply', insumo_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteSupply = async ({commit}, id) => {
    await foodplaceApi.delete(`/supplies/${id}`)
    commit('deleteSupply', id)
}