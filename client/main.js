import Vue from 'vue';
import VueRouter from 'vue-router';
import ElementUI from 'element-ui';
import App from 'App.vue';
import axios from 'lib/axios';
import routes from './routes';
import 'element-ui/lib/theme-chalk/index.css';
import 'styles/index.css';

Vue.use(axios);
Vue.use(ElementUI);
Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
});

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
