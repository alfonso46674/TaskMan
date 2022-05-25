import axios from "axios"
import {url} from '../config/env_variables'

export const task = {
    namespaced: true,

    state(){
        return {
            // task: null
            task: {
                uid: null,
                title: '',
                priority: null,
                status: '',
                dateToDisplay: '',
                lastModifiedDateToDisplay: '',
                steps: []
            }
        }
    },
    mutations:{
        //mutations to handle the task state in general
        setTask(state,task){
            if(task === null) state.task = {steps:[]}
            else{
                state.task.uid = task.uid
                state.task.title = task.title
                state.task.priority = task.priority
                state.task.status = task.status
                state.task.dateToDisplay = task.dateToDisplay
                state.task.lastModifiedDateToDisplay = task.lastModifiedDateToDisplay
                state.task.steps = task.steps
            }
        },
        //mutations to handle the task.steps array
        addStepObject(state,{id,value}){
            state.task.steps.push({stepNumber:id,stepValue:value})
        },
        removeStepObject(state){
            //only remove the new created steps, do not remove previously created steps
            if(state.task.steps.length >= 2){
                state.task.steps.pop()
            }
        },
        editStepObject(state,{id,value}){
            let foundIndex = state.task.steps.findIndex( 
                el => parseInt(el.id) === parseInt(id) )

            if(foundIndex != -1){
                state.task.steps[foundIndex].value = value
            }    
        }
    },
    actions:{
        getTaskById(ctx,{taskId}){
            axios.get(`${url}/api/task/?uid=${taskId}`)
            .then(response => {
                // console.log(response.data)
                ctx.commit('setTask',response.data)
            }).catch(error => {
                console.log({'GET error while obtaining task information':error})
            })
        }
    },
    getters:{
        task(state){
            return state.task
        },
        steps(state){
            return state.task.steps
        },
        currentNumberOfSteps(state){
            return state.task.steps.length
        }
    }

}