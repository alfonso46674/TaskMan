import { createStore } from "vuex";
import {newTask} from './newtask.store'
import{dashboard} from './dashboard.store'

export const store = createStore({
    modules:{
        newTask,
        dashboard
    }
})