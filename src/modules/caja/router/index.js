import {isAuthenticatedWaiter} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'caja',
    component: () => import(/* webpackChunkName: "caja" */ '@/modules/caja/layouts/CajaLayout.vue'),
    children: [
        {
            path: '/caja',
            name: 'caja-principal',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "caja-principal" */ '@/modules/caja/views/CajaView.vue')
        },
        {
            path: '/caja/apertura',
            name: 'caja-beginning-view',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "caja-beginning-view" */ '@/modules/caja/views/apertura/AperturaView.vue')
        },
        // {
        //     path: '/atencion/pedidos',
        //     name: 'atencion-order-view',
        //     beforeEnter: [isAuthenticatedWaiter],
        //     component: () => import(/* webpackChunkName: "atencion-order-view" */ '@/modules/atencion/views/pedido/PedidoView.vue')
        // },
        // {
        //     path: '/atencion/cobro',
        //     name: 'atencion-cobro-view',
        //     beforeEnter: [isAuthenticatedWaiter],
        //     component: () => import(/* webpackChunkName: "atencion-cobro-view" */ '@/modules/atencion/views/pedido/PedidoCobroView.vue')
        // }
    ]
}