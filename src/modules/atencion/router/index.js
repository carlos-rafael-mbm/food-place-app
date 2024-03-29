import {isAuthenticatedWaiter} from '@/modules/autenticacion/router/auth-guard';

export default {
    name: 'atencion',
    component: () => import(/* webpackChunkName: "atencion" */ '@/modules/atencion/layouts/AtencionLayout.vue'),
    children: [
        {
            path: '/atencion',
            name: 'atencion-principal',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "atencion-principal" */ '@/modules/atencion/views/AtencionView.vue')
        },
        {
            path: '/atencion/nuevo-pedido',
            name: 'atencion-nuevo-view',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "atencion-nuevo-view" */ '@/modules/atencion/views/nuevo-pedido/NuevoPedidoView.vue')
        },
        {
            path: '/atencion/impresion',
            name: 'atencion-order-to-print-view',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "atencion-order-to-print-view" */ '@/modules/atencion/views/pedido/PedidoImpresionView.vue')
        },
        {
            path: '/atencion/pedidos',
            name: 'atencion-order-view',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "atencion-order-view" */ '@/modules/atencion/views/pedido/PedidoView.vue')
        },
        {
            path: '/atencion/distribucion',
            name: 'atencion-distribucion-view',
            beforeEnter: [isAuthenticatedWaiter],
            component: () => import(/* webpackChunkName: "atencion-distribucion-view" */ '@/modules/atencion/views/mapa_local/MapaLocalView.vue')
        }
    ]
}