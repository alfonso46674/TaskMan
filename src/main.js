import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import {router} from './routes/router'

//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

//add to the icon library the sort icon
library.add(faSort);

const app = createApp(App)
app.use(router)
app.component('font-awesome-icon',FontAwesomeIcon)
app.mount('#app')
