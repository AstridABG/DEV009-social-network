// Este es el punto de entrada de tu aplicacion
// import { myFunction } from './lib/index.js';
import home from './components/home.js';
// eslint-disable-next-line
import login from './components/login.js';
import error from './components/error.js';
import forgotPassword from './components/forgotPass.js';
import newAccount from './components/newAccount.js';
import wall from './components/wall.js';

const root = document.getElementById('root');
const routes = [
  { path: '/', component: home },
  { path: '/login', component: login },
  { path: '/error', component: error },
  { path: '/forgotPassword', component: forgotPassword },
  { path: '/newAccount', component: newAccount },
  { path: '/wall', component: wall },
];
const defaultRoute = '/';
function navigateTo(hash) {
  const route = routes.find((routeFind) => routeFind.path === hash);
  if (route && route.component) {
    window.history.pushState(
      {},
      route.path,
      window.location.origin + route.path,
    );
    if (root.firstChild) {
      root.removeChild(root.firstChild);
    }
    root.appendChild(route.component(navigateTo));
  } else {
    navigateTo('/error');
  }
}

window.onpopstate = () => {
  navigateTo(window.location.pathname);
};

navigateTo(window.location.pathname || defaultRoute);
