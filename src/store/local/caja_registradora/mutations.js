export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setCashRegisters = (state, cash_registers) => {
    state.cash_registers = [...cash_registers]
}

export const addCashRegister = (state, cash_register) => {
    state.cash_registers = [...state.cash_registers, cash_register]
}

export const updateCashRegister = (state, cash_register) => {
    const idx = state.cash_registers.map(e => e.id).indexOf(cash_register.id)
    state.cash_registers[idx] = cash_register
}

export const deleteCashRegister = (state, id) => {
    state.cash_registers = state.cash_registers.filter(e => e.id !== id)
}