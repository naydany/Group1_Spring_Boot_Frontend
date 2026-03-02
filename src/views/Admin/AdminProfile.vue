<template>
  <div class="card">
    <h2>Admin Profile</h2>
    <p class="muted">Admin information (demo).</p>

    <div class="box">
      <div class="row">
        <span>Username:</span><b>{{ user.username || "Unknown" }}</b>
      </div>
      <div class="row">
        <span>Role:</span><b>{{ role }}</b>
      </div>
    </div>

    <button class="btn" @click="msg = '✅ Saved (demo only)'">Save</button>
    <div v-if="msg" class="ok">{{ msg }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const msg = ref("");
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
  () => (Array.isArray(user?.role) ? user.role[0] : user?.role) || "ADMIN",
);
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
  color: rgba(12, 12, 17, 0.808);
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
.btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  background: rgba(99, 102, 241, 0.25);
  color: #06070c;
}
.ok {
  margin-top: 12px;
  color: rgba(99, 102, 241, 0.75);
  font-weight: 800;
}
</style>
