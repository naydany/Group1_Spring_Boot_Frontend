<template>
  <div class="card">
    <div class="top">
      <h2>Booking History</h2>
      <input class="search" v-model="q" placeholder="Search booking..." />
    </div>

    <div class="table">
      <div class="thead">
        <div>ID</div>
        <div>User</div>
        <div>Service</div>
        <div>Date</div>
        <div>Status</div>
      </div>

      <div class="trow" v-for="b in filtered" :key="b.id">
        <div>#{{ b.id }}</div>
        <div>{{ b.user }}</div>
        <div>{{ b.service }}</div>
        <div>{{ b.date }}</div>
        <div>
          <span class="badge">{{ b.status }}</span>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty">No results</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

const q = ref("");
const bookings = ref([
  {
    id: 201,
    user: "SIN SOPANHA",
    service: "City Tour",
    date: "2026-03-02",
    status: "COMPLETED",
  },
  {
    id: 202,
    user: "SOPANHA2",
    service: "Temple Tour",
    date: "2026-03-10",
    status: "PENDING",
  },
]);

const filtered = computed(() => {
  const s = q.value.trim().toLowerCase();
  if (!s) return bookings.value;
  return bookings.value.filter((b) =>
    `${b.id} ${b.user} ${b.service} ${b.date} ${b.status}`
      .toLowerCase()
      .includes(s),
  );
});
</script>

<style scoped>
.card {
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.top {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
h2 {
  margin: 0;
}
.search {
  max-width: 260px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  color: #e8ecff;
}
.table {
  display: grid;
  gap: 8px;
}
.thead,
.trow {
  display: grid;
  grid-template-columns: 90px 1fr 1fr 160px 140px;
  gap: 10px;
  align-items: center;
}
.thead {
  font-weight: 800;
  color: rgba(10, 12, 20, 0.877);
  font-size: 16px;
}
.trow {
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.badge {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.06);
  font-size: 12px;
  font-weight: 800;
}
.empty {
  padding: 16px;
  text-align: center;
  color: rgba(232, 236, 255, 0.6);
}
@media (max-width: 900px) {
  .thead,
  .trow {
    grid-template-columns: 90px 1fr;
  }
  .thead div:nth-child(3),
  .thead div:nth-child(4),
  .thead div:nth-child(5),
  .trow div:nth-child(3),
  .trow div:nth-child(4),
  .trow div:nth-child(5) {
    display: none;
  }
}
</style>
