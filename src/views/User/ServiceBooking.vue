<template>
  <div class="card">
    <h2>Service Booking</h2>
    <p class="muted">Book a tour/service here (demo form).</p>

    <form class="form" @submit.prevent="submit">
      <div class="row">
        <label>Service</label>
        <select v-model="form.service">
          <option class="value" value="City Tour">City Tour</option>
          <option class="value" value="Temple Tour">Temple Tour</option>
          <option class="value" value="Beach Trip">Beach Trip</option>
        </select>
      </div>

      <div class="row">
        <label>Date</label>
        <input type="date" v-model="form.date" />
      </div>

      <div class="row">
        <label>People</label>
        <input type="number" min="1" v-model.number="form.people" />
      </div>

      <button class="btn" type="submit">Submit Booking</button>

      <div v-if="msg" class="ok">{{ msg }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const msg = ref("");
const form = reactive({
  service: "City Tour",
  date: "",
  people: 1,
});

function submit() {
  msg.value = `✅ Booking submitted: ${form.service}, ${form.date || "(no date)"}, ${form.people} people`;
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
  color: rgb(10, 10, 10);
  margin: 0 0 16px;
  font-size: 13px;
}
.form {
  display: grid;
  gap: 12px;
  max-width: 520px;
}
.row {
  display: grid;
  gap: 6px;
}
label {
  font-size: 13px;
  color: rgb(22, 22, 22);
}
input,
select {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid rgb(7, 4, 4);
  background: rgba(255, 255, 255, 0.06);
  color: #090a0f;
  outline: none;
}
.btn {
  padding: 10px 12px;
  border-radius: 12px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
  background: rgb(49, 50, 94);
  color: #e8ecff;
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
