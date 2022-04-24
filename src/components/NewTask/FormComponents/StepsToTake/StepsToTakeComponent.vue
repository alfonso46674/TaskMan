<template>
  <div class="input-group" v-for="step in stepCount" :key="step">
            <span class="input-group-text">Step  {{step}}</span>
            <textarea class="form-control" aria-label="With textarea" :id="step" @input="editStepObject" required></textarea>
  </div>

  <div id="icons">
    <font-awesome-icon icon="minus" class="fa-xl" @click="removeStepObject();"  v-if="stepCount > 1"/>
    <font-awesome-icon icon="plus" class="fa-xl" @click="addEmptyStepObject();"/>
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