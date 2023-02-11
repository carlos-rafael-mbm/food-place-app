export const getCashRegisterById = (state) => (id = '') => {
    const cash_register = state.cash_registers.find(m => m.id === id)
    if (!cash_register) return
    return {...cash_register}
}

export const getCashRegistersInOrder = (state) => () => {
    const cash_registers = [...state.cash_registers]
    if (!cash_registers) return
    cash_registers.sort((a, b) => {
        const x = a.name.toLowerCase()
        const y = b.name.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...cash_registers]
}