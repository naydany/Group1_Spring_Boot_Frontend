<template>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="kicker">User</div>
        <h1 class="h1">Dashboard</h1>
        <p class="sub">Overview + manage your bookings (demo CRUD)</p>
      </div>

      <div class="headerActions">
        <input
          v-model.trim="q"
          class="input"
          placeholder="Search bookings..."
        />
        <button class="btnPrimary" type="button" @click="openCreate">
          + New Booking
        </button>
      </div>
    </div>

    <!-- Stat cards -->
    <div class="stats">
      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Total Bookings</div>
          <div class="pill">All</div>
        </div>
        <div class="statValue">{{ total }}</div>
        <div class="statHint">All time</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Upcoming</div>
          <div class="pill pillBlue">Soon</div>
        </div>
        <div class="statValue">{{ upcoming }}</div>
        <div class="statHint">Status: UPCOMING</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Completed</div>
          <div class="pill pillGreen">Done</div>
        </div>
        <div class="statValue">{{ completed }}</div>
        <div class="statHint">Status: COMPLETED</div>
      </div>

      <div class="statCard">
        <div class="statTop">
          <div class="statLabel">Pending</div>
          <div class="pill pillOrange">Wait</div>
        </div>
        <div class="statValue">{{ pending }}</div>
        <div class="statHint">Status: PENDING</div>
      </div>
    </div>

    <!-- Content grid -->
    <div class="grid">
      <!-- Mini chart -->
      <div class="card">
        <div class="cardTop">
          <div>
            <h2 class="h2">Monthly Overview</h2>
            <p class="muted">Demo chart (last 6 months)</p>
          </div>
          <div class="chip">Bookings</div>
        </div>

        <div class="bars">
          <div
            v-for="m in monthly"
            :key="m.label"
            class="barItem"
            :title="`${m.label}: ${m.value}`"
          >
            <div class="barWrap">
              <div class="bar" :style="{ height: barHeight(m.value) }"></div>
            </div>
            <div class="barLabel">{{ m.label }}</div>
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
            <h2 class="h2">My Booking History</h2>
            <p class="muted">Create / Edit / Delete (demo CRUD)</p>
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
          <div class="thead">
            <div>ID</div>
            <div>Service</div>
            <div>Date</div>
            <div>People</div>
            <div>Status</div>
            <div class="actionsCol">Actions</div>
          </div>

          <div class="trow" v-for="b in filtered" :key="b.id">
            <div class="mono">#{{ b.id }}</div>
            <div>{{ b.service }}</div>
            <div class="mono">{{ b.date }}</div>
            <div class="mono">{{ b.people }}</div>
            <div>
              <span class="badge" :class="badgeClass(b.status)">{{
                b.status
              }}</span>
            </div>
            <div class="actions">
              <button class="btn" @click="openEdit(b)">Edit</button>
              <button class="btn danger" @click="removeBooking(b.id)">
                Delete
              </button>
            </div>
          </div>

          <div v-if="filtered.length === 0" class="empty">
            No bookings found.
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal.open" class="modalOverlay" @click.self="closeModal">
      <div class="modal">
        <div class="modalHead">
          <div>
            <div class="kicker">Booking</div>
            <div class="modalTitle">
              {{ modal.mode === "create" ? "Create booking" : "Edit booking" }}
            </div>
          </div>
          <button class="iconBtn" @click="closeModal">✕</button>
        </div>

        <form class="form" @submit.prevent="saveModal">
          <div class="field">
            <label>Service</label>
            <select v-model="modal.form.service" class="select">
              <option value="City Tour">City Tour</option>
              <option value="Temple Tour">Temple Tour</option>
              <option value="Beach Trip">Beach Trip</option>
              <option value="Food Tour">Food Tour</option>
            </select>
          </div>

          <div class="field">
            <label>Date</label>
            <input
              v-model="modal.form.date"
              class="input"
              type="date"
              required
            />
          </div>

          <div class="field">
            <label>People</label>
            <input
              v-model.number="modal.form.people"
              class="input"
              type="number"
              min="1"
              required
            />
          </div>

          <div class="field">
            <label>Status</label>
            <select v-model="modal.form.status" class="select">
              <option value="PENDING">PENDING</option>
              <option value="UPCOMING">UPCOMING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
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

type BookingStatus = "PENDING" | "UPCOMING" | "COMPLETED" | "CANCELLED";
type Booking = {
  id: number;
  service: string;
  date: string;
  people: number;
  status: BookingStatus;
};

const PRIMARY = "#427CD4"; // your color

const q = ref("");
const statusFilter = ref<"" | BookingStatus>("");

const bookings = ref<Booking[]>([
  {
    id: 101,
    service: "City Tour",
    date: "2026-03-03",
    people: 2,
    status: "COMPLETED",
  },
  {
    id: 102,
    service: "Temple Tour",
    date: "2026-03-10",
    people: 3,
    status: "UPCOMING",
  },
  {
    id: 103,
    service: "Beach Trip",
    date: "2026-03-14",
    people: 1,
    status: "PENDING",
  },
  {
    id: 104,
    service: "Food Tour",
    date: "2026-03-20",
    people: 4,
    status: "CANCELLED",
  },
]);

const monthly = ref([
  { label: "Oct", value: 3 },
  { label: "Nov", value: 5 },
  { label: "Dec", value: 4 },
  { label: "Jan", value: 6 },
  { label: "Feb", value: 2 },
  { label: "Mar", value: 7 },
]);

const activity = ref([
  "✅ Login success",
  "🧾 Viewed booking history",
  "📌 Updated profile",
  "➕ Created a booking (demo)",
]);

const total = computed(() => bookings.value.length);
const upcoming = computed(
  () => bookings.value.filter((b) => b.status === "UPCOMING").length,
);
const completed = computed(
  () => bookings.value.filter((b) => b.status === "COMPLETED").length,
);
const pending = computed(
  () => bookings.value.filter((b) => b.status === "PENDING").length,
);

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  return bookings.value.filter((b) => {
    const matchText =
      !s ||
      `${b.id} ${b.service} ${b.date} ${b.people} ${b.status}`
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

function barHeight(v: number) {
  const max = Math.max(...monthly.value.map((m) => m.value)) || 1;
  const pct = Math.round((v / max) * 100);
  return `${Math.max(10, pct)}%`;
}

// --- CRUD modal ---
const modal = reactive({
  open: false,
  mode: "create" as "create" | "edit",
  editingId: null as number | null,
  form: {
    service: "City Tour",
    date: "2026-03-05",
    people: 1,
    status: "PENDING" as BookingStatus,
  },
});

function openCreate() {
  modal.open = true;
  modal.mode = "create";
  modal.editingId = null;
  modal.form = {
    service: "City Tour",
    date: "",
    people: 1,
    status: "PENDING",
  };
}

function openEdit(b: Booking) {
  modal.open = true;
  modal.mode = "edit";
  modal.editingId = b.id;
  modal.form = {
    service: b.service,
    date: b.date,
    people: b.people,
    status: b.status,
  };
}

function closeModal() {
  modal.open = false;
}

function saveModal() {
  if (!modal.form.date) return;

  if (modal.mode === "create") {
    const newId = Math.max(0, ...bookings.value.map((x) => x.id)) + 1;
    bookings.value.unshift({
      id: newId,
      service: modal.form.service,
      date: modal.form.date,
      people: modal.form.people,
      status: modal.form.status,
    });
    activity.value.unshift(`➕ Created booking #${newId}`);
  } else {
    const idx = bookings.value.findIndex((b) => b.id === modal.editingId);
    if (idx >= 0) {
      bookings.value[idx] = {
        id: bookings.value[idx].id,
        service: modal.form.service,
        date: modal.form.date,
        people: modal.form.people,
        status: modal.form.status,
      };
      activity.value.unshift(`✏️ Updated booking #${bookings.value[idx].id}`);
    }
  }

  closeModal();
}

function removeBooking(id: number) {
  const b = bookings.value.find((x) => x.id === id);
  bookings.value = bookings.value.filter((x) => x.id !== id);
  activity.value.unshift(
    `🗑 Deleted booking #${id} ${b ? `(${b.service})` : ""}`.trim(),
  );
}
</script>

<style scoped>
:root {
  color-scheme: dark;
}

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
  color: rgba(17, 19, 29, 0.795);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.h1 {
  margin: 6px 0 4px;
  font-size: 22px;
  font-weight: 900;
  color: #071225;
}
.sub {
  margin: 0;
  color: rgba(232, 236, 255, 0.7);
  font-size: 13px;
}

.headerActions {
  display: flex;
  gap: 10px;
  align-items: center;
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
  color: rgb(5, 19, 92);
  font-size: 15px;
}
.statValue {
  font-size: 28px;
  font-weight: 900;
  margin-top: 10px;
  color: var(--primary);
}
.statHint {
  margin-top: 4px;
  font-size: 12px;
  color: rgba(6, 12, 44, 0.774);
}

.pill {
  font-size: 12px;
  font-weight: 800;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(13, 15, 24, 0.95);
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
  color: rgba(4, 5, 14, 0.767);
  font-size: 13px;
}
.chip {
  font-size: 12px;
  font-weight: 900;
  padding: 6px 10px;
  border-radius: 12px;
  border: 1px solid rgba(66, 124, 212, 0.5);
  background: rgba(66, 124, 212, 0.16);
  color: rgba(10, 14, 34, 0.95);
}

/* chart */
.bars {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  height: 160px;
}
.barItem {
  flex: 1;
  display: grid;
  gap: 8px;
  justify-items: center;
}
.barWrap {
  width: 100%;
  height: 120px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: flex-end;
  padding: 8px;
}
.bar {
  width: 100%;
  border-radius: 12px;
  background: rgba(66, 124, 212, 0.9);
  box-shadow: 0 10px 24px rgba(66, 124, 212, 0.18);
}
.barLabel {
  font-size: 12px;
  color: rgba(6, 12, 44, 0.842);
}

/* activity */
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
  color: rgba(12, 15, 26, 0.9);
  font-size: 13px;
}

/* table */
.table {
  display: grid;
  gap: 8px;
}
.thead,
.trow {
  display: grid;
  grid-template-columns: 90px 1fr 160px 110px 140px 170px;
  gap: 10px;
  align-items: center;
}
.thead {
  font-weight: 900;
  color: rgba(8, 8, 8, 0.87);
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
}
.mono {
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
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

/* inputs/buttons */
.input,
.select {
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecff;
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
  color: #e8ecff;
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
  color: rgba(232, 236, 255, 0.8);
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
  .thead,
  .trow {
    grid-template-columns: 90px 1fr 140px;
  }
  .thead div:nth-child(3),
  .thead div:nth-child(4),
  .thead div:nth-child(5),
  .thead div:nth-child(6),
  .trow div:nth-child(3),
  .trow div:nth-child(4),
  .trow div:nth-child(5),
  .trow div:nth-child(6) {
    display: none;
  }
}
</style>
