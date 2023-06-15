import {foodplaceApi} from "@/api/foodplaceApi"

export const loadKardexes = async({commit}) => {
    commit('setLoading')
    const kardexes = []
    try {
        const { data } = await foodplaceApi.get('/kardex')
        for (const entry of Array.prototype.entries.call(data)) {
            kardexes.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setKardexes', kardexes)
    } catch (error) {
        commit('setKardexes', kardexes)
    } finally {
        commit('setLoading')
    }
}

export const loadKardexDetails = async({commit}, id) => {
    let kardex_details = []
    try {
        const { data } = await foodplaceApi.get(`/kardex_detail/search-kardex/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            kardex_details.push({...entry[1], orden: entry[0] + 1})
        }
        if (kardex_details)
            kardex_details.sort((a, b) => a.supply.category_supply.id - b.supply.category_supply.id)
    } catch (error) {
        kardex_details = []
    } finally {
        commit('setKardexDetails', kardex_details)
    }
}

export const loadMovementReasons = async({commit}) => {
    commit('setLoading')
    const movement_reasons = []
    try {
        const { data } = await foodplaceApi.get('/movement_reasons')
        for (const entry of Array.prototype.entries.call(data)) {
            movement_reasons.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setMovementReasons', movement_reasons)
    } catch (error) {
        commit('setMovementReasons', movement_reasons)
    } finally {
        commit('setLoading')
    }
}

export const createKardex = async ({commit}, kardex) => {
    try {
        const {data} = await foodplaceApi.post('/kardex', kardex)
        const { id, date, specification, movement_reason, employee} = data['kardex-creado']
        const kardex_nuevo = { id, date, specification, movement_reason, employee}
        commit('addKardex', kardex_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const createKardexDetail = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/kardex_detail', form)
        const { id, amount, price, supply, kardex, provider_id } = data['detalle-creado']
        const item_nuevo = { id, amount, price, supply, kardex, provider_id }
        commit('addKardexDetail', item_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateKardex = async({commit}, form) => {
    try {
        const idKardex = form[0]
        const kardex = form[1]
        const {data} = await foodplaceApi.put(`/kardex/${idKardex}`, kardex)
        const { id, date, specification, movement_reason, employee } = data['kardex-actualizado']
        const kardex_modificado = { id, date, specification, movement_reason, employee }
        commit('updateKardex', kardex_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateKardexDetail = async ({commit}, form) => {
    try {
        const idKardexDetail = form[0]
        const kardex_detail = form[1]
        const {data} = await foodplaceApi.put(`/kardex_detail/${idKardexDetail}`, kardex_detail)
        const { id, amount, price, supply, kardex, provider_id } = data['detalle-actualizado']
        const item_modificado = { id, amount, price, supply, kardex, provider_id }
        commit('updateKardexDetail', item_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteKardex = async ({commit}, id) => {
    await foodplaceApi.delete(`/kardex/${id}`)
    commit('deleteKardex', id)
}

export const deleteKardexDetail = async ({commit}, id) => {
    await foodplaceApi.delete(`/kardex_detail/${id}`)
    commit('deleteKardexDetail', id)
}