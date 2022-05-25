<template>
  <v-app>
    <!-- side bar -->
    <v-navigation-drawer
      width="80"
      color="#009AA4"
      permanent
    />
    
    <!-- navigation bar -->
    <v-app-bar color="white" elevation="0" >
      <router-link to="/" style="text-decoration:none; color:black" v-if="notDashboard()">
        <v-icon size="x-small">mdi-less-than</v-icon> 
        <u>Back to Dashboard</u> 
      </router-link>
    </v-app-bar>

    <v-main>
      <!-- margin-top -64px margin to left and right is automatic-->
      <v-container fluid class="mt-n16 mx-auto">
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import {computed} from 'vue'
import {useRoute} from 'vue-router'

export default {
  setup(){
    const route = useRoute()
    const currentPath = computed( () => route.path)

    //Tells if the current path is the dashboard ( / ) or not
    const notDashboard = () =>{
      if(currentPath.value !== '/') return true
      else return false
    }
    return {
      notDashboard
    }
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

#root {
  padding: 1px;
}

u {
  text-decoration-color: #009AA4;
  text-decoration-thickness: 2px;
}
</style>
