<template>
  <div class="card">
    <div class="top">
      <div>
        <h2>User Management</h2>
        <p class="sub">Create / Edit / Delete users (demo CRUD)</p>
      </div>

      <div class="right">
        <input class="search" v-model="q" placeholder="Search user..." />
        <button class="btnPrimary" @click="openCreate">+ New User</button>
      </div>
    </div>

    <div class="table">
      <div class="thead">
        <div>ID</div>
        <div>Username</div>
        <div>Role</div>
        <div>Action</div>
      </div>

      <div class="trow" v-for="u in filtered" :key="u.id">
        <div class="mono">#{{ u.id }}</div>
        <div class="text">{{ u.username }}</div>
        <div>
          <span class="badge" :class="u.role === 'ADMIN' ? 'bAdmin' : 'bUser'">
            {{ u.role }}
          </span>
        </div>

        <div class="actions">
          <button class="btn edit" @click="openEdit(u)">Edit</button>
          <button class="btn remove" @click="removeUser(u.id)">Delete</button>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty">No results</div>
    </div>

    <!-- Modal -->
    <div v-if="modal.open" class="modalOverlay" @click.self="closeModal">
      <div class="modal">
        <div class="modalHead">
          <div>
            <div class="kicker">User</div>
            <div class="modalTitle">
              {{ modal.mode === "create" ? "Create user" : "Edit user" }}
            </div>
          </div>
          <button class="iconBtn" @click="closeModal">✕</button>
        </div>

        <form class="form" @submit.prevent="saveUser">
          <div class="field">
            <label>Username</label>
            <input
              v-model.trim="modal.form.username"
              class="input"
              placeholder="Enter username"
              required
            />
          </div>

          <div class="field">
            <label>Role</label>
            <select v-model="modal.form.role" class="input">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="modalActions">
            <button type="button" class="btn" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btnPrimary">
              {{ modal.mode === "create" ? "Create" : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";

type Role = "USER" | "ADMIN";
type User = { id: number; username: string; role: Role };

const q = ref("");
const users = ref<User[]>([
  { id: 1, username: "ADMIN", role: "ADMIN" },
  { id: 2, username: "SIN SOPANHA", role: "USER" },
  { id: 3, username: "SOPANHA2", role: "ADMIN" },
]);

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return users.value;
  return users.value.filter((u) =>
    `${u.id} ${u.username} ${u.role}`.toLowerCase().includes(s),
  );
});

const modal = reactive({
  open: false,
  mode: "create" as "create" | "edit",
  editingId: null as number | null,
  form: {
    username: "",
    role: "USER" as Role,
  },
});

function openCreate() {
  modal.open = true;
  modal.mode = "create";
  modal.editingId = null;
  modal.form = { username: "", role: "USER" };
}

function openEdit(u: User) {
  modal.open = true;
  modal.mode = "edit";
  modal.editingId = u.id;
  modal.form = { username: u.username, role: u.role };
}

function closeModal() {
  modal.open = false;
}

function saveUser() {
  const name = modal.form.username.trim();
  if (!name) return;

  // prevent duplicate username
  const exists = users.value.some(
    (u) =>
      u.username.toLowerCase() === name.toLowerCase() &&
      u.id !== modal.editingId,
  );
  if (exists) {
    alert("Username already exists.");
    return;
  }

  if (modal.mode === "create") {
    const newId = Math.max(0, ...users.value.map((x) => x.id)) + 1;
    users.value.unshift({ id: newId, username: name, role: modal.form.role });
  } else {
    const idx = users.value.findIndex((u) => u.id === modal.editingId);
    if (idx >= 0) {
      users.value[idx] = {
        id: users.value[idx].id,
        username: name,
        role: modal.form.role,
      };
    }
  }

  closeModal();
}

function removeUser(id: number) {
  const u = users.value.find((x) => x.id === id);
  if (!u) return;

  const ok = confirm(`Delete user "${u.username}" ?`);
  if (!ok) return;

  users.value = users.value.filter((x) => x.id !== id);
}
</script>

<style scoped>
/* Theme */
.card {
  --primary: #427cd4;
  border-radius: 18px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #111;
}

/* Header */
.top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}
h2 {
  margin: 0;
  font-weight: 900;
  color: #111;
}
.sub {
  margin: 6px 0 0;
  color: rgba(17, 17, 17, 0.65);
  font-size: 13px;
}
.right {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

/* Search */
.search {
  max-width: 260px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111;
  outline: none;
}
.search:focus {
  border-color: rgba(66, 124, 212, 0.8);
  box-shadow: 0 0 0 4px rgba(66, 124, 212, 0.15);
}

/* Table */
.table {
  display: grid;
  gap: 8px;
}
.thead,
.trow {
  display: grid;
  grid-template-columns: 90px 1fr 140px 240px;
  gap: 10px;
  align-items: center;
}
.thead {
  font-weight: 900;
  color: #427cd4;
  font-size: 13px;
}
.trow {
  padding: 12px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid #eef2f7;
}
.text {
  color: #111;
}

.mono {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  color: rgba(17, 17, 17, 0.75);
}

/* Badge */
.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid #e5e7eb;
}
.bAdmin {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #0f5132;
}
.bUser {
  background: rgba(66, 124, 212, 0.12);
  border-color: rgba(66, 124, 212, 0.35);
  color: #0a3a86;
}

/* Buttons */
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn,
.btnPrimary,
.iconBtn {
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 900;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111;
}
.btn:hover {
  background: #eef2f7;
}

.btnPrimary {
  border-color: rgba(66, 124, 212, 0.55);
  background: #427cd4;
  color: #fff;
}
.btnPrimary:hover {
  filter: brightness(1.03);
}

.edit {
  border-color: rgba(66, 124, 212, 0.35);
  background: rgba(66, 124, 212, 0.12);
  color: #0a3a86;
}
.remove {
  border-color: rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.12);
  color: #9a0b0b;
}

.empty {
  padding: 16px;
  text-align: center;
  color: rgba(17, 17, 17, 0.55);
}

/* Modal */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  padding: 14px;
  z-index: 50;
}
.modal {
  width: min(520px, 100%);
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
  padding: 14px;
}
.modalHead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}
.kicker {
  font-size: 12px;
  color: rgba(17, 17, 17, 0.55);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.modalTitle {
  font-size: 18px;
  font-weight: 900;
  margin-top: 6px;
  color: #111;
}

.form {
  display: grid;
  gap: 12px;
}
.field {
  display: grid;
  gap: 6px;
}
label {
  font-size: 12px;
  color: rgba(17, 17, 17, 0.75);
  font-weight: 900;
}
.input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #111;
  outline: none;
}
.input:focus {
  border-color: rgba(66, 124, 212, 0.8);
  box-shadow: 0 0 0 4px rgba(66, 124, 212, 0.15);
}
.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}
.iconBtn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
}

/* Responsive */
@media (max-width: 800px) {
  .thead,
  .trow {
    grid-template-columns: 90px 1fr;
  }
  .thead div:nth-child(3),
  .thead div:nth-child(4),
  .trow div:nth-child(3),
  .trow div:nth-child(4) {
    display: none;
  }
}
</style>
