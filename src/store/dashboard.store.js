import axios from "axios"
import {url} from '../config/env_variables'

export const dashboard = {
    namespaced: true,

    state(){
        return {
            headers: null,
            tasksData: null
        }
    },
    mutations:{
        setTasksData(state,data){
            state.tasksData = data
        },
        setHeaders(state,headers){
            state.headers = headers
        }
    },
    actions: {
        getTasksData(ctx){
            axios.get(`${url}/api/task/all`)
                .then((response)=> {
                    ctx.commit('setTasksData',response.data)
                }).catch((error)=>{
                    console.log({'GET error while obtaining dashboard data':error})
                })
        }
    },
    getters:{
        currentTaskData(state){
            return state.tasksData
        }
    }
}