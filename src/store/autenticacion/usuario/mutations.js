export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setUsers = (state, users) => {
    state.users = [...users]
}

export const addUser = (state, user) => {
    state.users = [...state.users, user]
}

export const updateUser = (state, user) => {
    const idx = state.users.map(e => e.username).indexOf(user.username)
    state.users[idx] = user
}

export const deleteUser = (state, username) => {
    state.users = state.users.filter(e => e.username !== username)
}

export const setRoles = (state, roles) => {
    state.roles = [...roles]
}