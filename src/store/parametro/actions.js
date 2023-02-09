import {foodplaceApi} from "@/api/foodplaceApi"

export const loadParameters = async({commit}) => {
    commit('setLoading')
    const parameters = []
    try {
        const { data } = await foodplaceApi.get('/parameters')
        for (const entry of Array.prototype.entries.call(data)) {
            parameters.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setParameters', parameters)
    } catch (error) {
        commit('setParameters', parameters)
    } finally {
        commit('setLoading')
    }
}

export const createParameter = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/parameters', form)
        const { id, parameter_code, parameter_desc, item_code, item_desc, value, is_editable, state } = data['parametro-creado']
        const parametroNuevo = { id, parameter_code, parameter_desc, item_code, item_desc, value, is_editable, state }
        commit('addParameter', parametroNuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateParameter = async({commit}, form) => {
    try {
        const idParameter = form[0]
        const parameter = form[1]
        const {data} = await foodplaceApi.put(`/parameters/${idParameter}`, parameter)
        const { id, parameter_code, parameter_desc, item_code, item_desc, value, is_editable, state } = data['parametro-actualizado']
        const parametroModificado = { id, parameter_code, parameter_desc, item_code, item_desc, value, is_editable, state }
        commit('updateParameter', parametroModificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteParameter = async ({commit}, id) => {
    await foodplaceApi.delete(`/parameters/${id}`)
    commit('deleteParameter', id)
}