// src/router/guard.js

function getToken() {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

function getRole() {
  return localStorage.getItem("role") || sessionStorage.getItem("role");
}

function redirectByRole(role) {
  if (String(role).toUpperCase() === "ADMIN") return "/admin/dashboard";
  return "/user/dashboard";
}

/**
 * Use in router like:
 * import applyGuards from "./guard";
 * applyGuards(router);
 */
export default function applyGuards(router) {
  router.beforeEach((to, from, next) => {
    const token = getToken();
    const role = getRole();

    // If already logged in, block going to login page "/"
    if (to.path === "/" && token) {
      return next(redirectByRole(role));
    }

    // If route needs auth but no token => go login
    if (to.meta?.requiresAuth && !token) {
      return next("/");
    }

    // If route has role requirement
    // Example: meta: { requiresAuth: true, role: "ADMIN" }
    if (to.meta?.role) {
      // If no role saved, force login
      if (!role) return next("/");

      const required = String(to.meta.role).toUpperCase();
      const current = String(role).toUpperCase();

      if (required !== current) {
        return next(redirectByRole(current));
      }
    }

    next();
  });
}
