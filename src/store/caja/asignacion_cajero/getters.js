export const getCashRegisterAssignmentById = (state) => (id = '') => {
    const cash_register_assignment = state.cash_register_assignments.find(m => m.id === id)
    if (!cash_register_assignment) return
    return {...cash_register_assignment}
}

export const getCashRegisterAssignmentsInOrder = (state) => () => {
    const cash_register_assignments = [...state.cash_register_assignments]
    if (!cash_register_assignments) return
    cash_register_assignments.sort((a, b) => b.id - a.id)
    return [...cash_register_assignments]
}