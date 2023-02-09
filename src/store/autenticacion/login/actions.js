import {foodplaceApi} from "@/api/foodplaceApi"

export const signInUser = async({commit}, usuario) => {
    const { username, password } = usuario
    try {
        const { data } = await foodplaceApi.get('/login', {
            auth: {
                'username': username,
                'password': password
            }
        })
        const { user, token } = data
        commit('loginUser', { user, token })
        return {
            'ok': true,
            'message': 'Logueado'
        }
    } catch (err) {
        return {
            'ok': false,
            'message': err.response.data.message
        }
    }
}

export const checkAuthentication = async({commit}) => {
    const token = localStorage.getItem('token')
    if (!token) {
        return { 'ok': false, 'message': 'No hay token' }
    }
    try {
        const formData = new FormData()
        formData.append('token', token)
        const { data } = await foodplaceApi.post('/check', formData)
        const { ok, message, user } = data
        if (ok == '1') {
            commit('loginUser', { user, token })
            return { 'ok': true, 'message': message, 'user': user }
        } else {
            commit('logoutUser')
            return { 'ok': false, 'message': message }
        }
    } catch (err) {
        commit('logoutUser')
        return { 'ok': false, 'message': err.response.data.message }
    }
}

export const logoutUser = async({commit}) => {
    commit('logoutUser')
}