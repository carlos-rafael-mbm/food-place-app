export const getPromotionById = (state) => (id = '') => {
    const promotion = state.promotions.find(m => m.id === id)
    if (!promotion) return
    return {...promotion}
}