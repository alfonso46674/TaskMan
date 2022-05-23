<template>
  <div>
      <form @submit.prevent="submitData">
        <v-container>
          <!-- Component title -->
          <v-row>
            <v-col>
              <p >Add New Task</p>
            </v-col>
          </v-row>
        
          <!-- Row for the task title input, priority input -->
          <v-row>
            <!-- Task title input field -->
            <v-col>
              <v-text-field
                label="Task Title"
                @input="saveTitle"
                required
              ></v-text-field>
            </v-col>
            <!-- Priority input field -->
            <v-col>
              <v-select
                :items="priorityItems"
                label="Priority"
                aria-required="true"
                @update:modelValue="savePriority"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Custom component for the task's steps -->
          <steps-to-take-component />


          <button>Submit</button>
        </v-container>
      </form>
    <router-link to="/"> Back </router-link>
  </div>
</template>

<script>

import {useStore} from 'vuex'
import StepsToTakeComponent from './FormComponents/StepsToTake/StepsToTakeComponent.vue';
import {useRouter} from 'vue-router'

export default {
  components: {
    StepsToTakeComponent
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    //priority list
    const priorityItems = [1,2,3,4]

    //save title input value in the store
    const saveTitle = (event) =>{
      store.commit('newTask/setTitle',event.target.value)
    }

    //save priority input value in the store
    const savePriority = (selectedPrority) => {
      console.log("hola")
      store.commit('newTask/setPriority',selectedPrority)
    }

    const submitData = () => {
      store.dispatch('newTask/postNewTask')
      router.back()
    }

    return {
      saveTitle,
      priorityItems,
      savePriority,
      submitData
    };
  },
};
</script>

<style>
#steps {
  width: 20px;
}
</style>