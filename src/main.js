import { pages } from './lib/templates.js';
import { sendSingUp, sendLogin, sendLoginGoogle, fnLogOutFb, writeFareBase, readfirebase } from './lib/data.js';
import { obj_main, fnPageSignUp } from './nodom/nodom.js';


document.body.appendChild(obj_main);
let userState = firebase.auth().currentUser;

document.getElementById('idLogOut').addEventListener('click', fnLogOut);
// Autenticacion de Usuario al Entrar a la App o al cambiar de estado
firebase.auth().onAuthStateChanged(function (user) { 
  if(user) {
    router();
  }
  else{
    router();
  }
});

async function fnSignUp(e) {
  e.preventDefault();
  let user = [];
  const signUpPassword1 = document.getElementById('sign_up_password1').value;
  const signUpPassword2 = document.getElementById('sign_up_password2').value;
  const signUpEmail = document.getElementById('sign_up_email').value;
  const signUpPasswordError = document.getElementById('sign_up_password_error');
  const singUpName = document.getElementById('sign_up_user_name').value;
  if (signUpPassword1 === signUpPassword2) {
    const message = await sendSingUp(signUpEmail, signUpPassword1);
    if (firebase.auth().currentUser) {
      user = message;
      writeFareBase(user.uid, 'name', singUpName);
      window.history.pushState({}, '', pages.home2.path);
      router();
    } else {
      signUpPasswordError.innerHTML = 'Usuario o contraseña no son validos';
    }
  } else {
    signUpPasswordError.innerHTML = 'Las contraseñas no son iguales';
  }
}

async function fnLogin(e) {
  e.preventDefault();
  const loginPassword = document.getElementById('login_password').value;
  const loginEmail = document.getElementById('login_email').value;
  const loginError = document.getElementById('login_error');

  const message = await sendLogin(loginEmail, loginPassword);
  if (firebase.auth().currentUser) {
    window.history.pushState({}, '', pages.home2.path);
    router();
  } else {
    loginError.innerHTML = message;
  }
}
async function fnLoginGoogle() {
  const loginError = document.getElementById('loginErrorGoogle');
  const provider = new firebase.auth.GoogleAuthProvider();
  const message = await sendLoginGoogle(provider);
  try {
    window.history.pushState({}, '', pages.home2.path);
    router();
  } catch (error) {
    loginError.innerHTML = message;
  }
}

async function fnLogOut() {
  await fnLogOutFb();
  try {
    window.history.pushState({}, '', pages.home2.path);
    router();
  } catch (error) { console.log('error logout'); console.log(error.message); }
}


function fnPagesLogin() {
  window.history.pushState({}, '', pages.login.path);
  router();
}

async function router() {
  userState = firebase.auth().currentUser;

  switch (window.location.pathname) {
    case '/':
      if (userState) {
        const info = await readfirebase(userState.uid, 'name');
        const img = await readfirebase(userState.uid, 'img');
        obj_main.innerHTML = pages.home2.template;
        document.querySelector('.profileimg').src = img;
        document.querySelector('.subprofileimg').src = img;
        document.querySelector('.subnameuser').innerHTML = info;
        document.querySelector('.nameUser').innerHTML = info;
        
      } else {
        obj_main.innerHTML = pages.home.template;
        const obj_boton_singup = document.getElementById('id_home_text_registro');
        obj_boton_singup.addEventListener('click', () => {fnPageSignUp(); router();  } );
        document.getElementById('id_home_btn_login').addEventListener('click', fnPagesLogin);
        document.getElementById('id_home_btn_login_google').addEventListener('click', fnLoginGoogle);
      }
      break;
    case '/singup':
      obj_main.innerHTML = pages.singUp.template;
      const obj_sing_up_form = obj_main;
      obj_sing_up_form.addEventListener('submit', fnSignUp);
      break;
    case '/login':
      obj_main.innerHTML = pages.login.template;
      document.getElementById('login_form').addEventListener('submit', fnLogin);
      break;
    case '/perfil':
      obj_main.innerHTML = pages.perfil.template;
      break;
    default:
      window.history.pushState({}, '', '/');
      router();
      break;
  }
}

export {fnPageSignUp, obj_main}

