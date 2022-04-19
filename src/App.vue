<template>
  <div>
    <task-dashboard id="test">
  </task-dashboard>
  </div>
</template>

<script>
import TaskDashboard from './components/Dashboard/TaskDashboard.vue'

export default {
  components: {
    TaskDashboard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

#id {
  padding: 1000px;
}
</style>
