export const getUserByUsername = (state) => (username = '') => {
    const user = state.users.find(m => m.username === username)
    if (!user) return
    return {...user}
}

export const getListUsers = (state) => () => {
    const users = []
    state.users.map(m =>
        users.push({
            username: m.username,
            state: m.state,
            roleName: m.role.name,
            fullName: m.employee.name + ' ' + m.employee.surname
        }))
    if (!users) return
    return users
}

export const getUserByEmployee = (state) => (id = '') => {
    const user = state.users.find(m => m.employee.id === id)
    if (!user) return
    return {...user}
}