export const getMeasurementUnitById = (state) => (id = '') => {
    const measurement_unit = state.measurement_units.find(measurement_unit => measurement_unit.id === id)
    if (!measurement_unit) return
    return {...measurement_unit}
}