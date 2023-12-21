import './main.css';
import { FlexContainer, GridContainer, GridItem } from 'pdap-design-system';
import 'pdap-design-system/styles';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);

/* Registering custom components globally. 
  I suspect this is a bug in Vue, where importing 
  components does not properly register them 
  for passing to the <component :is="..."> prop. 
  So we register globally for now 🤷🏻‍♂️. */
app.component('FlexContainer', FlexContainer);
app.component('GridContainer', GridContainer);
app.component('GridItem', GridItem);

app.mount('#app');
