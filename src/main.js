import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'


import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAmb60Mzc78eWOJKk_--NY3p8kpuN1bU_M",
  authDomain: "robot-management-405.firebaseapp.com",
  projectId: "robot-management-405",
  storageBucket: "robot-management-405.appspot.com",
  messagingSenderId: "734847257500",
  appId: "1:734847257500:web:28764e0fd719104b631659"
};

initializeApp(firebaseConfig);

export const db = getFirestore();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
