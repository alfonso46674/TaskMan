<template>
  <v-app>
    <v-main>
      <div id="root">
        <router-view/>
      </div>
    </v-main>
  </v-app>
</template>

<script>

export default {}
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

#root {
  padding: 1px;
}
</style>
