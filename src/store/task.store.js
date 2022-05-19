import axios from "axios"

export const task = {
    namespaced: true,

    state(){
        return {
            task: null
        }
    },
    mutations:{
        setTask(state,task){
            state.task = task
        }
    },
    actions:{
        getTaskById(ctx,{taskId}){
            axios.get(`http://localhost:4674/api/task/?uid=${taskId}`)
            .then(response => {
                console.log(response.data)
                ctx.commit('setTask',response.data)
            }).catch(error => {
                console.log({'GET error while obtaining task information':error})
            })
        }
    }

}