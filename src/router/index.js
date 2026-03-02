import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Pages/publish/HomeView.vue";
import PublishLayout from "@/components/layouts/PublishLayout.vue";
import RegisterView from "@/views/Pages/publish/auth/RegisterView.vue";
import AuthLogin from "@/views/Pages/publish/auth/AuthLogin.vue";
import DashboardHome from "@/views/Pages/dashboard/DashboardHome.vue";
import UserLayout from "@/components/layouts/UserLayout.vue";
import AdminLayout from "@/components/layouts/AdminLayout.vue";

const routes = [
  // ✅ LOGIN at "/"
  {
    path: "/",
    name: "Login",
    component: AuthLogin,
  },

  // ✅ PUBLIC HOME at "/home"
  {
    path: "/home",
    component: PublishLayout,
    children: [
      {
        path: "", // ✅ must exist
        name: "Home",
        component: HomeView,
      },
    ],
  },

  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },

  {
    path: "/dashboard/home",
    name: "DashboardHome",
    component: DashboardHome,
  },

  // ✅ USER ROUTES
  {
    path: "/user",
    component: UserLayout,
    meta: { requiresAuth: true, role: "USER" },
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/user/UserDashboard.vue"),
      },
      {
        path: "service-booking",
        component: () => import("@/views/user/ServiceBooking.vue"),
      },
      {
        path: "history",
        component: () => import("@/views/user/MyBookingHistory.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/user/UserProfile.vue"),
      },
    ],
  },

  // ✅ ADMIN ROUTES (INCLUDING POSTS)
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true, role: "ADMIN" },
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/admin/AdminDashboard.vue"),
      },
      {
        path: "users",
        component: () => import("@/views/admin/UserManagement.vue"),
      },
      {
        path: "bookings",
        component: () => import("@/views/admin/BookingHistory.vue"),
      },
      {
        path: "profile",
        component: () => import("@/views/admin/AdminProfile.vue"),
      },

      // ✅ posts inside admin layout
      {
        path: "posts",
        component: () => import("@/views/admin/PostManagement.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
