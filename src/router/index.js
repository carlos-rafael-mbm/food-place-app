import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import atencionRouter from "@/modules/atencion/router"
import administracionRouter from "@/modules/administracion/router"
import cocinaRouter from "@/modules/cocina/router"
import cajaRouter from "@/modules/caja/router";
import authRouter from "@/modules/autenticacion/router"
import almacenRouter from "@/modules/almacen/router";
import {isAuthenticatedGuard, isAuthenticatedAdmin, isAuthenticatedWaiter, isAuthenticatedCook} from '@/modules/autenticacion/router/auth-guard'

const routes = [
  {
    path: '/',
    beforeEnter: [isAuthenticatedGuard],
    name: 'home',
    component: HomeView
  },
  {
    path: '/atencion',
    beforeEnter: [isAuthenticatedWaiter],
    ...atencionRouter
  },
  {
    path: '/administracion',
    beforeEnter: [isAuthenticatedAdmin],
    ...administracionRouter
  },
  {
    path: '/cocina',
    beforeEnter: [isAuthenticatedCook],
    ...cocinaRouter
  },
  {
    path: '/caja',
    beforeEnter: [isAuthenticatedWaiter],
    ...cajaRouter
  },
  {
    path: '/almacen',
    beforeEnter: [isAuthenticatedAdmin],
    ...almacenRouter
  },
  {
    path: '/auth',
    ...authRouter
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
