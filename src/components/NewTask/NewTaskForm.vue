<template>
  <div>
    <div class="rootDiv">
      <form @submit.prevent="submitData">
      <div>
        <label>Task title</label>
        <input @input="editTitle"/>
      </div>
      
      <!-- Used for the task priority -->
      <drop-down-component
        :dropdownName="'Priority'"
        :dropdownItems="priorityItems"
        :selectedItem="priority"
      />

      
      <steps-to-take-component/>

      <button>Submit</button>
      </form>
    </div>
    <router-link to="/"> Back </router-link>
  </div>
</template>

<script>
import {computed } from "vue";
import DropDownComponent from "./FormComponents/DropDown/DropDownComponent.vue";

import {useStore} from 'vuex'
import StepsToTakeComponent from './FormComponents/StepsToTake/StepsToTakeComponent.vue';

export default {
  components: {
    DropDownComponent,
    StepsToTakeComponent
  },
  setup() {
    const store = useStore()

    //priority list
    const priorityItems = [1,2,3,4]

    //save title input value in the store
    const editTitle = (event) =>{
      store.commit('newTask/setTitle',event.target.value)
    }

    //recompute the priority when the user changes it in the dropdown component
    const priority = computed(()=>{
      if(store.getters['newTask/currentPriority'] == null){
        return priorityItems[0]
      }
      return store.getters['newTask/currentPriority']
    })

    const submitData = () => {
      store.dispatch('newTask/postNewTask')
    }

    return {
      editTitle,
      priorityItems,
      priority,
      submitData
    };
  },
};
</script>

<style>
</style>