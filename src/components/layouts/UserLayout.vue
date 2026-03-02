<template>
  <div class="wrap">
    <aside class="side">
      <h2 class="logo">USER PANEL</h2>

      <RouterLink to="/user/dashboard">Dashboard</RouterLink>
      <RouterLink to="/user/service-booking">Service Booking</RouterLink>
      <RouterLink to="/user/history">My Booking History</RouterLink>
      <RouterLink to="/user/profile">Profile</RouterLink>

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
  background: #1e293b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
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
