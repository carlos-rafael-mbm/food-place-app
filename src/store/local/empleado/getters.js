export const getEmployeeById = (state) => (id = '') => {
    const employee = state.employees.find(m => m.id === id)
    if (!employee) return
    return {...employee}
}

export const getCompleteNamesOfEmployees = (state) => () => {
    const employees = []
    state.employees.map(m => employees.push({ id: m.id, fullName: m.name + ' ' + m.surname }))
    if (!employees) return
    return employees
}

export const getCompleteNamesOfEmployee = (state) => (id = '') => {
    const employee = state.employees.find(m => m.id === id)
    if (!employee) return
    return { id: employee.id, fullName: employee.name + ' ' + employee.surname }
}