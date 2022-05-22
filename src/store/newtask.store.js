import axios from "axios"
import {url} from '../config/env_variables'

export const newTask = {
    namespaced: true,

    state(){
        return {
            title: null,
            priority: 4,
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
            axios.post(`${url}/api/task/new`,
            {
                title: state.title,
                priority: state.priority,
                steps: state.steps
            }).then((response)=>{
                commit('handleError',{status:response.status, statusText: response.statusText})
            }).catch((error) => {
                console.log({'POST error while uploading new task': error})
            })
        }
    },
    getters:{
        currentNumberOfSteps(state){
            return state.steps.length
        },
    }
}
