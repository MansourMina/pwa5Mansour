import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';

Vue.config.productionTip = false;

export const networkAddress = 'http://127.0.0.1:3000';

import './../node_modules/bootstrap/dist/css/bootstrap.min.css';

new Vue({
  render: (h) => h(App),
}).$mount('#app');
