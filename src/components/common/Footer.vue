<template>
  <footer class="footer text-white pt-5 pb-3 mt-5">
    <div class="container">

      <div class="row">

        <!-- Logo & Description -->
        <div class="col-md-4 mb-4">
          <h5 class="fw-bold">🌍 TourBooking</h5>
          <p>Book your dream tour easily and safely with us.</p>
        </div>

        <!-- Quick Links -->
        <div class="col-md-4 mb-4">
          <h5 class="fw-bold">Quick Links</h5>
          <ul class="list-unstyled">
            <li><router-link class="text-white text-decoration-none" to="/">Home</router-link></li>
            <li><router-link class="text-white text-decoration-none" to="/tours">Tours</router-link></li>
            <li><router-link class="text-white text-decoration-none" to="/login">Login</router-link></li>
            <li><router-link class="text-white text-decoration-none" to="/register">Register</router-link></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="col-md-4 mb-4">
          <h5 class="fw-bold">Contact Us</h5>
          <p>Email: info@tourbooking.com</p>
          <p>Phone: +1 234 567 890</p>
          <div>
            <a href="#" class="text-white me-2">📘</a>
            <a href="#" class="text-white me-2">🐦</a>
            <a href="#" class="text-white">📸</a>
          </div>
        </div>

      </div>

      <hr class="border-top border-light" />

      <div class="text-center mt-3">
        &copy; 2026 TourBooking. All rights reserved.
      </div>

    </div>
  </footer>
</template>

<script setup>

</script>
<style scoped>
.footer{
    background: #427cd4;
}
</style>
