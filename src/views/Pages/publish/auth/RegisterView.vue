<template>
  <div class="register-page d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow-lg p-4" style="max-width: 450px; width: 100%;">
      <h3 class="text-center mb-4">Create Your Account</h3>

      <form @submit.prevent="handleRegister">

        <!-- Name -->
        <div class="mb-3">
          <label class="form-label">Full Name</label>
          <input
            type="text"
            class="form-control"
            v-model="form.name"
            placeholder="Enter your full name"
            required
          />
        </div>

        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            v-model="form.email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input
            type="password"
            class="form-control"
            v-model="form.password"
            placeholder="Enter password"
            required
          />
        </div>

        <!-- Confirm Password -->
        <div class="mb-3">
          <label class="form-label">Confirm Password</label>
          <input
            type="password"
            class="form-control"
            v-model="form.confirmPassword"
            placeholder="Confirm password"
            required
          />
        </div>

        <!-- Error Message -->
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>

        <!-- Submit Button -->
        <button type="submit" class="btn btn-primary w-100">Register</button>

        <!-- Login Link -->
        <p class="text-center mt-3">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')

const handleRegister = () => {
  error.value = ''

  // Basic validation
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Passwords do not match!"
    return
  }

  if (form.value.password.length < 6) {
    error.value = "Password must be at least 6 characters!"
    return
  }

  // Here you would call your API to register
  console.log('Register data:', form.value)
  alert('Registered successfully (mock)')
  
  // Reset form
  form.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}
</script>

<style scoped>
.register-page {
  background: url('https://source.unsplash.com/1600x900/?travel') no-repeat center center;
  background-size: cover;
}

.card {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
}
</style>
