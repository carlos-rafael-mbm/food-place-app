export const getParameterById = (state) => (id = '') => {
    const parameter = state.parameters.find(p => p.id === id)
    if (!parameter) return
    return {...parameter}
}