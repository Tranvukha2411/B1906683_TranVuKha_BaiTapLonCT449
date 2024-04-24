import {createWebHistory, createRouter} from "vue-router";
import Welcome from "@/views/Welcome.vue";



const routes = [
    {
        path: "/",
        name: "welcome",
        component: Welcome
    },
    {
        path: "/:pathMach(.*)*",
        name: "notfound",
        component: () => import("@/views/NotFound.vue"),
    },

    {
        path: "/manager",
        name: "manager",
        component: () => import("@/views/Manager.vue"),
        props: (route) => ({ userID: route.query.userID })
    },
    
    {
        path:"/home/:id",
        name:"home",
        component: () => import("@/views/Home.vue"),
        props: true
    },
    
    {
        path: "/home/:id/cart",
        name: "cart",
        component: () => import("@/views/Cart.vue"),
        props: true
    },

    {
        path: "/home/:productId/edit",
        name: "editor",
        component: () => import("@/views/Editor.vue"),
        props: true
    },
    {
        path: '/manager/invoice/',
        name: 'invoice',
        component: () => import('@/views/InvoiceProcessing.vue'),
    },

    {
        path: '/manager/product/',
        name: 'productManager',
        component: () => import('@/views/ProductManager.vue'),
        props: (route) => ({ userID: route.query.userID })
    },
    
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
export default router;