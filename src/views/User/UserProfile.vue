<template>
  <div class="card">
    <h2>Profile</h2>
    <p class="muted">View / update your info (demo).</p>

    <div class="box">
      <div class="row">
        <span>Username:</span><b>{{ user.username || "Unknown" }}</b>
      </div>
      <div class="row">
        <span>Role:</span><b>{{ role }}</b>
      </div>
    </div>

    <form class="form" @submit.prevent="save">
      <div class="row2">
        <label>Full Name</label>
        <input class="value" v-model="fullName" placeholder="Your full name" />
      </div>
      <div class="row2">
        <label>Phone</label>
        <input class="value" v-model="phone" placeholder="Phone number" />
      </div>

      <button class="btn" type="submit">Save</button>
      <div v-if="msg" class="ok">{{ msg }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const user = (() => {
  try {
    return JSON.parse(
      localStorage.getItem("user") || sessionStorage.getItem("user") || "{}",
    );
  } catch {
    return {};
  }
})();

const role = computed(
  () => (Array.isArray(user?.role) ? user.role[0] : user?.role) || "USER",
);

const fullName = ref("");
const phone = ref("");
const msg = ref("");

function save() {
  msg.value = "✅ Saved (demo only)";
}
</script>

<style scoped>
.card {
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
h2 {
  margin: 0 0 8px;
}
.muted {
  margin: 0 0 14px;
  color: rgba(10, 15, 39, 0.897);
  font-size: 13px;
}
.box {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}
.row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}
.form {
  display: grid;
  gap: 12px;
  max-width: 520px;
}
.row2 {
  display: grid;
  gap: 6px;
}
label {
  font-size: 15px;
  color: rgba(6, 9, 22, 0.85);
}
input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecff;
}
.btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  background: rgba(4, 6, 83, 0.25);
  color: #090b18;
}
.ok {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.25);
}
.value {
  color: rgb(20, 11, 11);
}
</style>
