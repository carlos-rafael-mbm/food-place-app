export const setSuppliesOutput = (state, supplies_output) => {
    state.supplies_output = [...supplies_output]
}

export const addSupplyOutput = (state, supply_output) => {
    state.supplies_output = [...state.supplies_output, supply_output]
}

export const updateSupplyOutput = (state, supply_output) => {
    const idx = state.supplies_output.map(e => e.id).indexOf(supply_output.id)
    state.supplies_output[idx] = supply_output
}

export const deleteSupplyOutput = (state, id) => {
    state.supplies_output = state.supplies_output.filter(e => e.id !== id)
}