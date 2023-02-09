import {foodplaceApi} from "@/api/foodplaceApi"

export const loadMeasurementUnits = async({commit}) => {
    commit('setLoading')
    const measurement_units = []
    try {
        const { data } = await foodplaceApi.get('/measurement_units')
        for (const entry of Array.prototype.entries.call(data)) {
            measurement_units.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setMeasurementUnits', measurement_units)
    } catch (error) {
        commit('setMeasurementUnits', measurement_units)
    } finally {
        commit('setLoading')
    }
}

export const createMeasurementUnit = async ({commit}, unidad_medida) => {
    try {
        const {data} = await foodplaceApi.post('/measurement_units', unidad_medida)
        const { id, description, abbreviation, state } = data['unidad-medida-creada']
        const unidad_medida_nueva = { id, description, abbreviation, state }
        commit('addMeasurementUnit', unidad_medida_nueva)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateMeasurementUnit = async({commit}, form) => {
    try {
        const idUnidadMedida = form[0]
        const unidad_medida = form[1]
        const {data} = await foodplaceApi.put(`/measurement_units/${idUnidadMedida}`, unidad_medida)
        const { id, description, abbreviation, state } = data['unidad-medida-actualizada']
        const unidad_medida_modificada = { id, description, abbreviation, state }
        commit('updateMeasurementUnit', unidad_medida_modificada)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteMeasurementUnit = async ({commit}, id) => {
    await foodplaceApi.delete(`/measurement_units/${id}`)
    commit('deleteMeasurementUnit', id)
}