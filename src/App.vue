<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'



</script>

<template>
  <header>
    <div class="nav-links">
      <nav>
        <RouterLink :to="{ name: 'recipes-composition-api' }">Recipes</RouterLink>
        <RouterLink :to="{ name: 'category' }">Category</RouterLink>
        <RouterLink :to="{ name: 'favorites' }">Favorites</RouterLink>
        <RouterLink :to="{ name: 'create-recipe' }">Create Recipe</RouterLink>
        <img src="https://i.pinimg.com/736x/9a/ba/3f/9aba3fd90771ca191007054b3414904d.jpg ">
      </nav>
    </div>
  </header>
  <RouterView />
  <main>



  </main>

</template>

<style scoped>
header {
  display: flex;
  background: antiquewhite;
  line-height: 1.5;
  height: 100px;
  justify-content: space-between;
  align-items: center;
}
header img{
  width: auto;
  height: 50px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}


nav a {
  display: inline-block;
  padding: 0 1rem;
  font-weight: 500;
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
