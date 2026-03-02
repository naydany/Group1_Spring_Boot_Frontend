<template>
  <div class="wrap">
    <aside class="side admin">
      <h2 class="logo">ADMIN PANEL</h2>

      <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
      <RouterLink to="/admin/users">User Management</RouterLink>
      <RouterLink to="/admin/posts">Posts Management</RouterLink>
      <RouterLink to="/admin/bookings">Booking History</RouterLink>
      <RouterLink to="/admin/profile">Profile</RouterLink>

      <button @click="logout">Logout</button>
    </aside>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  router.push("/login");
}
</script>

<style scoped>
.wrap {
  display: grid;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
}
.side {
  background: #0f172a;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.side.admin {
  background: #7c2d12;
}
.side a {
  color: white;
  text-decoration: none;
}
.side a.router-link-active {
  font-weight: bold;
}
button {
  margin-top: auto;
}
.content {
  padding: 20px;
}
</style>
