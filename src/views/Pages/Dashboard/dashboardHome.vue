<template>
  <div class="grid">
    <div class="card">
      <div class="title">Quick Stats</div>
      <div class="big">24</div>
      <div class="muted">Total bookings (example)</div>
    </div>

    <div class="card">
      <div class="title">Upcoming</div>
      <div class="big">3</div>
      <div class="muted">Trips scheduled</div>
    </div>

    <div class="card span2">
      <div class="title">Activity</div>
      <div class="list">
        <div class="item">✅ Login success</div>
        <div class="item">🧾 Booking created</div>
        <div class="item">💳 Payment received</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.card {
  border-radius: 18px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.title {
  font-weight: 800;
  margin-bottom: 10px;
}
.big {
  font-size: 34px;
  font-weight: 900;
}
.muted {
  margin-top: 6px;
  color: rgba(232, 236, 255, 0.65);
  font-size: 13px;
}
.list {
  display: grid;
  gap: 8px;
}
.item {
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.span2 {
  grid-column: span 2;
}
@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .span2 {
    grid-column: span 1;
  }
}
</style>
