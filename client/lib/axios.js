import axios from 'axios';

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, '$axios', {
      value: axios.create({
        baseURL: '/',
        timeout: 10000
      })
    });
  }
};