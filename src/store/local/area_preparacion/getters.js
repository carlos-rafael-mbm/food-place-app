export const getPreparationAreaById = (state) => (id = '') => {
    const preparation_area = state.preparation_areas.find(m => m.id === id)
    if (!preparation_area) return
    return {...preparation_area}
}

export const getPreparationAreasInOrder = (state) => () => {
    const preparation_area = state.preparation_areas
    if (!preparation_area) return
    preparation_area.sort((a, b) => {
        const x = a.name.toLowerCase()
        const y = b.name.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...preparation_area]
}

export const getActivePreparationAreas = (state) => () => {
    const preparation_areas = state.preparation_areas.filter(p => p.state == 1)
    if (!preparation_areas) return
    preparation_areas.sort((a, b) => {
        const x = a.name.toLowerCase()
        const y = b.name.toLowerCase()
        if (x < y) return -1
        if (x > y) return 1
        return 0
    })
    return [...preparation_areas]
}