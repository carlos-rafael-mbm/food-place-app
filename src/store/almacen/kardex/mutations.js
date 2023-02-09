export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setKardexes = (state, kardexes) => {
    state.kardexes = [...kardexes]
}

export const setKardexesDetail = (state, kardexes_detail) => {
    state.kardexes_detail = [...kardexes_detail]
}

export const addKardex = (state, kardex) => {
    state.kardexes = [...state.kardexes, kardex]
}

export const addKardexDetail = (state, kardex_detail) => {
    state.kardexes_detail = [...state.kardexes_detail, kardex_detail]
}

export const updateKardex = (state, kardex) => {
    const idx = state.kardexes.map(e => e.id).indexOf(kardex.id)
    state.kardexes[idx] = kardex
}

export const updateKardexDetail = (state, kardex_detail) => {
    const idx = state.kardexes_detail.map(e => e.id).indexOf(kardex_detail.id)
    state.kardexes_detail[idx] = kardex_detail
}

export const deleteKardex = (state, id) => {
    state.kardexes = state.kardexes.filter(e => e.id !== id)
}

export const deleteKardexDetail = (state, id) => {
    state.kardexes_detail = state.kardexes_detail.filter(e => e.id !== id)
}