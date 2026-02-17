import { createRouter, createWebHistory } from "vue-router"
import Home from "../views/Home.vue"

const routes = [
    {
        path: "/home",
        name: "Home",
        component: () => import("../views/Home.vue")
    }
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})
export default router