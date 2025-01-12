<template>
  <div v-if="show" class="modal-overlay">
    <div class="card">
      <div class="card-content">
        <p class="card-heading">Save Changes?</p>
        <p class="card-description">
          You have unsaved changes. Do you want to save them before leaving?
        </p>
      </div>
      <div class="card-button-wrapper">
        <button class="card-button secondary" @click="$emit('cancel')">Don't Save</button>
        <button class="card-button primary" @click="$emit('confirm')">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}

.card-content {
  text-align: center;
  margin-bottom: 2rem;
}

.card-heading {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card-button-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.card-button {
  flex: 1;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.primary {
  background-color: #ff6b6b;
  color: white;
}

.secondary {
  background-color: #ddd;
}

.primary:hover {
  background-color: rgb(255, 73, 66);
}

.secondary:hover {
  background-color: rgb(197, 197, 197);
}
</style>
