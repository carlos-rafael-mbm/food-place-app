import store from '@/store'

export const isAuthenticatedGuard = async(to, from, next) => {
    const {ok} = await store.dispatch('login/checkAuthentication')
    if (ok) next()
    else next({name: 'login'})
}

export const isAuthenticatedAdmin = async(to, from, next) => {
    // Guard para ingreso solo de administradores
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedWaiter = async(to, from, next) => {
    // Guard para ingreso de administradores(1) y mozos(2)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 2) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedCashier = async(to, from, next) => {
    // Guard para ingreso de administradores(1) y cajeros(4)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 4) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}

export const isAuthenticatedCook = async(to, from, next) => {
    // Guard para ingreso de administradores(1), cocineros(3) y asistentes de cocina(5)
    const {ok, user} = await store.dispatch('login/checkAuthentication')
    if (ok) {
        if (user.role.id == 1 || user.role.id == 3 || user.role.id == 5) next()
        else next({name: 'home'})
    } else next({name: 'login'})
}