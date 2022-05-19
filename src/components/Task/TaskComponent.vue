<template>
  <div>
    Task component
    <router-link to="/"> Back to dashboard </router-link>
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
import {onMounted} from 'vue'
import {useStore} from 'vuex'
export default {
 
  setup(){
    const route = useRoute()
    const store = useStore()

    //When mounting the component, obtain the task data by its uid
    onMounted(()=>{
      store.dispatch('task/getTaskById',{taskId:route.params.id})
    })


    console.log(route.params.id)
  }
};
</script>

<style>
</style>