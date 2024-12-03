<template>
  <div class="category-card">
    <h3>{{ title }}</h3>
    <p>{{ count }} recipe<span v-if="count > 1">s</span></p>
  </div>
</template>

<script lang="ts">
export default {
  name: "CategoryComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.category-card {
  background-color: antiquewhite;
  color: black ;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.category-card:hover {
  transform: scale(1.05);
}

h3 {
  margin: 0;
  font-size: 1.2rem;
}

p {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
  color: black ;
}
</style>
