<template>
<!-- Add new stepObject with ctrl+Enter, delete it with ctrl+backspace -->
  <div class="input-group shadow" v-for="step in stepCount" :key="step">
            <span class="input-group-text" style="background-color:#009AA4;">Step  {{step}}</span>
            <textarea class="form-control" aria-label="With textarea" 
                :id="step" 
                @input="editStepObject" required
                @keyup.ctrl.enter="addEmptyStepObject()"
                @keyup.ctrl.delete="removeStepObject()"
                placeholder="Action to take"
                rows="2"
                ></textarea>
  </div>

  <div id="icons">
    <v-icon size="x-large" color="teal darken-2" @click="removeStepObject();"  v-if="stepCount > 1">mdi-minus-circle</v-icon>
    <v-icon size="x-large" color="teal darken-2" @click="addEmptyStepObject();">mdi-plus-circle</v-icon>
  </div>
     
</template>

<script>
import {useStore} from 'vuex'
import {computed} from 'vue'

export default {

    setup(){
        const store = useStore()
        

        const stepCount = computed(()=>{
            return store.getters['newTask/currentNumberOfSteps']
        })


        const removeStepObject = () => {
            store.commit('newTask/removeStepObject')
        }

        const addEmptyStepObject = () => {
            store.commit('newTask/addStepObject',{id: store.getters['newTask/currentNumberOfSteps'] + 1 , value: "" })
        }

        const editStepObject = event => {
            store.commit('newTask/editStepObject',{id: event.target.id, value: event.target.value})
        }


        return {
            stepCount,
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