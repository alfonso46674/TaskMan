<template>
  <div class="input-group" v-for="step in numberOfSteps" :key="step">
            <span class="input-group-text">Step  {{step}}</span>
            <textarea class="form-control" aria-label="With textarea"></textarea>
  </div>
  <button @click="addStep">Add new step</button>
  <button @click="removeStep" v-if="numberOfSteps > 1">Remove last step</button>
</template>

<script>
import {useStore} from 'vuex'

export default {
    props:{
        numberOfSteps:{
            required:true
        }
    },
    setup(){
        const store = useStore()

        const addStep = () => {
            store.commit('newTask/addStep')
        }

        const removeStep = () => {
            store.commit('newTask/removeStep')
        }


        return {
            addStep,
            removeStep
        }
    }
}
</script>

<style>

</style>