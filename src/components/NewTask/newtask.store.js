import { reactive } from "vue";

class Store {
    constructor(){
        this.state = reactive({
            priority: null
        })
    }
    setPriority(value){
        this.state.priority = value
    }
}



export const store = new Store()