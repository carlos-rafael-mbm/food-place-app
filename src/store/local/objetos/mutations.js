export const setLoading = (state) => {
    state.isLoading = !state.isLoading
}

export const setObjectsPosition = (state, object_position) => {
    state.object_position = [...object_position]
}

export const addObjectPosition = (state, object_position) => {
    state.object_position = [...state.object_position, object_position]
}

export const deleteAllObjectsPosition = (state, dining_room_number) => {
    state.object_position = state.object_position.filter(e => e.dining_room_number !== dining_room_number)
}