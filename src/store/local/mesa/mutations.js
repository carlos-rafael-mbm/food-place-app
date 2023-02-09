export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setTables = (state, tables) => {
    state.tables = [...tables]
}

export const addTable = (state, table) => {
    state.tables = [...state.tables, table]
}

export const updateTable = (state, table) => {
    const idx = state.tables.map(e => e.id).indexOf(table.id)
    state.tables[idx] = table
}

export const deleteTable = (state, id) => {
    state.tables = state.tables.filter(e => e.id !== id)
}