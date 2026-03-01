import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Pages/publish/HomeView.vue";
import PublishLayout from "@/components/layouts/PublishLayout.vue";
import RegisterView from "@/views/Pages/publish/auth/RegisterView.vue";
import AuthLogin from "@/views/Pages/publish/auth/AuthLogin.vue";
const routes = [
  {
    path: "/login",
    name: "Login",
    component: AuthLogin,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },
  {
    path: "/",
    component: PublishLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: HomeView,
      },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
