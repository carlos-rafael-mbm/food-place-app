export default {
    name: 'auth',
    component: () => import(/* webpackChunkName: "autenticacion" */ '@/modules/autenticacion/layouts/AuthLayout.vue'),
    children: [
        {
            path: '',
            name: 'login',
            component: () => import(/* webpackChunkName: "autenticacion-login" */ '@/modules/autenticacion/views/LoginView.vue')
        },
    ]
}