import {foodplaceApi} from "@/api/foodplaceApi"

export const loadClients = async({commit}) => {
    commit('setLoading')
    const clients = []
    try {
        const { data } = await foodplaceApi.get('/clients')
        for (const entry of Array.prototype.entries.call(data)) {
            clients.push({...entry[1], orden: entry[0] + 1})
        }
        commit('setClients', clients)
    } catch (error) {
        commit('setClients', clients)
    } finally {
        commit('setLoading')
    }
}

export const createClient = async ({commit}, form) => {
    try {
        const {data} = await foodplaceApi.post('/clients', form)
        const { id, doc_type, doc_number, business_name, name, surname, cellphone, email, birthday, recurrent, image } = data['cliente-creado']
        const cliente_nuevo = { id, doc_type, doc_number, business_name, name, surname, cellphone, email, birthday, recurrent, image }
        commit('addClient', cliente_nuevo)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const updateClient = async({commit}, form) => {
    try {
        const idClient = form[0]
        const client = form[1]
        const {data} = await foodplaceApi.put(`/clients/${idClient}`, client)
        const { id, doc_type, doc_number, business_name, name, surname, cellphone, email, birthday, recurrent, image } = data['cliente-actualizado']
        const cliente_modificado = { id, doc_type, doc_number, business_name, name, surname, cellphone, email, birthday, recurrent, image }
        commit('updateClient', cliente_modificado)
        return [id, 'Ok']
    } catch (err) {
        if (err.response) {
            return [0, err.response.data.message]
        }
    }
}

export const deleteClient = async ({commit}, id) => {
    await foodplaceApi.delete(`/clients/${id}`)
    commit('deleteClient', id)
}