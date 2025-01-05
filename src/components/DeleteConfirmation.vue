<template>
  <div v-if="show" class="modal-overlay">
    <div class="card">
      <div class="card-content">
        <p class="card-heading">Delete Recipe?</p>
        <p class="card-description">Are you sure you want to delete this recipe?</p>
      </div>
      <div class="card-button-wrapper">
        <button class="card-button secondary" @click="$emit('cancel')">Cancel</button>
        <button class="card-button primary" @click="$emit('confirm')">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  show: Boolean,
})

defineEmits(['confirm', 'cancel'])
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
  width: 300px;
  height: fit-content;
  background: antiquewhite;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 30px;
  position: relative;
  box-shadow: 20px 20px 30px rgba(0, 0, 0, 0.068);
}
.card-content {
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.card-heading {
  font-size: 20px;
  font-weight: 700;
  color: rgb(27, 27, 27);
}
.card-description {
  font-weight: 100;
  color: rgb(102, 102, 102);
}
.card-button-wrapper {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.card-button {
  width: 50%;
  height: 35px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}
.primary {
  background-color: rgb(255, 114, 109);
  color: white;
}
.primary:hover {
  background-color: rgb(255, 73, 66);
}
.secondary {
  background-color: #ddd;
}
.secondary:hover {
  background-color: rgb(197, 197, 197);
}
.exit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
}
</style>
