// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/layouts/default/Default.vue'),
        children: [
            {
                path: '',
                name: 'Home',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
            },
            {
                path: '/diceRoom',
                name: 'DiceRoom',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                props: (route: any) => ({ query: route.query.roomId }),
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/Game.vue'),
            },
            {
                path: '/xoRoom',
                name: 'XoRoom',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                props: (route: any) => ({ query: route.query.roomId }),
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/XoRoom.vue'),
            },
            {
                path: '/test',
                name: 'Test',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/Test.vue'),
            },
            {
                path: '/xoLobby',
                name: 'XoLobby',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(
                        /* webpackChunkName: "home" */ '@/views/XoLobby.vue'
                    ),
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
