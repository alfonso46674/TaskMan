import { createApp } from 'vue'
import App from './App.vue'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSort } from "@fortawesome/free-solid-svg-icons";

library.add(faSort);

createApp(App)
.component('font-awesome-icon',FontAwesomeIcon)
.mount('#app')
