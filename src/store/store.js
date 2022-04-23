import { createStore } from "vuex";
import {newTask} from './newtask.store'

export const store = createStore({
    modules:{
        newTask
    }
})