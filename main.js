import { pages } from './lib/templates.js';
import {
  objMain, fnPageSignUp, fnLogin, fnAuthGoogle,
} from './lib/FnLogics.js';
import {
  sendSingUp, sendLoginGoogle, fnLogOutFb, writeFareBase, readfirebase, fillPosted, getUsersFireBase, fnMakeLike,
} from './lib/FireBase.js';



let userState = 0;
document.getElementById('idLogOut').addEventListener('click', fnLogOut);
document.getElementById('menu_home').addEventListener('click', fnGoHome);
// Autenticacion de Usuario al Entrar a la App o al cambiar de estado
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('idLogOut').style.display = 'block';
    userState = user;
    router();
  } else {
    userState = 0;
    document.getElementById('idLogOut').style.display = 'none';
    router();
  }
});




async function fnSignUp(e) {
  e.preventDefault();
  let signUpPassword1 = 0;
  let signUpPassword2 = 0;
  signUpPassword1 = document.getElementById('sign_up_password1').value;
  signUpPassword2 = document.getElementById('sign_up_password2').value;
  const signUpEmail = document.getElementById('sign_up_email').value;
  const signUpPasswordError = document.getElementById('sign_up_password_error');
  const singUpName = document.getElementById('sign_up_user_name').value;
  if (signUpPassword1 === signUpPassword2) {
    const message = await sendSingUp(signUpEmail, signUpPassword1);
    console.log(message);
    if (firebase.auth().currentUser) {
      const users = message;
      writeFareBase(users.uid, 'namefirst', singUpName);
      writeFareBase(users.uid, 'city', "");
      writeFareBase(users.uid, 'work', "");
      firebase.firestore().collection(users.uid).doc('userPost').set({});
      window.history.pushState({}, '', pages.home2.path);

      fetch("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
        .then((res) => res.blob()) // Gets the response and returns it as a blob
        .then((blob) => {
          firebase.storage().ref(users.uid + '/profileimg.jpg').put(blob);
        });

      router();
    } else {
      signUpPasswordError.innerHTML = 'Usuario o contraseña no son validos';
    }
  } else {
    signUpPasswordError.innerHTML = 'Las contraseñas no son iguales';
  }
}

async function fnLoginGoogle() {
  fnAuthGoogle();
  if (userState) {
    router();
  }
}

export async function fnLogOut() {
  await fnLogOutFb()
}

function fnGoProfile() {
  window.history.pushState({}, '', pages.profile.path);
  router();
}

function fnGoHome() {
  window.history.pushState({}, '', pages.home.path);
  router();
}


window.onpopstate = () => { //Evento cambio de pagina en navegado y autenticacion
  router();
}

 ///////////////////////////////////////////////////////////////////////////////// ROTER DE PAGINAS /////////
async function router() {

  switch (window.location.pathname) {
    case '/Red-Social':
      if (userState.uid) {
        const info = await readfirebase(userState.uid, 'name');
        const img = await readfirebase(userState.uid, 'img');
        objMain.innerHTML = pages.home2.template;
        await fnPrintPosted2("all");
        document.querySelector('.profileimg').src = img;
        document.querySelector('.nameUser').innerHTML = info;
        document.querySelector('.btn_profile').addEventListener('click', fnGoProfile);
        document.querySelector('.btn_make_post').addEventListener('click', () => {fnMakeAPost('')});

      } else {
        objMain.innerHTML = pages.home.template;
        const objBotonSingup = document.getElementById('id_home_text_registro');
        objBotonSingup.addEventListener('click', () => { fnPageSignUp(); router(); });
        document.getElementById('id_home_btn_login').addEventListener('click', () => {
          window.history.pushState({}, '', pages.login.path);
          router(); 
        });
        document.getElementById('id_home_btn_login_google').addEventListener('click', fnLoginGoogle);
      }
      break;
    case '/singup':
      objMain.innerHTML = pages.singUp.template;
      const objSingUpForm = objMain;
      objSingUpForm.addEventListener('submit', fnSignUp);
      break;
    case '/login':
      objMain.innerHTML = pages.login.template;
      const loginError = document.getElementById('login_error');
      document.getElementById('login_form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginEmail = document.getElementById('login_email').value;
        const loginPassword = document.getElementById('login_password').value;
        loginError.innerHTML = await fnLogin(loginEmail, loginPassword, loginError, e);
        if (userState) {
          router();
        }
      });
      break;
    case '/profile':
      if (userState) {
        let name = await readfirebase(userState.uid, 'name');
        let city = await readfirebase(userState.uid, 'city');
        let work = await readfirebase(userState.uid, 'work');
        let img = await readfirebase(userState.uid, 'img');
        objMain.innerHTML = pages.profile.template;
        await fnPrintPosted2('one');
        document.querySelector('.profileimg').src = img;
        document.querySelector('.nameUser').innerHTML = name;
        document.querySelector('.nameUserProfile').innerHTML = name;
        document.querySelector('.cityUser').innerHTML = city;
        document.querySelector('.workUser').innerHTML = work;

        document.querySelector('.btn_editprofile').addEventListener('click', () => {
          fnEditProfile(img, name, city, work);

        });

        document.querySelector(".btn_make_post").addEventListener('click', () => {
          fnMakeAPost('');
        }); 
      } else {
        window.history.pushState({}, '', pages.home.path);
        router();
      }
      break;
    default:
      window.history.pushState({}, '', '/Red-Social');
      router();
      break;
  }
}





 ///////////////////////////////////////////////////////////////////////////////// MOSTRAR PUBLICACIONES /////////
async function fnPrintPosted2(type) {

 let idUsers = [];
  const insert = document.querySelector('.all_profile_post');
  
  switch(type){
    case 'all':
      idUsers = await getUsersFireBase();
      break;
    case 'one':
      idUsers[0] = userState.uid;
      break;
    default:
  }

  idUsers.map(async function (postId, i1 ) {  // Map para todos los Usuarios



    const posted = await fillPosted(postId, type);
    const numpost = Object.keys(posted); 
    
    numpost.map( async function(x, i2) {  // Map para todas las Publucaciones


      insert.innerHTML += pages.post.template(x);
      switch(type){
        case 'all':
          document.getElementById('like' + x).style.display = 'block';
          document.getElementById('contlike' + x).style.display = 'block';
          document.getElementById('share_post' + x).style.display = 'block';
          document.getElementById('make_comment_on_post' + x).style.display = 'block';
          if(postId == userState.uid){
            document.getElementById('menu_options' + x).style.display = 'block';
          }
          break;
        case 'one':
          document.getElementById('like' + x).style.display = 'block';
          document.getElementById('contlike' + x).style.display = 'block';
          document.getElementById('menu_options' + x).style.display = 'block';
          break;
        default:
      }

      document.getElementById('post' + x).innerHTML = posted[x].post;
    
      readfirebase(postId, 'img')
      .then((res) => {
        document.getElementById('img' + x).src =  res;
      });

      readfirebase(postId, 'name')
      .then((res) => {
        document.getElementById('name' + x).innerHTML = res;
      });
    
    
      document.getElementById('date' + x).innerHTML = x.split(' ')[0];
      let likes = 0;
      const numlikes = Object.values(posted[x].likes);
      
      numlikes.map(function (counlikes){
        likes += counlikes;
      });
      
      document.getElementById('contlike' + x).innerHTML = likes;
      
      document.getElementById('like' + x).setAttribute('name', postId);
      document.getElementById('make_comment_on_post' + x).setAttribute('name', postId);
    
    
      const Listcomments = Object.keys(posted[x].comments);
      Listcomments.map((item)=>{  //Map para todos los comentarios
        const imgComment = document.createElement('img');
        const divComment =document.createElement('div');
        const divCommentin=document.createElement('div');
        //title.innerHTML = 'Comentario:'
        divCommentin.style="display:flex; flex-direction:column;";
        divComment.classList.add('box_comment');
        imgComment.classList.add('subprofileimg4');
        readfirebase(posted[x].comments[item].user, 'img')
        .then((imgreturn) => { 
          imgComment.src = imgreturn;
          divCommentin.innerHTML = "<p>Comentario: </p>" + posted[x].comments[item].comment;
          divComment.innerHTML = imgComment.outerHTML + divCommentin.outerHTML;
          document.getElementById('comment' + x).innerHTML +=divComment.outerHTML;
        });
      
      });

    });


    if((idUsers.length-1) == i1){

      const eventLike = document.querySelectorAll('.evente_like');
      eventLike.forEach( element => {

        element.addEventListener('click', async () => {
          document.getElementById('contlike' + element.id.slice(4)).innerHTML = await fnMakeLike(element.name, userState.uid, element.id);
        });
      });

      const clickShowMenu = document.querySelectorAll('.show_menu');
      clickShowMenu.forEach( element => {
        const userpermise = document.getElementById('make_comment_on_post' + element.id.slice(12));
        

        if(userpermise.name == userState.uid){

        element.addEventListener('click',() => {
          //document.getElementById('menu_options' + element.id.slice(12)).style.display = 'none'
          document.getElementById('div_menu_options' + element.id.slice(12)).style.display = 'flex'
          document.getElementById('edit_post' + element.id.slice(12)).style.display = 'block'
          document.getElementById('delete_post' + element.id.slice(12)).style.display = 'block'
        });
      
        document.getElementById('big_box_post'+ element.id.slice(12)).addEventListener('mouseleave',() => {
          document.getElementById('div_menu_options' + element.id.slice(12)).style.display = 'none'
          document.getElementById('menu_options' + element.id.slice(12)).style.display = 'block'
          document.getElementById('segura_post' + element.id.slice(12)).style.display = 'none'
          document.getElementById('si_post' + element.id.slice(12)).style.display = 'none'
          document.getElementById('no_post' + element.id.slice(12)).style.display = 'none'
        });

        document.getElementById('edit_post'+ element.id.slice(12)).addEventListener('click', () => {
          document.getElementById('div_menu_options'+ element.id.slice(12)).style.display = 'none'
          const edited = document.getElementById('post' + element.id.slice(12)).innerHTML;
          fnMakeAPost(edited, element.id.slice(12));
        });

        document.getElementById('delete_post'+ element.id.slice(12)).addEventListener('click',() => {

          document.getElementById('edit_post' + element.id.slice(12)).style.display = 'none'
          document.getElementById('delete_post' + element.id.slice(12)).style.display = 'none'
          document.getElementById('segura_post' + element.id.slice(12)).style.display = 'block'
          document.getElementById('si_post' + element.id.slice(12)).style.display = 'block'
          document.getElementById('no_post' + element.id.slice(12)).style.display = 'block'
         

          document.getElementById('si_post'+ element.id.slice(12)).addEventListener('click',() => {
            writeFareBase(userState.uid, 'deletepost', element.id.slice(12));
            const postDeleted = document.getElementById("big_box_post" + element.id.slice(12));
            postDeleted.parentNode.removeChild(postDeleted);
          });

          document.getElementById('no_post'+ element.id.slice(12)).addEventListener('click',() => {
            document.getElementById('div_menu_options'+ element.id.slice(12)).style.display = 'none'
            document.getElementById('edit_post' + element.id.slice(12)).style.display = 'none'
            document.getElementById('delete_post' + element.id.slice(12)).style.display = 'none'
            document.getElementById('segura_post' + element.id.slice(12)).style.display = 'none'
            document.getElementById('si_post' + element.id.slice(12)).style.display = 'none'
            document.getElementById('no_post' + element.id.slice(12)).style.display = 'none'
            document.getElementById('menu_options' + element.id.slice(12)).style.display = 'block'
          });


        });
      };
      });

      
      const eventComment = document.querySelectorAll('.event_comment');
      eventComment.forEach( element => {

        element.addEventListener('click', async () => {
          fnMakeAComment(userState.uid, element.name, element.id.slice(20));
        });
      });
    };
  });
  
}

 ///////////////////////////////////////////////////////////////////////////////// HACER UNA PUBLICACION /////////
async function fnMakeAPost(postedToEdit, originPost){
  document.querySelector('.make_post_on_profile').innerHTML = pages.makeapost.template;
  document.querySelector('.text_post').value = postedToEdit;
  document.querySelector('.make_post_on_profile').style.display = "flex";
  document.querySelector('.box_make_post').style.display = "flex";
  document.querySelector('.subprofileimg3').src = await readfirebase(userState.uid, 'img');
  document.querySelector('.make_post_on_profile').addEventListener('click',(e) => {
    const id = e.target.getAttribute("class");
    if(id == 'make_post_on_profile'){
      document.querySelector('.make_post_on_profile').style.display = "none";
      document.querySelector('.box_make_post').style.display = "none";
      document.querySelector('.make_post_on_profile').innerHTML = '';
    };
  });
  document.querySelector('.box_make_post').addEventListener('submit', (e) => {
    e.preventDefault();
    const post = document.querySelector('.text_post').value;
    if(!(post == ''))
    {
      if(postedToEdit == ''){
        writeFareBase(userState.uid, 'post', post);
        router();
      }
      else{
        writeFareBase(userState.uid, 'editpost', originPost + '$-$' + post);
        document.querySelector('.make_post_on_profile').style.display = "none";
        document.querySelector('.box_make_post').style.display = "none";
        document.querySelector('.make_post_on_profile').innerHTML = '';
        document.getElementById('post' + originPost).innerHTML = post
      }
    
    }
    else{
      document.querySelector('.text_post').placeholder = 'La Publicacion no puede estar en blanco';
    };
    
  });

}

 ///////////////////////////////////////////////////////////////////////////////// HACER UN COMENTARIO /////////
function fnMakeAComment(userWhoComment, userToComent, idForComment){
  document.querySelector('.make_post_on_profile').innerHTML = pages.makecomment.template;
  document.querySelector('.box_make_comment').style.display = "flex";
  document.querySelector('.make_post_on_profile').style.display = "flex";
  document.querySelector('.box_make_comment').addEventListener('click',(e) => {
    const id = e.target.getAttribute("class");
    if(id == 'box_make_comment'){
    document.querySelector('.box_make_comment').style.display = "none";
    document.querySelector('.make_post_on_profile').style.display = "none";
    document.querySelector('.make_post_on_profile').innerHTML = '';
    };
  });
  document.querySelector('.box_make_comment').addEventListener('submit', async (e) =>{
      e.preventDefault();
      const comment =document.querySelector(".text_post").value;
      if(!(comment == '')){
       await writeFareBase(userWhoComment, 'comment',userToComent+  "$-$" + idForComment + "$-$" + comment);
      
      
        const imgComment = document.createElement('img');
        const divComment =document.createElement('div');
        const divCommentin=document.createElement('div');
        divCommentin.style="display:flex; flex-direction:column;";
        divComment.classList.add('box_comment');
        imgComment.classList.add('subprofileimg4');
        readfirebase(userWhoComment, 'img')
        .then((imgreturn) => { 
          imgComment.src = imgreturn;
          divCommentin.innerHTML = "<p>Comentario: </p>" + comment;
          divComment.innerHTML = imgComment.outerHTML + divCommentin.outerHTML;
          document.getElementById('comment' + idForComment).innerHTML +=divComment.outerHTML;
          document.querySelector('.box_make_comment').style.display = "none";
          document.querySelector('.make_post_on_profile').style.display = "none";
          document.querySelector('.make_post_on_profile').innerHTML = '';
        });
      }
      else{
        document.querySelector(".text_post").placeholder = "El comentario no puede estar en blanco"
      }

      
    });

  //writeFareBase(idUser, type, data);
}

 ///////////////////////////////////////////////////////////////////////////////// EDITAR PERFIL /////////
function fnEditProfile(img, name, city, work){
  document.querySelector('.dateUserHome1').style.display = "flex";
  document.querySelector('.ventana_modal_editar').style.display = "flex";
  document.querySelector('.subprofileimg2').src = img;
  document.querySelector('.name_profile').value = name;
  document.querySelector('.city_profile').value = city;
  document.querySelector('.work_profile').value = work;

  document.getElementById('idfile').addEventListener('input', async () => {
    const file = document.getElementById('idfile');

    var stateOfLoad = firebase.storage().ref(userState.uid + '/profileimg.jpg').put(file.files[0]);
    stateOfLoad.then(() => {
      readfirebase(userState.uid, 'img')
        .then((a) => {
          document.querySelector('.subprofileimg2').src = a;
          document.getElementById("porcent_carga").innerHTML = "Imagen Actualizada."
        });
    })
             
    stateOfLoad.on('state_changed', taskSnapshot => {
              
      document.getElementById("porcent_carga").innerHTML = Math.trunc((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100) + " %";
    });

          

  });


  document.getElementById('form_user_date').addEventListener('submit', (e) => {
    e.preventDefault();
    name = document.querySelector('.name_profile').value;
    city = document.querySelector('.city_profile').value;
    work = document.querySelector('.work_profile').value;
    writeFareBase(userState.uid, 'name', name);
    writeFareBase(userState.uid, 'city', city);
    writeFareBase(userState.uid, 'work', work);
    router();
  });

  document.getElementById('cancel_edit').addEventListener('click', () => {
    document.querySelector('.dateUserHome1').style.display = "none";
    document.querySelector('.ventana_modal_editar').style.display = "none";
  });
}