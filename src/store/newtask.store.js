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
        },
        editStepObject(state,{id,value}){
            let foundIndex = state.steps.findIndex( 
                el => parseInt(el.id) === parseInt(id) )

            if(foundIndex != -1){
                state.steps[foundIndex].value = value
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
