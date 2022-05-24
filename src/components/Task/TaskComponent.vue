<template>
  <div>
    <v-form>
      <v-container fluid>

        <v-row no-gutters>
          <!-- Task tile -->
          <v-col>
            <p id="taskTitle">{{task.title}}</p>
          </v-col>
        </v-row>

        <!-- Status,priority and dates -->
        <v-row no-gutters>
          <!-- status -->
          <v-col cols="1">
            <v-chip
              size="x-large"
              color="#009AA4"
            >
              {{task.status}}
            </v-chip>
          </v-col>
          <!-- task priority -->
          <v-col cols="1">
            <v-chip
              size="x-large"
              color="#1A618E"
            >
              Priority: {{task.priority}}
            </v-chip>
          </v-col>

          <!-- spacer -->
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>
          <v-spacer ></v-spacer>

          <!-- date of creation -->
          <v-col cols="2">
            <v-row>
              <v-text-field readonly>
                Date of Creation: {{task.dateToDisplay}}
              </v-text-field>
            </v-row>
          </v-col>

          <v-spacer></v-spacer>
          <!-- last modified date -->
          <v-col cols="2" >
            <v-row>
              <v-text-field readonly>
                Last Modified On: {{task.lastModifiedDateToDisplay}}
              </v-text-field>
            </v-row>
          </v-col>

          <v-spacer></v-spacer>

        </v-row>
        <!-- Show the task steps -->
        <steps-component/>
        
      </v-container>
    </v-form>
  </div>
</template>

<script>
import {useRoute} from 'vue-router'
import {onMounted, onUnmounted} from 'vue'
import StepsComponent from './FormComponents/StepsComponent/StepsComponent.vue'
import {useStore} from 'vuex'
export default {
  components:{
    StepsComponent
  },
  setup(){
    const route = useRoute()
    const store = useStore()

  

    // When mounting the component, obtain the task data and save it 
    onMounted( async () =>{
      //fetch the task data from the backend, and store it in the task store for future use
      store.dispatch('task/getTaskById',{taskId:route.params.id})
    })

  
    onUnmounted(()=>{
      //when the component is about to be dismounted, set the task to null in the task store 
      //to avoid having data in the store when moving to another page
      store.commit('task/setTask',null)
    })

    //variable that holds the task data in the task store
    const task  = store.getters['task/task']

    return{
      task
    }

  }
};
</script>

<style>
  #taskTitle{
    color: #009AA4;
    font-weight: 600;
    text-align: left;
    font-size: 64px;
  }
</style>