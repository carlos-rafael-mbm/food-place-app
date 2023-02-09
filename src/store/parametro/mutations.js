export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setParameters = (state, parameters) => {
    state.parameters = [...parameters]
}

export const addParameter = (state, parameter) => {
    state.parameters = [...state.parameters, parameter]
}

export const updateParameter = (state, parameter) => {
    const idx = state.parameters.map(e => e.id).indexOf(parameter.id)
    state.parameters[idx] = parameter
}

export const deleteParameter = (state, id) => {
    state.parameters = state.parameters.filter(e => e.id !== id)
}