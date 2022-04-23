<template>
  <div class="input-group" v-for="step in numberOfSteps" :key="step">
            <span class="input-group-text">Step  {{step}}</span>
            <textarea class="form-control" aria-label="With textarea"></textarea>
  </div>

  <div id="icons">
    <font-awesome-icon icon="minus" class="fa-xl" @click="removeStep"  v-if="numberOfSteps > 1"/>
    <font-awesome-icon icon="plus" class="fa-xl" @click="addStep"/>
  </div>
     
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

<style scoped>

#icons {
    padding-right: 1%;
    text-align: right;
}

</style>