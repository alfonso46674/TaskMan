<template>
  <div>
    <div class="rootDiv">
      <form @submit.prevent="submitData">
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

      
      <steps-to-take-component
        :numberOfSteps="numberOfStep"
      />
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



    //recompute the priority when the user changes it in the dropdown component
    const priority = computed(()=>{
      if(store.getters['newTask/currentPriority'] == null){
        return priorityItems[0]
      }
      return store.getters['newTask/currentPriority']
    })

    const numberOfStep = computed(()=>{
      console.log(store.getters['newTask/currentNumberOfSteps'])
      return store.getters['newTask/currentNumberOfSteps']
    })

    return {
      priorityItems,
      priority,
      numberOfStep
    };
  },
};
</script>

<style>
</style>