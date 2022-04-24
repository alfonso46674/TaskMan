export const newTask = {
    namespaced: true,

    state(){
        return {
            priority: null,
            steps: [{id:1,value:""}]
        }
    },
    mutations:{
        setPriority(state,priority){
            state.priority = priority
        },
        addStepObject(state,{id,value}){
            state.steps.push({id,value})
        },
        removeStepObject(state){
            if(state.steps.length >= 2){
                state.steps.pop()
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
            return state.steps.length
        },
    }
}
