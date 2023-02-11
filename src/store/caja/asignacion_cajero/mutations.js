export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setCashRegisterAssignments = (state, cash_register_assignments) => {
    state.cash_register_assignments = [...cash_register_assignments]
}

export const addCashRegisterAssignment = (state, cash_register_assignment) => {
    state.cash_register_assignments = [...state.cash_register_assignments, cash_register_assignment]
}

export const updateCashRegisterAssignment = (state, cash_register_assignment) => {
    const idx = state.cash_register_assignments.map(e => e.id).indexOf(cash_register_assignment.id)
    state.cash_register_assignments[idx] = cash_register_assignment
}