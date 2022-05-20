import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {router} from './routes/router'
import {store} from './store/store'

//import vuetify
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

//import icons
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faMinus } from "@fortawesome/free-solid-svg-icons";


//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

//add to the icon library the sort icon
library.add(faSort);
library.add(faPlus);
library.add(faMinus);

//load webfontloader
loadFonts()

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.use(store)
app.component('font-awesome-icon',FontAwesomeIcon)
app.mount('#app')
