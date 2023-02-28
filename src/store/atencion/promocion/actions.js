import { foodplaceApi } from "@/api/foodplaceApi"

export const loadPromotions = async({commit}) => {
    const promotions = []
    try {
        const { data } = await foodplaceApi.get('/promotions')
        for (const entry of Array.prototype.entries.call(data)) {
            promotions.push({...entry[1], orden: entry[0] + 1})
        }
        if (promotions) {
            promotions.sort((a, b) => b.id - a.id)
        }
        commit('setPromotions', promotions)
    } catch (error) {
        commit('setPromotions', promotions)
    }
}

export const loadActivePromotions = async({commit}) => {
    let promotions = []
    try {
        const { data } = await foodplaceApi.get('/promotions')
        for (const entry of Array.prototype.entries.call(data)) {
            promotions.push({...entry[1], orden: entry[0] + 1})
        }
        if (promotions) {
            promotions = [...promotions.filter(x => x.state == 1 && (new Date(x.start_date) <= Date.now() && Date.now() <= (new Date(x.end_date + ' GMT-0500').setDate((new Date(x.end_date + ' GMT-0500')).getDate() + 1))))]
            promotions.sort((a, b) => b.id - a.id)
        }
        commit('setPromotions', promotions)
    } catch (error) {
        commit('setPromotions', promotions)
    }
}

export const createPromotion = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/promotions', form)
        const { id, name, start_date, end_date, description, discount, image, state } = data['promocion-creada']
        const promocion_nueva = { id, name, start_date, end_date, description, discount, image, state }
        commit('addPromotion', promocion_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updatePromotion = async({commit}, form) => {
    try {
        const idPromotion = form[0]
        const promotion = form[1]
        const {data} = await foodplaceApi.put(`/promotions/${idPromotion}`, promotion)
        const { id, name, start_date, end_date, description, discount, image, state } = data['promocion-actualizada']
        const promocion_modificada = { id, name, start_date, end_date, description, discount, image, state }
        commit('updatePromotion', promocion_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deletePromotion = async ({commit}, id) => {
    await foodplaceApi.delete(`/promotions/${id}`)
    commit('deletePromotion', id)
}