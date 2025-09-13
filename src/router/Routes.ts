const basePath = ''

export const CarViewRoute = {
  path: `${basePath}/cars`,
  name: 'cars',
  component: () => import('@/view/CarView.vue'),
}

export const NotFoundViewRoute = {
  path: '/:pathMatch(.*)*',
  name: 'notFound',
  component: () => import('@/view/NotFoundView.vue'),
}
