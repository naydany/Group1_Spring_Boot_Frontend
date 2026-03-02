<template>
  <div class="card">
    <div class="top">
      <div>
        <h2>Posts</h2>
        <p class="sub">JWT Protected CRUD</p>
      </div>

      <div class="right">
        <button class="btnPrimary" @click="openCreate">+ New</button>
        <button class="btn" @click="fetchPosts" :disabled="loading">
          {{ loading ? "Loading..." : "Refresh" }}
        </button>
      </div>
    </div>

    <div v-if="error" class="errorBox">{{ error }}</div>

    <div class="table">
      <div class="thead">
        <div>ID</div>
        <div>Title</div>
        <div>Location</div>
        <div>Created By</div>
        <div>Action</div>
      </div>

      <div class="trow" v-for="p in posts" :key="p.id">
        <div class="mono">#{{ p.id }}</div>
        <div class="text">{{ p.title }}</div>
        <div class="text">{{ p.location }}</div>
        <div class="text">{{ p.createdBy || "-" }}</div>

        <div class="actions">
          <button class="btn" @click="viewById(p.id)">View</button>
          <button class="btn edit" @click="openEdit(p)">Edit</button>
          <button class="btn remove" @click="removePost(p.id)">Delete</button>
        </div>
      </div>

      <div v-if="!loading && posts.length === 0" class="empty">No posts</div>
    </div>

    <!-- View by id -->
    <div v-if="selected" class="viewCard">
      <div class="viewTop">
        <div>
          <div class="kicker">Selected Post</div>
          <div class="viewTitle">{{ selected.title }}</div>
          <div class="sub">{{ selected.location }}</div>
        </div>
        <button class="btn" @click="selected = null">Close</button>
      </div>

      <div class="viewGrid">
        <div><b>ID:</b> {{ selected.id }}</div>
        <div><b>Created By:</b> {{ selected.createdBy }}</div>
        <div><b>Description:</b> {{ selected.description }}</div>
        <div><b>Image:</b> {{ selected.image }}</div>
        <div><b>Created At:</b> {{ selected.createdAt }}</div>
        <div><b>Updated At:</b> {{ selected.updatedAt }}</div>
      </div>
    </div>

    <!-- Modal create/edit -->
    <div v-if="modal.open" class="modalOverlay" @click.self="closeModal">
      <div class="modal">
        <div class="modalHead">
          <div>
            <div class="kicker">Post</div>
            <div class="modalTitle">
              {{ modal.mode === "create" ? "Create Post" : "Edit Post" }}
            </div>
          </div>
          <button class="iconBtn" @click="closeModal">✕</button>
        </div>

        <form class="form" @submit.prevent="savePost">
          <div class="field">
            <label>Title</label>
            <input v-model.trim="modal.form.title" class="input" required />
          </div>

          <div class="field">
            <label>Description</label>
            <input
              v-model.trim="modal.form.description"
              class="input"
              required
            />
          </div>

          <div class="field">
            <label>Image URL</label>
            <input v-model.trim="modal.form.image" class="input" required />
          </div>

          <div class="field">
            <label>Location</label>
            <input v-model.trim="modal.form.location" class="input" required />
          </div>

          <div class="modalActions">
            <button type="button" class="btn" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btnPrimary" :disabled="saving">
              {{
                saving
                  ? "Saving..."
                  : modal.mode === "create"
                    ? "Create"
                    : "Save"
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePostById,
} from "@/api/postApi";

const posts = ref([]);
const selected = ref(null);
const loading = ref(false);
const saving = ref(false);
const error = ref("");

const modal = reactive({
  open: false,
  mode: "create", // "create" | "edit"
  editingId: null,
  form: {
    title: "",
    description: "",
    image: "",
    location: "",
  },
});

function openCreate() {
  modal.open = true;
  modal.mode = "create";
  modal.editingId = null;
  modal.form = { title: "", description: "", image: "", location: "" };
}

function openEdit(p) {
  modal.open = true;
  modal.mode = "edit";
  modal.editingId = p.id;
  modal.form = {
    title: p.title || "",
    description: p.description || "",
    image: p.image || "",
    location: p.location || "",
  };
}

function closeModal() {
  modal.open = false;
}

async function fetchPosts() {
  error.value = "";
  loading.value = true;
  try {
    // ✅ GET /post/getAll
    posts.value = await getAllPosts();
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Failed to load posts (check token / backend).";
  } finally {
    loading.value = false;
  }
}

async function viewById(id) {
  error.value = "";
  try {
    // ✅ GET /post/getById/:id
    const p = await getPostById(id);
    selected.value = p;
    if (!p) error.value = "Post not found.";
  } catch (e) {
    error.value =
      e?.response?.data?.message || e?.message || "Failed to load post by id.";
  }
}

async function savePost() {
  error.value = "";
  saving.value = true;
  try {
    const payload = { ...modal.form };

    if (modal.mode === "create") {
      // ✅ POST /post/createPost
      await createPost(payload);
    } else {
      // ✅ PUT /post/updatePost/:id
      await updatePost(modal.editingId, payload);
    }

    closeModal();
    await fetchPosts();
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Save failed (check token / backend).";
  } finally {
    saving.value = false;
  }
}

async function removePost(id) {
  const ok = confirm(`Delete post #${id}?`);
  if (!ok) return;

  error.value = "";
  try {
    // ✅ DELETE /post/deleteById/:id
    await deletePostById(id);
    await fetchPosts();
  } catch (e) {
    error.value =
      e?.response?.data?.message ||
      e?.message ||
      "Delete failed (check token / backend).";
  }
}

onMounted(fetchPosts);
</script>

<style scoped>
.card {
  --primary: #427cd4;
  border-radius: 18px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #111;
}
.top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
h2 {
  margin: 0;
  font-weight: 900;
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

.table {
  display: grid;
  gap: 8px;
}
.thead,
.trow {
  display: grid;
  grid-template-columns: 90px 1.5fr 1fr 1fr 280px;
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
  border: 1px solid #eef2f7;
  background: #fff;
}
.text {
  color: #111;
}
.mono {
  font-family: ui-monospace, Menlo, monospace;
  color: rgba(17, 17, 17, 0.7);
}

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
  background: #427cd4;
  border-color: rgba(66, 124, 212, 0.55);
  color: #fff;
}
.edit {
  background: rgba(66, 124, 212, 0.12);
  border-color: rgba(66, 124, 212, 0.35);
  color: #0a3a86;
}
.remove {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.35);
  color: #9a0b0b;
}

.errorBox {
  margin: 10px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #9a0b0b;
}
.empty {
  padding: 16px;
  text-align: center;
  color: rgba(17, 17, 17, 0.55);
}

/* modal */
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
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.2);
  padding: 14px;
}
.modalHead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 10px;
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
}
.iconBtn {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
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
  font-weight: 900;
  color: rgba(17, 17, 17, 0.75);
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

/* view */
.viewCard {
  margin-top: 12px;
  border-radius: 18px;
  padding: 14px;
  border: 1px solid #eef2f7;
  background: #fff;
}
.viewTop {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: flex-start;
}
.viewTitle {
  font-size: 18px;
  font-weight: 900;
  margin-top: 6px;
}
.viewGrid {
  margin-top: 10px;
  display: grid;
  gap: 8px;
  color: rgba(17, 17, 17, 0.85);
}

@media (max-width: 900px) {
  .thead,
  .trow {
    grid-template-columns: 90px 1fr 220px;
  }
  .thead div:nth-child(3),
  .thead div:nth-child(4),
  .trow div:nth-child(3),
  .trow div:nth-child(4) {
    display: none;
  }
}
</style>
