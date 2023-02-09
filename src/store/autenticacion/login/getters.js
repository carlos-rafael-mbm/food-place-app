export const getCurrentState = (state) => {
    return state.status
}

export const getUser = (state) => {
    return state.user ? state.user : ''
}