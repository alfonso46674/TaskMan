import axios from "axios"

export const newTask = {
    namespaced: true,

    state(){
        return {
            title: null,
            priority: null,
            steps: [{id:1,value:""}],
            postStatus: {status: 200, statusText: "",error:false }
        }
    },
    mutations:{
        setTitle(state,value){
            state.title = value
        },
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
        },
        handleError(state,{status,statusText}){
            state.postStatus.status = status
            state.postStatus.statusText = statusText
            
            if(status >= 400 && status < 600) state.postStatus.error = true
            else state.postStatus.error = false  
        }

    },
    actions:{
        postNewTask({commit,state}){
            axios.post('http://localhost:4674/api/task/new',
            {
                title: state.title,
                priority: state.priority,
                steps: state.steps
            }).then((response)=>{
                console.log(response)
                commit('handleError',{status:response.status, statusText: response.statusText})
            }).catch((error) => {
                console.log({'POST error while uploading new task': error})
            })
        }
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
