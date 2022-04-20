<template>
  <router-link to="/newTask"> Create task </router-link>
  <table-component />
</template>

<script>
import TableComponent from "./TableComponent.vue";
export default {
  components: { TableComponent },
};
</script>

<style>
</style>