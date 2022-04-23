export const newTask = {
    namespaced: true,

    state(){
        return {
            priority: null,
            numberOfSteps: 1,
        }
    },
    mutations:{
        setPriority(state,priority){
            state.priority = priority
        },
        addStep(state){
            state.numberOfSteps += 1
        },
        removeStep(state){
            if(state.numberOfSteps >= 2){
                state.numberOfSteps -= 1
            }
        }

    },
    actions:{

    },
    getters:{
        currentPriority(state){
            return state.priority
        },
        currentNumberOfSteps(state){
            return state.numberOfSteps
        }
    }
}
