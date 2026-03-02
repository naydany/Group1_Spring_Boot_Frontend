<template>
  <nav class="navbar navbar-expand-lg navbar-dark sticky-top shadow-sm" >
    <div class="container">

      <!-- Logo -->
      <router-link class="navbar-brand fw-bold" to="/">
        🌍 TourBooking
      </router-link>

      <!-- Mobile Toggle Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Menu Items -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto fs-4 ">

          <li class="nav-item">
            <router-link class="nav-link" to="/home">Home</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/tours">Tours</router-link>
          </li>

          <li class="nav-item">
            <router-link class="nav-link" to="/login">Login</router-link>
          </li>

          <li class="nav-item">
            <router-link class="btn btn-warning ms-3" to="/register">
              Register
            </router-link>
          </li>

        </ul>
      </div>

    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar{
    background: #427cd4;
}
.navbar .nav-link {
  transition: color 0.3s;
  color: white;
}

.navbar .nav-link:hover {
  color: #FFD700; /* Gold hover */
}

.navbar .btn-warning {
  transition: transform 0.3s;
}

.navbar .btn-warning:hover {
  transform: scale(1.05);
}
</style>
