export const getClientById = (state) => (id = '') => {
    const client = state.clients.find(m => m.id === id)
    if (!client) return
    return {...client}
}