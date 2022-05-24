<template>

<!-- Add new stepObject with ctrl+Enter, delete it with ctrl+backspace -->
  <div class="input-group shadow" v-for="step in stepsArray" :key="step.stepNumber">
            <span class="input-group-text" style="background-color:#D9F0F0;">Step  {{step.stepNumber}}</span>
            <textarea class="form-control" aria-label="With textarea" 
                :id="step.stepNumber" 
                @input="editStepObject" required
                @keyup.ctrl.enter="addEmptyStepObject()"
                @keyup.ctrl.delete="removeStepObject()"                
                rows="2"
                v-model="step.stepValue"
                ></textarea>
  </div>

  <div id="icons">
    <v-icon size="x-large" color="#009AA4" @click="removeStepObject();"  v-if="stepCount > 1">mdi-minus-circle</v-icon>
    <v-icon size="x-large" color="#009AA4" @click="addEmptyStepObject();">mdi-plus-circle</v-icon>
  </div>
     
</template>

<script>
import {useStore} from 'vuex'
import {computed} from 'vue'

export default {
 
    setup(){
        const store = useStore()
        
        //computed variable for the steps array, each step has a stepValue an a stepNumber
        const stepsArray = computed(()=>{
            return store.getters['task/steps']
        })
        
        //computed variable to see how many steps there are
        const stepCount = computed(()=>{
            return store.getters['task/currentNumberOfSteps']
        })

        const removeStepObject = () => {
            store.commit('task/removeStepObject')
        }

        const addEmptyStepObject = () => {
            store.commit('task/addStepObject',{id: store.getters['task/currentNumberOfSteps'] + 1 , value: "" })
        }

        //when there is a change in the input of each textarea, save it in the task store by its element id and the value
        const editStepObject = event => {
            store.commit('task/editStepObject',{id: event.target.id, value: event.target.value})
        }


        return {
            stepCount,
            stepsArray,
            removeStepObject,
            addEmptyStepObject,
            editStepObject
        }
    }
}
</script>

<style scoped>

#icons {
    display: flex;
    padding-right: 1%;
    justify-content: right;
    gap: 3px;
}


</style>