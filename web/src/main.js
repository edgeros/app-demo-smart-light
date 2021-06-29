import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { edger } from '@edgeros/web-sdk';
import SocketIO from 'socket.io-client';
import VueSocketIOExt from 'vue-socket.io-extended';
import { setToken, setSrand, getHeaders } from './service/auth';
import { Cell, List, NavBar, CellGroup, Image, Icon, Row, Col, PullRefresh, Slider, Notify} from 'vant';
import 'vant/lib/index.css';

Vue.config.productionTip = false

Vue.use(Cell);
Vue.use(List);
Vue.use(NavBar);
Vue.use(CellGroup);
Vue.use(Image);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(PullRefresh);
Vue.use(Slider);
Vue.use(Notify);

edger.onAction('token', (result) => {
  setToken(result.token);
  setSrand(result.srand);
});

edger.token().then((result) => {
  setToken(result.token);
  setSrand(result.srand);
  const socket = SocketIO({
    path: '/light',
    query: getHeaders(),
    transports: ['websocket']
  });
  Vue.use(VueSocketIOExt, socket);

}).catch((error) => {
  console.log(error);
}).finally(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
});


