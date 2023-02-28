export const getTableById = (state) => (id = '') => {
    const table = state.tables.find(m => m.id === id)
    if (!table) return
    return {...table}
}

export const getTablesInOrder = (state) => () => {
    const tables = state.tables
    if (!tables) return
    tables.sort((a, b) => {
        const x = a.number.toLowerCase()
        const y = b.number.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...tables]
}

export const getActiveTables = (state) => () => {
    const tables = state.tables.filter(p => p.state == 1)
    if (!tables) return
    tables.sort((a, b) => {
        const x = a.number.toLowerCase()
        const y = b.number.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...tables]
}