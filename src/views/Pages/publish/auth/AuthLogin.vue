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
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com"
            :class="{ invalid: !!errors.email }"
            @blur="validateEmail"
          />
          <small v-if="errors.email" class="error">{{ errors.email }}</small>
        </div>

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
          <label class="check">
            <input type="checkbox" v-model="form.remember" />
            <span>Remember me</span>
          </label>

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

// If you want real API calls, install axios and uncomment:
// import axios from "axios";

const form = reactive({
  email: "",
  password: "",
  remember: true,
});

const showPassword = ref(false);
const loading = ref(false);
const serverError = ref("");

const errors = reactive<{ email?: string; password?: string }>({});

function validateEmail() {
  const v = form.email.trim();
  if (!v) return (errors.email = "Email is required.");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  errors.email = ok ? "" : "Enter a valid email address.";
}

function validatePassword() {
  const v = form.password;
  if (!v) return (errors.password = "Password is required.");
  if (v.length < 8)
    return (errors.password = "Password must be at least 8 characters.");
  errors.password = "";
}

const canSubmit = computed(() => {
  // lightweight checks so button isn't always disabled while typing
  return form.email.length > 3 && form.password.length >= 8;
});

async function onSubmit() {
  serverError.value = "";
  validateEmail();
  validatePassword();
  if (errors.email || errors.password) return;

  loading.value = true;
  try {
    // --- OPTION A: mock login (remove in production) ---
    await new Promise((r) => setTimeout(r, 800));
    if (
      form.email.toLowerCase() !== "demo@example.com" ||
      form.password !== "password123"
    ) {
      throw new Error("Invalid email or password.");
    }

    // --- OPTION B: real API login (example) ---
    // const res = await axios.post("/api/auth/login", {
    //   email: form.email,
    //   password: form.password,
    //   remember: form.remember,
    // });
    // console.log("Logged in:", res.data);

    // Example: redirect (use vue-router if available)
    // router.push("/dashboard");
    alert("Login success ✅ (demo credentials accepted)");
  } catch (e: any) {
    serverError.value = e?.message || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}

function onForgot() {
  alert("Forgot password clicked (hook this to your flow).");
}
function onRegister() {
  alert("Register clicked (route to /register).");
}
function onGoogle() {
  alert("Google sign-in clicked (integrate OAuth).");
}
</script>

<style scoped>
/* Layout */
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center; /* vertical center */
  justify-content: center; /* horizontal center */
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

.logo {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: linear-gradient(
    135deg,
    rgba(99, 102, 241, 0.9),
    rgba(16, 185, 129, 0.85)
  );
  color: white;
  font-weight: 900;
}

h1 {
  text-align: center;
  color: White;
  font-size: 22px;
  margin: 0;
  letter-spacing: 0.2px;
}

.header p {
  margin: 4px 0 0;
  color: rgba(232, 236, 255, 0.75);
  font-size: 14px;
}

/* Form */
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
  padding: 12px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecff;
  outline: none;
  transition:
    border-color 150ms ease,
    box-shadow 150ms ease;
}

input::placeholder {
  color: rgba(232, 236, 255, 0.35);
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

/* Password row */
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

/* Row */
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

.check input {
  width: 16px;
  height: 16px;
  padding: 0;
}

.link {
  color: rgba(167, 180, 255, 0.95);
  text-decoration: none;
  font-size: 13px;
}

.link:hover {
  text-decoration: underline;
}

/* Buttons */
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

/* Divider */
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

/* Server error */
.serverError {
  background: rgba(239, 68, 68, 0.14);
  border: 1px solid rgba(239, 68, 68, 0.28);
  color: rgba(255, 210, 210, 0.98);
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
}

/* Spinner */
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

/* Side panel */
.side {
  display: none;
}

.sideInner {
  margin: auto;
  max-width: 520px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.sideInner h2 {
  margin: 0 0 10px;
  font-size: 22px;
}

.sideInner p {
  margin: 0 0 14px;
  color: rgba(232, 236, 255, 0.75);
}

.sideInner ul {
  margin: 0;
  padding-left: 18px;
  color: rgba(232, 236, 255, 0.85);
}

/* Footer */
.footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  color: rgba(232, 236, 255, 0.75);
  font-size: 13px;
}

/* Responsive */
@media (min-width: 920px) {
  .side {
    display: grid;
  }
}

@media (max-width: 520px) {
  .auth {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  .card {
    padding: 18px;
  }
  .passwordRow {
    flex-direction: column;
    align-items: stretch;
  }
  .ghost {
    width: 100%;
  }
}
</style>
