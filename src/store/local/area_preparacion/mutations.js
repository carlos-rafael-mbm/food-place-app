export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setPreparationAreas = (state, preparation_areas) => {
    state.preparation_areas = [...preparation_areas]
}

export const addPreparationArea = (state, preparation_area) => {
    state.preparation_areas = [...state.preparation_areas, preparation_area]
}

export const updatePreparationArea = (state, preparation_area) => {
    const idx = state.preparation_areas.map(e => e.id).indexOf(preparation_area.id)
    state.preparation_areas[idx] = preparation_area
}

export const deletePreparationArea = (state, id) => {
    state.preparation_areas = state.preparation_areas.filter(e => e.id !== id)
}

export const setPreparationAreasDetail = (state, preparation_areas_detail) => {
    state.preparation_areas_detail = [...preparation_areas_detail]
}

export const addPreparationAreaDetail = (state, preparation_area_detail) => {
    state.preparation_areas_detail = [...state.preparation_areas_detail, preparation_area_detail]
}

export const deletePreparationAreaDetail = (state, id) => {
    state.preparation_areas_detail = state.preparation_areas_detail.filter(e => e.id !== id)
}