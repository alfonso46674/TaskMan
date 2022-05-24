<template>
  <div>
    <v-form>
      <v-container fluid>
        <!-- Task tile -->
        <v-row no-gutters>
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
          <v-spacer></v-spacer>

        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script>
import axios from "axios"
import {url} from '../../config/env_variables'
import {useRoute} from 'vue-router'
import {onMounted, onUnmounted,ref} from 'vue'
// import {useStore} from 'vuex'
export default {
 
  setup(){
    const route = useRoute()
    // const store = useStore()

    //reactive variable that holds the current task informaiton
    const task = ref({})

    // When mounting the component, obtain the task data and save it 
    onMounted( async () =>{
      task.value = await getTaskData()
      console.log(task.value)
    })

    //request the taskData to the backend by its uid
    const getTaskData = async () => {
      let res = await axios.get(`${url}/api/task/?uid=${route.params.id}`)
      if(res.status == 200) return res.data
      else return false
    }

    //on unmount, delete any task data that could be in the task variable
    onUnmounted(()=>{
      task.value = null
    })

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