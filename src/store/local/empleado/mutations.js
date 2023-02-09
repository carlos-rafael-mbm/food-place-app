export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setEmployees = (state, employees) => {
    state.employees = [...employees]
}

export const addEmployee = (state, employee) => {
    state.employees = [...state.employees, employee]
}

export const updateEmployee = (state, employee) => {
    const idx = state.employees.map(e => e.id).indexOf(employee.id)
    state.employees[idx] = employee
}

export const deleteEmployee = (state, id) => {
    state.employees = state.employees.filter(e => e.id !== id)
}