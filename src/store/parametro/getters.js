export const getParameterById = (state) => (id = '') => {
    const parameter = state.parameters.find(p => p.id === id)
    if (!parameter) return
    return {...parameter}
}

export const getParameterByParameterCode = (state) => (code = '') => {
    const parameters = state.parameters.filter(p => p.parameter_code === code)
    if (!parameters) return
    return parameters
}