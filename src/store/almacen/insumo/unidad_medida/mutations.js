export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setMeasurementUnits = (state, measurement_units) => {
    state.measurement_units = [...measurement_units]
}

export const addMeasurementUnit = (state, unidad_medida) => {
    state.measurement_units = [...state.measurement_units, unidad_medida]
}

export const updateMeasurementUnit = (state, unidad_medida) => {
    const idx = state.measurement_units.map(e => e.id).indexOf(unidad_medida.id)
    state.measurement_units[idx] = unidad_medida
}

export const deleteMeasurementUnit = (state, id) => {
    state.measurement_units = state.measurement_units.filter(e => e.id !== id)
}