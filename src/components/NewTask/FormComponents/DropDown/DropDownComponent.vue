<template>
  <div>
      {{dropdownName}}

    <button
      class="btn btn-outline-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{selectedItem}}
    </button>
    <ul class="dropdown-menu">
      <li v-for="item in dropdownItems" :key="item" class="dropdown-item" :value="item" @click="sendSelectedItem(item)" >{{item}}</li>  
    </ul>
  </div>
</template>

<script>
import {store} from '../../newtask.store'

export default {
    props:{
        dropdownName: {
            type: String,
            required:true
        },
        dropdownItems: {
            type: Array,
            required: true,
        },
        selectedItem: {
          required:true
        
        }
    }, 
    setup(){

        const sendSelectedItem =(item) =>{
            store.setPriority(item)
        }
    return {
        sendSelectedItem,
    }
    }
};
</script>

<style>
</style>