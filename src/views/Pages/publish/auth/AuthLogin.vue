<template>
  <div class="auth">
    <div class="card">
      <header class="header">
        <div class="brand">
          <div>
            <h1>LOGIN</h1>
          </div>
        </div>
      </header>

      <form class="form" @submit.prevent="onSubmit" novalidate>
        <!-- ✅ Username -->
        <div class="field">
          <label for="username">Username</label>
          <input
            id="username"
            v-model.trim="form.username"
            type="text"
            autocomplete="username"
            placeholder="Enter username"
            :class="{ invalid: !!errors.username }"
            @blur="validateUsername"
          />
          <small v-if="errors.username" class="error">{{
            errors.username
          }}</small>
        </div>

        <!-- Password -->
        <div class="field">
          <label for="password">Password</label>
          <div class="passwordRow">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :class="{ invalid: !!errors.password }"
              @blur="validatePassword"
            />
            <button
              type="button"
              class="ghost"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              {{ showPassword ? "Hide" : "Show" }}
            </button>
          </div>
          <small v-if="errors.password" class="error">{{
            errors.password
          }}</small>
        </div>

        <div class="row">

          <a class="link" href="#" @click.prevent="onForgot"
            >Forgot password?</a
          >
        </div>

        <div v-if="serverError" class="serverError" role="alert">
          {{ serverError }}
        </div>

        <button class="primary" type="submit" :disabled="loading || !canSubmit">
          <span v-if="loading" class="spinner" aria-hidden="true"></span>
          <span>{{ loading ? "Signing in..." : "Sign in" }}</span>
        </button>

        <div class="divider">
          <span>or</span>
        </div>

        <button
          class="secondary"
          type="button"
          @click="onGoogle"
          :disabled="loading"
        >
          Continue with Google
        </button>

        <footer class="footer">
          <span>New here?</span>
          <a class="link" href="#" @click.prevent="onRegister"
            >Create an account</a
          >
        </footer>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const form = reactive({
  username: "",
  password: "",
  remember: true,
});

const showPassword = ref(false);
const loading = ref(false);
const serverError = ref("");

const errors = reactive<{ username?: string; password?: string }>({});

function validateUsername() {
  const v = form.username.trim();
  if (!v) return (errors.username = "Username is required.");
  errors.username = "";
}

function validatePassword() {
  const v = form.password;
  if (!v) return (errors.password = "Password is required.");
  // example password is "12345" => allow 5+
  if (v.length < 5)
    return (errors.password = "Password must be at least 5 characters.");
  errors.password = "";
}

const canSubmit = computed(() => {
  return form.username.trim().length > 0 && form.password.length >= 5;
});

async function onSubmit() {
  serverError.value = "";
  validateUsername();
  validatePassword();
  if (errors.username || errors.password) return;

  loading.value = true;

  try {
    const res = await axios.post("http://localhost:9090/auth/login", {
      username: form.username,
      password: form.password,
    });

    // Token key depends on your backend. These cover common cases.
    const token =
      res.data?.token ||
      res.data?.accessToken ||
      res.data?.jwt ||
      res.data?.data?.token ||
      res.data?.data?.accessToken ||
      res.data?.data?.jwt;

    const user = res.data?.user || res.data?.data?.user || null;

    if (!token) {
      console.log("Login response:", res.data);
      throw new Error(
        "Token not found in response. Check backend token field name.",
      );
    }

    // Remember me => localStorage, else sessionStorage
    if (form.remember) {
      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("token", token);
      if (user) sessionStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    await router.push("/");
  } catch (e: any) {
    serverError.value =
      e?.response?.data?.message ||
      e?.message ||
      "Login failed. Please try again.";
  } finally {
    loading.value = false;
  }
}

function onForgot() {
  alert("Forgot password clicked (hook this to your flow).");
}
function onRegister() {
  router.push("/register");
}
function onGoogle() {
  alert("Google sign-in clicked (integrate OAuth).");
}
</script>

<style scoped>
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background:
    radial-gradient(
      900px 600px at 20% 10%,
      rgba(99, 102, 241, 0.18),
      transparent 60%
    ),
    radial-gradient(
      700px 500px at 85% 30%,
      rgba(16, 185, 129, 0.14),
      transparent 55%
    ),
    #0b1020;
  color: #e8ecff;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    Segoe UI,
    Roboto,
    Arial,
    "Apple Color Emoji",
    "Segoe UI Emoji";
}

.card {
  max-width: 520px;
  width: 100%;
  margin: auto;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
  border-radius: 18px;
  backdrop-filter: blur(10px);
  padding: 22px;
}

.header {
  margin-bottom: 14px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

h1 {
  text-align: center;
  color: white;
  font-size: 22px;
  margin: 0;
  letter-spacing: 0.2px;
}

.form {
  display: grid;
  gap: 14px;
}

.field {
  display: grid;
  gap: 8px;
}

label {
  font-size: 13px;
  color: rgba(232, 236, 255, 0.85);
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecff;
  outline: none;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

input:focus {
  border-color: rgba(99, 102, 241, 0.8);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
}

.invalid {
  border-color: rgba(239, 68, 68, 0.8) !important;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12) !important;
}

.error {
  color: rgba(239, 68, 68, 0.95);
  font-size: 12px;
}

.passwordRow {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ghost {
  height: 42px;
  padding: 0 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(232, 236, 255, 0.9);
  cursor: pointer;
}

.ghost:hover {
  background: rgba(255, 255, 255, 0.08);
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.check {
  display: flex;
  gap: 8px;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-size: 13px;
  color: rgba(232, 236, 255, 0.85);
}

.link {
  color: rgba(167, 180, 255, 0.95);
  text-decoration: none;
  font-size: 13px;
}

.link:hover {
  text-decoration: underline;
}

.primary,
.secondary {
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
}

.primary {
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.95),
    rgba(16, 185, 129, 0.9)
  );
  color: #0b1020;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e8ecff;
  border: 1px solid rgba(255, 255, 255, 0.14);
}

.secondary:hover {
  background: rgba(255, 255, 255, 0.12);
}

.divider {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;
  margin: 2px 0;
  color: rgba(232, 236, 255, 0.55);
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: "";
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
}

.serverError {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.28);
  color: rgba(255, 210, 210, 0.98);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(11, 16, 32, 0.25);
  border-top-color: rgba(11, 16, 32, 0.85);
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  color: rgba(232, 236, 255, 0.75);
  font-size: 13px;
}
</style>
