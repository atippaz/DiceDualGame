// Composables
import {
    NavigationGuardNext,
    RouteLocationNormalized,
    createRouter,
    createWebHistory,
} from 'vue-router'

const checkTokenMiddleware = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const token = localStorage.getItem('userToken')
    if (!token) {
        next({ name: 'Login' }) // ถ้าไม่มี Token, ส่งผู้ใช้ไปหน้า Login
    } else {
        next()
    }
}
const isLogin = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) => {
    const token = localStorage.getItem('userToken')
    if (token) {
        next({ name: 'Home' }) // ถ้าไม่มี Token, ส่งผู้ใช้ไปหน้า Login
    } else {
        next()
    }
}
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
                beforeEnter: checkTokenMiddleware,
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
                beforeEnter: checkTokenMiddleware,
            },

        ],
    },
    {
        path: '/',
        component: () => import('@/layouts/default/ClearLayout.vue'),
        children: [
            {
                path: '/xoRoom',
                name: 'XoRoom',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                props: (route: any) => ({ query: route.query.roomId }),
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/XoRoom.vue'),
                beforeEnter: checkTokenMiddleware,
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
                path: '/register',
                name: 'Register',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(
                        /* webpackChunkName: "home" */ '@/views/Register.vue'
                    ),
                beforeEnter: isLogin,
            },
            {
                path: '/login',
                name: 'Login',
                // route level code-splitting
                // this generates a separate chunk (about.[hash].js) for this route
                // which is lazy-loaded when the route is visited.
                component: () =>
                    import(/* webpackChunkName: "home" */ '@/views/Login.vue'),
                beforeEnter: isLogin,
            },
        ],
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
