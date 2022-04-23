<template>
  <div>
    <div class="rootDiv">
      <!-- <form> -->
      <div>
        <label>Task title</label>
        <input />
      </div>
      
      <!-- Used for the task priority -->
      <drop-down-component
        :dropdownName="'Priority'"
        :dropdownItems="priorityItems"
        :selectedItem="priority"
      />

      <!-- </form> -->
    </div>
    <router-link to="/"> Back </router-link>
  </div>
</template>

<script>
import {computed } from "vue";
import DropDownComponent from "./FormComponents/DropDown/DropDownComponent.vue";
// import {store} from '../../store/newtask.store'
import {useStore} from 'vuex'

export default {
  components: {
    DropDownComponent,
  },
  setup() {
    const store = useStore()

    //priority list
    const priorityItems = [1,2,3,4]



    //recompute the priority when the user changes it in the dropdown component
    const priority = computed(()=>{
      if(store.getters['newTask/currentPriority'] == null){
        return priorityItems[0]
      }
      return store.getters['newTask/currentPriority']
    })

    return {
      priorityItems,
      priority
    };
  },
};
</script>

<style>
</style>