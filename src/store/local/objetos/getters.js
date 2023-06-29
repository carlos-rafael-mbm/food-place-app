export const getObjectPositionByDiningRoom = (state) => (diningRoomNumber = 0) => {
    const object_position = state.object_position.filter(p => p.dining_room_number == diningRoomNumber)
    if (!object_position) return
    return [...object_position]
}