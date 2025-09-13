import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import * as Routes from './Routes.ts'
import { CarViewRoute, NotFoundViewRoute } from './Routes.ts'

function buildRouter() {
  const routes: RouteRecordRaw[] = [...Object.values(Routes)].sort((a, b): number => {
    return a.path.length < b.path.length ? 1 : -1
  })

  const router = createRouter({
    history: createWebHistory(),
    routes: [...routes],
  })

  router.beforeEach((to) => {
    if (to.name === NotFoundViewRoute.name) {
      return { name: CarViewRoute.name }
    }
  })

  return router
}

export { buildRouter as createRouter }
