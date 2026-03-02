<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="kicker">Admin</div>
        <h1 class="h1">Dashboard</h1>
        <p class="sub">Manage users + bookings (demo CRUD)</p>
      </div>

      <div class="headerActions">
        <input
          v-model.trim="q"
          class="input"
          placeholder="Search users/bookings..."
        />
        <button class="btnPrimary" type="button" @click="openUserCreate">
          + New User
        </button>
        <button class="btn" type="button" @click="openBookingCreate">
          + New Booking
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats">
      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Total Users</div>
          <div class="pill">All</div>
        </div>
        <div class="statValue">{{ totalUsers }}</div>
        <div class="statHint">Registered accounts</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Total Bookings</div>
          <div class="pill pillBlue">All</div>
        </div>
        <div class="statValue">{{ totalBookings }}</div>
        <div class="statHint">All bookings</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Pending Bookings</div>
          <div class="pill pillOrange">Wait</div>
        </div>
        <div class="statValue">{{ pendingBookings }}</div>
        <div class="statHint">Need review</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Admins</div>
          <div class="pill pillGreen">Role</div>
        </div>
        <div class="statValue">{{ adminCount }}</div>
        <div class="statHint">Role: ADMIN</div>
      </div>
    </div>

    <!-- Content -->
    <div class="grid">
      <!-- Users CRUD -->
      <div class="card">
        <div class="cardTop">
          <div>
            <h2 class="h2">User Management</h2>
            <p class="muted">Create / Edit / Delete (demo)</p>
          </div>

          <select v-model="roleFilter" class="select">
            <option value="">All roles</option>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div class="table small">
          <div class="thead users">
            <div>ID</div>
            <div>Username</div>
            <div>Role</div>
            <div class="actionsCol">Actions</div>
          </div>

          <div class="trow users" v-for="u in filteredUsers" :key="u.id">
            <div class="mono">#{{ u.id }}</div>
            <div>{{ u.username }}</div>
            <div>
              <span
                class="badge"
                :class="u.role === 'ADMIN' ? 'bGreen' : 'bBlue'"
              >
                {{ u.role }}
              </span>
            </div>
            <div class="actions">
              <button class="btn" @click="openUserEdit(u)">Edit</button>
              <button class="btn danger" @click="removeUser(u.id)">
                Delete
              </button>
            </div>
          </div>

          <div v-if="filteredUsers.length === 0" class="empty">
            No users found.
          </div>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="card">
        <div class="cardTop">
          <div>
            <h2 class="h2">Recent Activity</h2>
            <p class="muted">Demo</p>
          </div>
        </div>

        <div class="activity">
          <div class="activityItem" v-for="(a, i) in activity" :key="i">
            <div class="dot"></div>
            <div class="activityText">{{ a }}</div>
          </div>
        </div>
      </div>

      <!-- Bookings table -->
      <div class="card span2">
        <div class="cardTop">
          <div>
            <h2 class="h2">Booking History</h2>
            <p class="muted">Manage bookings (demo CRUD)</p>
          </div>

          <div class="right">
            <select v-model="statusFilter" class="select">
              <option value="">All status</option>
              <option value="PENDING">PENDING</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div class="table">
          <div class="thead bookings">
            <div>ID</div>
            <div>User</div>
            <div>Service</div>
            <div>Date</div>
            <div>Status</div>
            <div class="actionsCol">Actions</div>
          </div>

          <div class="trow bookings" v-for="b in filteredBookings" :key="b.id">
            <div class="mono">#{{ b.id }}</div>
            <div>{{ b.username }}</div>
            <div>{{ b.service }}</div>
            <div class="mono">{{ b.date }}</div>
            <div>
              <span class="badge" :class="badgeClass(b.status)">{{
                b.status
              }}</span>
            </div>
            <div class="actions">
              <button class="btn" @click="openBookingEdit(b)">Edit</button>
              <button class="btn danger" @click="removeBooking(b.id)">
                Delete
              </button>
            </div>
          </div>

          <div v-if="filteredBookings.length === 0" class="empty">
            No bookings found.
          </div>
        </div>
      </div>
    </div>

    <!-- USER Modal -->
    <div
      v-if="userModal.open"
      class="modalOverlay"
      @click.self="closeUserModal"
    >
      <div class="modal">
        <div class="modalHead">
          <div>
            <div class="kicker">User</div>
            <div class="modalTitle">
              {{ userModal.mode === "create" ? "Create user" : "Edit user" }}
            </div>
          </div>
          <button class="iconBtn" @click="closeUserModal">✕</button>
        </div>

        <form class="form" @submit.prevent="saveUserModal">
          <div class="field">
            <label>Username</label>
            <input
              v-model.trim="userModal.form.username"
              class="input"
              placeholder="username"
              required
            />
          </div>

          <div class="field">
            <label>Role</label>
            <select v-model="userModal.form.role" class="select">
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="modalActions">
            <button type="button" class="btn" @click="closeUserModal">
              Cancel
            </button>
            <button type="submit" class="btnPrimary">
              {{ userModal.mode === "create" ? "Create" : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- BOOKING Modal -->
    <div
      v-if="bookingModal.open"
      class="modalOverlay"
      @click.self="closeBookingModal"
    >
      <div class="modal">
        <div class="modalHead">
          <div>
            <div class="kicker">Booking</div>
            <div class="modalTitle">
              {{
                bookingModal.mode === "create"
                  ? "Create booking"
                  : "Edit booking"
              }}
            </div>
          </div>
          <button class="iconBtn" @click="closeBookingModal">✕</button>
        </div>

        <form class="form" @submit.prevent="saveBookingModal">
          <div class="field">
            <label>User</label>
            <select v-model="bookingModal.form.username" class="select">
              <option v-for="u in users" :key="u.id" :value="u.username">
                {{ u.username }}
              </option>
            </select>
          </div>

          <div class="field">
            <label>Service</label>
            <select v-model="bookingModal.form.service" class="select">
              <option value="City Tour">City Tour</option>
              <option value="Temple Tour">Temple Tour</option>
              <option value="Beach Trip">Beach Trip</option>
              <option value="Food Tour">Food Tour</option>
            </select>
          </div>

          <div class="field">
            <label>Date</label>
            <input
              v-model="bookingModal.form.date"
              class="input"
              type="date"
              required
            />
          </div>

          <div class="field">
            <label>Status</label>
            <select v-model="bookingModal.form.status" class="select">
              <option value="PENDING">PENDING</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div class="modalActions">
            <button type="button" class="btn" @click="closeBookingModal">
              Cancel
            </button>
            <button type="submit" class="btnPrimary">
              {{ bookingModal.mode === "create" ? "Create" : "Save" }}
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
type BookingStatus = "PENDING" | "UPCOMING" | "COMPLETED" | "CANCELLED";

type User = { id: number; username: string; role: Role };
type Booking = {
  id: number;
  username: string;
  service: string;
  date: string;
  status: BookingStatus;
};

const q = ref("");
const roleFilter = ref<"" | Role>("");
const statusFilter = ref<"" | BookingStatus>("");

const users = ref<User[]>([
  { id: 1, username: "ADMIN", role: "ADMIN" },
  { id: 2, username: "SIN SOPANHA", role: "USER" },
  { id: 3, username: "SOPANHA2", role: "ADMIN" },
]);

const bookings = ref<Booking[]>([
  {
    id: 201,
    username: "SIN SOPANHA",
    service: "City Tour",
    date: "2026-03-03",
    status: "COMPLETED",
  },
  {
    id: 202,
    username: "SIN SOPANHA",
    service: "Temple Tour",
    date: "2026-03-10",
    status: "UPCOMING",
  },
  {
    id: 203,
    username: "SOPANHA2",
    service: "Food Tour",
    date: "2026-03-15",
    status: "PENDING",
  },
]);

const activity = ref<string[]>([
  "✅ Admin login success",
  "👤 Viewed users",
  "🧾 Checked booking history",
]);

const totalUsers = computed(() => users.value.length);
const adminCount = computed(
  () => users.value.filter((u) => u.role === "ADMIN").length,
);

const totalBookings = computed(() => bookings.value.length);
const pendingBookings = computed(
  () => bookings.value.filter((b) => b.status === "PENDING").length,
);

const filteredUsers = computed(() => {
  const s = q.value.trim().toLowerCase();
  return users.value.filter((u) => {
    const matchText =
      !s || `${u.id} ${u.username} ${u.role}`.toLowerCase().includes(s);
    const matchRole = !roleFilter.value || u.role === roleFilter.value;
    return matchText && matchRole;
  });
});

const filteredBookings = computed(() => {
  const s = q.value.trim().toLowerCase();
  return bookings.value.filter((b) => {
    const matchText =
      !s ||
      `${b.id} ${b.username} ${b.service} ${b.date} ${b.status}`
        .toLowerCase()
        .includes(s);
    const matchStatus = !statusFilter.value || b.status === statusFilter.value;
    return matchText && matchStatus;
  });
});

function badgeClass(status: BookingStatus) {
  return {
    PENDING: "bOrange",
    UPCOMING: "bBlue",
    COMPLETED: "bGreen",
    CANCELLED: "bRed",
  }[status];
}

/* ---------------- USER CRUD ---------------- */
const userModal = reactive({
  open: false,
  mode: "create" as "create" | "edit",
  editingId: null as number | null,
  form: { username: "", role: "USER" as Role },
});

function openUserCreate() {
  userModal.open = true;
  userModal.mode = "create";
  userModal.editingId = null;
  userModal.form = { username: "", role: "USER" };
}
function openUserEdit(u: User) {
  userModal.open = true;
  userModal.mode = "edit";
  userModal.editingId = u.id;
  userModal.form = { username: u.username, role: u.role };
}
function closeUserModal() {
  userModal.open = false;
}
function saveUserModal() {
  const name = userModal.form.username.trim();
  if (!name) return;

  if (userModal.mode === "create") {
    const newId = Math.max(0, ...users.value.map((x) => x.id)) + 1;
    users.value.unshift({
      id: newId,
      username: name,
      role: userModal.form.role,
    });
    activity.value.unshift(`➕ Created user #${newId} (${name})`);
  } else {
    const idx = users.value.findIndex((u) => u.id === userModal.editingId);
    if (idx >= 0) {
      users.value[idx] = {
        id: users.value[idx].id,
        username: name,
        role: userModal.form.role,
      };
      activity.value.unshift(
        `✏️ Updated user #${users.value[idx].id} (${name})`,
      );
    }
  }
  closeUserModal();
}
function removeUser(id: number) {
  const u = users.value.find((x) => x.id === id);
  users.value = users.value.filter((x) => x.id !== id);
  activity.value.unshift(
    `🗑 Deleted user #${id}${u ? ` (${u.username})` : ""}`,
  );
}

/* ---------------- BOOKING CRUD ---------------- */
const bookingModal = reactive({
  open: false,
  mode: "create" as "create" | "edit",
  editingId: null as number | null,
  form: {
    username: "SIN SOPANHA",
    service: "City Tour",
    date: "",
    status: "PENDING" as BookingStatus,
  },
});

function openBookingCreate() {
  bookingModal.open = true;
  bookingModal.mode = "create";
  bookingModal.editingId = null;
  bookingModal.form = {
    username: users.value[0]?.username || "SIN SOPANHA",
    service: "City Tour",
    date: "",
    status: "PENDING",
  };
}
function openBookingEdit(b: Booking) {
  bookingModal.open = true;
  bookingModal.mode = "edit";
  bookingModal.editingId = b.id;
  bookingModal.form = {
    username: b.username,
    service: b.service,
    date: b.date,
    status: b.status,
  };
}
function closeBookingModal() {
  bookingModal.open = false;
}
function saveBookingModal() {
  if (!bookingModal.form.date) return;

  if (bookingModal.mode === "create") {
    const newId = Math.max(0, ...bookings.value.map((x) => x.id)) + 1;
    bookings.value.unshift({
      id: newId,
      username: bookingModal.form.username,
      service: bookingModal.form.service,
      date: bookingModal.form.date,
      status: bookingModal.form.status,
    });
    activity.value.unshift(
      `➕ Created booking #${newId} (${bookingModal.form.username})`,
    );
  } else {
    const idx = bookings.value.findIndex(
      (b) => b.id === bookingModal.editingId,
    );
    if (idx >= 0) {
      bookings.value[idx] = {
        id: bookings.value[idx].id,
        ...bookingModal.form,
      };
      activity.value.unshift(`✏️ Updated booking #${bookings.value[idx].id}`);
    }
  }
  closeBookingModal();
}
function removeBooking(id: number) {
  const b = bookings.value.find((x) => x.id === id);
  bookings.value = bookings.value.filter((x) => x.id !== id);
  activity.value.unshift(
    `🗑 Deleted booking #${id}${b ? ` (${b.service})` : ""}`,
  );
}
</script>

<style scoped>
.page {
  --primary: #427cd4;
  color: #e8ecff;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}
.kicker {
  font-size: 12px;
  color: rgba(8, 12, 29, 0.822);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.h1 {
  margin: 6px 0 4px;
  font-size: 22px;
  font-weight: 900;
  color: #000;
}
.sub {
  margin: 0;
  color: rgba(9, 12, 24, 0.7);
  font-size: 13px;
}
.headerActions {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}
.statCard {
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.statTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}
.statLabel {
  font-weight: 800;
  color: rgba(2, 4, 12, 0.925);
  font-size: 13px;
}
.statValue {
  font-size: 28px;
  font-weight: 900;
  margin-top: 10px;
  color: rgba(66, 124, 212, 0.95);
}
.statHint {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(4, 7, 20, 0.87);
}

.pill {
  font-size: 12px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: black;
}
.pillBlue {
  border-color: rgba(66, 124, 212, 0.5);
  background: rgba(66, 124, 212, 0.16);
}
.pillGreen {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.16);
}
.pillOrange {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.16);
}

.grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 12px;
}
.card {
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.span2 {
  grid-column: span 2;
}

.cardTop {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
}
.h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
}
.muted {
  margin: 4px 0 0;
  color: rgba(8, 11, 22, 0.856);
  font-size: 13px;
}

.table {
  display: grid;
  gap: 8px;
}
.table.small {
  max-height: 420px;
  overflow: auto;
  padding-right: 2px;
}
.thead,
.trow {
  display: grid;
  gap: 10px;
  align-items: center;
}
.thead {
  font-weight: 900;
  color: rgba(9, 10, 15, 0.836);
  font-size: 14px;
}
.trow {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.actionsCol {
  text-align: left;
}
.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.mono {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

/* grid templates */
.thead.users,
.trow.users {
  grid-template-columns: 90px 1fr 140px 210px;
}
.thead.bookings,
.trow.bookings {
  grid-template-columns: 90px 1fr 1fr 160px 140px 210px;
}

.badge {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
}
.bBlue {
  border-color: rgba(66, 124, 212, 0.5);
  background: rgba(66, 124, 212, 0.16);
}
.bGreen {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.16);
}
.bOrange {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.16);
}
.bRed {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.16);
}

.empty {
  padding: 16px;
  text-align: center;
  color: rgba(232, 236, 255, 0.6);
}

.activity {
  display: grid;
  gap: 10px;
}
.activityItem {
  display: grid;
  grid-template-columns: 10px 1fr;
  gap: 10px;
  align-items: center;
  padding: 10px 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(66, 124, 212, 0.85);
}
.activityText {
  color: rgba(2, 3, 5, 0.9);
  font-size: 13px;
}

/* inputs/buttons */
.input,
.select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #020203;
  outline: none;
}
.input:focus,
.select:focus {
  border-color: rgba(66, 124, 212, 0.7);
  box-shadow: 0 0 0 4px rgba(66, 124, 212, 0.18);
}
.btn,
.btnPrimary,
.iconBtn {
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #0a2780;
}
.btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.btnPrimary {
  border-color: rgba(66, 124, 212, 0.6);
  background: rgba(66, 124, 212, 0.95);
  color: #071225;
}
.btnPrimary:hover {
  filter: brightness(1.03);
}
.danger {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.14);
}
.iconBtn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
}

/* modal */
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 14px;
  z-index: 50;
}
.modal {
  width: min(520px, 100%);
  border-radius: 18px;
  background: rgba(12, 18, 40, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.45);
  padding: 14px;
}
.modalHead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}
.modalTitle {
  font-size: 18px;
  font-weight: 900;
  margin-top: 6px;
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
  color: rgba(19, 22, 39, 0.877);
  font-weight: 800;
}
.modalActions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
}

@media (max-width: 980px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid {
    grid-template-columns: 1fr;
  }
  .span2 {
    grid-column: span 1;
  }
  .thead.bookings,
  .trow.bookings {
    grid-template-columns: 90px 1fr 140px;
  }
  .thead.bookings div:nth-child(3),
  .thead.bookings div:nth-child(4),
  .thead.bookings div:nth-child(5),
  .thead.bookings div:nth-child(6),
  .trow.bookings div:nth-child(3),
  .trow.bookings div:nth-child(4),
  .trow.bookings div:nth-child(5),
  .trow.bookings div:nth-child(6) {
    display: none;
  }
  .thead.users,
  .trow.users {
    grid-template-columns: 90px 1fr;
  }
  .thead.users div:nth-child(3),
  .thead.users div:nth-child(4),
  .trow.users div:nth-child(3),
  .trow.users div:nth-child(4) {
    display: none;
  }
}
</style>
