export const getTableById = (state) => (id = '') => {
    const table = state.tables.find(m => m.id === id)
    if (!table) return
    return {...table}
}

export const getTablesInOrder = (state) => () => {
    const table = state.tables
    if (!table) return
    table.sort((a, b) => {
        const x = a.number.toLowerCase()
        const y = b.number.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...table]
}