export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setSupplies = (state, supplies) => {
    state.supplies = [...supplies]
}

export const addSupply = (state, insumo) => {
    state.supplies = [...state.supplies, insumo]
}

export const updateSupply = (state, insumo) => {
    const idx = state.supplies.map(e => e.id).indexOf(insumo.id)
    state.supplies[idx] = insumo
}

export const deleteSupply = (state, id) => {
    state.supplies = state.supplies.filter(e => e.id !== id)
}