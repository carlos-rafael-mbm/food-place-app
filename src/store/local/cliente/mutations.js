export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setClients = (state, clients) => {
    state.clients = [...clients]
}

export const addClient = (state, client) => {
    state.clients = [...state.clients, client]
}

export const updateClient = (state, client) => {
    const idx = state.clients.map(e => e.id).indexOf(client.id)
    state.clients[idx] = client
}

export const deleteClient = (state, id) => {
    state.clients = state.clients.filter(e => e.id !== id)
}