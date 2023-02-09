import {foodplaceApi} from "@/api/foodplaceApi"

export const loadPreparationAreas = async({commit}) => {
    commit('setLoading')
    const preparationAreas = []
    try {
        const { data } = await foodplaceApi.get('/preparation_areas')
        for (const entry of Array.prototype.entries.call(data)) {
            preparationAreas.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setPreparationAreas', preparationAreas)
    } catch (error) {
        commit('setPreparationAreas', preparationAreas)
    } finally {
        commit('setLoading')
    }
}

export const createPreparationArea = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/preparation_areas', form)
        const { id, name, description, state } = data['area-preparacion-creada']
        const areaPreparacionNueva = { id, name, description, state }
        commit('addPreparationArea', areaPreparacionNueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updatePreparationArea = async({commit}, form) => {
    try {
        const idPreparationArea = form[0]
        const preparationArea = form[1]
        const {data} = await foodplaceApi.put(`/preparation_areas/${idPreparationArea}`, preparationArea)
        const { id, name, description, state } = data['area-preparacion-actualizada']
        const areaPreparacionModificada = { id, name, description, state }
        commit('updatePreparationArea', areaPreparacionModificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deletePreparationArea = async ({commit}, id) => {
    await foodplaceApi.delete(`/preparation_areas/${id}`)
    commit('deletePreparationArea', id)
}

export const loadPreparationAreasDetail = async({commit}, id) => {
    let preparationAreasDetail = []
    try {
        const { data } = await foodplaceApi.get(`/preparation_areas_detail/search-preparation_area/${id}`)
        for (const entry of Array.prototype.entries.call(data)) {
            preparationAreasDetail.push({...entry[1], orden: entry[0] + 1})
        }
    } catch (error) {
        preparationAreasDetail = []
    } finally {
        commit('setPreparationAreasDetail', preparationAreasDetail)
    }
}

export const createPreparationAreaDetail = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/preparation_areas_detail', form)
        const { id, state, preparation_area, category } = data['detalle-creado']
        const detalle_nuevo = { id, state, preparation_area, category }
        commit('addPreparationAreaDetail', detalle_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deletePreparationAreaDetail = async ({commit}, id) => {
    await foodplaceApi.delete(`/preparation_areas_detail/${id}`)
    commit('deletePreparationAreaDetail', id)
}