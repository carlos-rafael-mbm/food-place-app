import {foodplaceApi} from "@/api/foodplaceApi"

export const loadObjectsPosition = async({commit}) => {
    commit('setLoading')
    const object_position = []
    try {
        const { data } = await foodplaceApi.get('/object_position')
        for (const entry of Array.prototype.entries.call(data)) {
            object_position.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setObjectsPosition', object_position)
    } catch (error) {
        commit('setObjectsPosition', object_position)
    } finally {
        commit('setLoading')
    }
}

export const createObjectPosition = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/object_position', form)
        const { id, name, position_x, position_y, dining_room_number, id_obj_relation, state } = data['posicion-objeto-creado']
        const objecto_nuevo = { id, name, position_x, position_y, dining_room_number, id_obj_relation, state }
        commit('addObjectPosition', objecto_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateObjectPosition = async(_, form) => {
    try {
        const idObjRelation = form[0]
        const objPosition = form[1]
        const {data} = await foodplaceApi.put(`/object_position/${idObjRelation}`, objPosition)
        return [1, data.message]
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteAllObjectsPosition = async ({commit}, dining_room_number) => {
    await foodplaceApi.delete(`/object_position/search-dining-room/${dining_room_number}`)
    commit('deleteAllObjectsPosition', dining_room_number)
}