import {foodplaceApi} from "@/api/foodplaceApi"

export const loadUsers = async({commit}) => {
    commit('setLoading')
    const users = []
    try {
        const { data } = await foodplaceApi.get('/users')
        for (const entry of Array.prototype.entries.call(data)) {
            users.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setUsers', users)
    } catch (error) {
        commit('setUsers', users)
    } finally {
        commit('setLoading')
    }
}

export const createUser = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/users', form)
        const { username, password, created_at, updated_at, state, role, employee } = data['usuario-creado']
        const usuario_nuevo = { username, password, created_at, updated_at, state, role, employee }
        commit('addUser', usuario_nuevo)
        return [username, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateUser = async({commit}, form) => {
    try {
        const idUser = form[0]
        const user = form[1]
        const {data} = await foodplaceApi.put(`/users/${idUser}`, user)
        const { username, password, created_at, updated_at, state, role, employee } = data['usuario-actualizado']
        const usuario_modificado = { username, password, created_at, updated_at, state, role, employee }
        commit('updateUser', usuario_modificado)
        return [username, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteUser = async ({commit}, username) => {
    await foodplaceApi.delete(`/users/${username}`)
    commit('deleteUser', username)
}

export const loadRoles = async({commit}) => {
    const roles = []
    try {
        const { data } = await foodplaceApi.get('/roles')
        for (const entry of Array.prototype.entries.call(data)) {
            roles.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setRoles', roles)
    } catch (error) {
        commit('setRoles', roles)
    }
}