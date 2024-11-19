<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <header>

    <div class="wrapper">
      <nav>
        <RouterLink to="recipes-composition-api">Recipes</RouterLink>
        <RouterLink to="category">Category</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}


nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

@media (min-width: 1024px) {
  header {
    color: #333;
    display: flex;
    place-items: center;
    padding-right: 20px;
  }

}
</style>
