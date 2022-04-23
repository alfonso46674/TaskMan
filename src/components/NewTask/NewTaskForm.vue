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
import {store} from './newtask.store'

export default {
  components: {
    DropDownComponent,
  },
  setup() {
    //priority list
    const priorityItems = [1,2,3,4]



    //recompute the priority when the user changes it in the dropdown component
    const priority = computed(()=>{
      if(store.state.priority == null){
        return priorityItems[0]
      }
      return store.state.priority
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