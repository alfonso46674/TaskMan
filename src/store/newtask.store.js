export const newTask = {
    namespaced: true,

    state(){
        return {
            priority: null
        }
    },
    mutations:{
        setPriority(state,priority){
            state.priority = priority
        }
    },
    actions:{

    },
    getters:{
        currentPriority(state){
            return state.priority
        }
    }
}
