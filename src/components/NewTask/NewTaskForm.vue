<template>
  <div>
      <v-form>
        <v-container>
          <!-- Component title -->
          <v-row>
            <v-col>
              <p id="formTitle">Add New Task</p>
            </v-col>
          </v-row>
        
          <!-- Row for the task title input, priority input -->
          <v-row>
            <!-- Task title input field -->
            <v-col>
                <!-- TODO wait for the official release of vuetify to change the outline background color -->
              <v-text-field
                label="Task Title"
                @input="saveTitle"
                required
              ></v-text-field>
            </v-col>
            <!-- Priority input field -->
            <v-col>
              <!-- TODO wait for the official release of veautify to change the background color to white -->
              <v-select
                :items="priorityItems"
                label="Priority"
                required
                @update:modelValue="savePriority"
              ></v-select>
            </v-col>
          </v-row>

          <!-- Custom component for the task's steps -->
          <steps-to-take-component />

          <!-- submit button -->
          <v-btn
            rounded="lg"
            color="#1A618E"
            variant="outlined"
            @click="submitData"
          >
            Submit
          </v-btn>

        </v-container>
      </v-form>
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
  #formTitle{
    color: #009AA4;
    font-weight: 600;
    text-align: left;
    font-size: 64px;
  }
</style>