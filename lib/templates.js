export const pages = {
  home:
  {
    path: '/',
    template:
      `<section class="page_home">

        <p class="subtitle" > Unete a la comunidad más grande de desarrollador@s!!! </p>

        <div class="home_content_login">

          <div class="home_box_img_stickers">
            <img class="home_img_stickers" src="https://anasofiamoreno.github.io/CDMX011-SocialDev/img/stickers.jpeg">
          </div>

          <div class="home_box_login">
            <input type="button" class="home_btn_login" id="id_home_btn_login" value="LogIn"></input>
            <input type="button" class="home_btn_login_google" id="id_home_btn_login_google" value="Cuenta de Google"></input>
            <div>
              <p class="home_text_01">¿Aun no tienes cuenta?</p>
              <div class="home_text_02" id="id_home_text_registro">
                <p class=".btnMenuReg">Registrate</p>
                <p id="loginErrorGoogle"></p>
              </div>
            </div>
          </div>

        </div>
          
        </section>
        `,
  },
  home2: {
    path: '/',
    template: `<section class="dateUserHome">
                <h1 class="tittle_home2"> Bienvenid@ a Social </h1>
                <p class="nameUser"></p>
                <div><img class="profileimg" src=""></div>
                <div><input class="btn_profile" type="button" value="Perfil"></div>
                <div><input class="btn_make_post" type="button" value="Publicar"></div>
              </section>  

              <section class="all_profile_post">
              </section>

              <section class="make_post_on_profile">
              </section>
                 `,
  },
  singUp: {
    path: '/singup',
    template: `
    <section>
      <div class="box_general_singup">
        <div class="box_singup">
          <p class="text_register">Datos de registro</p>
       
          <form id="sign_up_form" class="form" >
            <div class="linea"> </div>
            <label class="invisible"> Nombre del Usuario </label >
            <input type="text" id="sign_up_user_name" placeholder="Nombre" required>
            <input type="email" id="sign_up_email" placeholder="Correo" required>
            <input type="password" id="sign_up_password1" placeholder="Contraseña" required>
            <input type="password" id="sign_up_password2"  placeholder="Verificar contraseña" required>
            <div class="lineaform"> </div>
            <p id="sign_up_password_error"></p>
            <button type="submit" class="btnRegistrar">Registrar</button>
          <form>
        </div>
      </div> 
    </section>
    `,

  },
  login: {
    path: '/login',
    template: `
  <section>
  <div class="box_singup">
     <p class="text_register">Datos de registro</p>
     <div class="linea"> </div>
     
     <form id="login_form" class="form" >
     <input type="email" id="login_email" placeholder="Correo" required>
     <input type="password" id="login_password" placeholder="Contraseña" required>
     <div class="lineaform"> </div>
     <p id="login_error"></p>
     <button type="submit" class="btnRegistrar">Login</button>
     <form>
     </div>
    
  </section>
  `,

  },
  profile: {
    path: '/profile',
    template: `
    <section class="dateUserHome">
      <h1 class="tittle_home2">Perfil</h1>
      <p class="nameUser"></p>
      <div><img class="profileimg" src=""></div>
      <div><input class="btn_editprofile" type="button" value="Editar Perfil"></div>
      <div class="UserData">
         <p class="titleData">Nombre: <span class="nameUserProfile dataProfile"></span></p>
         <p class="titleData">Ciudad: <span class="cityUser dataProfile"></span></p>
         <p class="titleData">Lugar de trabajo: <span class="workUser dataProfile"></span></p>
      </div>
      <div><input class="btn_make_post" type="button" value="Publicar"></div>
      
    </section>
    
    <section class="all_profile_post">
    </section>

    <section class="make_post_on_profile">
    </section>

    <section class="dateUserHome1">
      <div class="ventana_modal_editar">

        <h1 class="tittle_editprofile">Editar Perfil</h1>
        <p class="nameUser"></p>

        <div class="uploadpicture">
          <div class="box_post_img"><img class="subprofileimg2"src=""><p id="porcent_carga"></p></div>
          <div class="form"><p>Cambiar Imagen</p></div>
          <input type="file" id="idfile" class="load_file">
        </div> 

        <div style="width: 100%">
          <form id="form_user_date" class="form">
            <input type="text" class="name_profile" placeholder="Nombre">
            <input type="text" class="city_profile" placeholder="Ciudad">
            <input type="text" class="work_profile" placeholder="Lugar de Trabajo">
            <div class="action_edit_perfil">
            <button type="submint" >Guardar</button>
            <button type="button" id="cancel_edit">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </section> 

    `,

  },
  makeapost: {
    path: '/makespost',
    template: `
  
    <form class="box_make_post">
      <div class="box_post_img">
        <img class="subprofileimg3"src="">
        <p class="subnameuser"></p>
      </div>
      <div class="post_publish">
        <textarea class='text_post' placeholder='¿Qué te gustaria públicar?' type ='text'></textarea>
        <div class="box_post_btn_publish">
           
          <div>
            <button type="submit" id="publish_comment_profile">Publicar</button>
            
          </div>
        </div>  
      </div> 
    </form>
   
    `,

  },
  post: {
    path: '/post',
    template: function(idPost) {
    

      let result = 
      `
   
    <div class="box_post" id="big_box_post`+idPost+`">
      <div class="box_post_img">
        <img class="subprofileimg"src="" id="img`+idPost+`">
        <div style="display:flex; flex-direction:column;">
          <p class="subnameuser" id="name`+idPost+`"></p>
          <p class="date_posted" id="date`+idPost+`"></p>
        </div>
      </div>
      <div class="posted">
         <p class="text_post2">Publicacion:</p>
         <p class="tex_post1" id="post`+idPost+`"></p>
         <div id ="comment`+idPost+`"></div>
         <div id="div_menu_options`+idPost+`" class="div_menu_options">
           <p id="edit_post`+idPost+`" class="menu_btn_text edit_post">Editar</p>
           <p id="delete_post`+idPost+`" class="menu_btn_text delete_post">Borrar</p>
           <p id="segura_post`+idPost+`" class="menu_btn_text">¿Estas segur@?</p>
           <div class="row">
             <p id="si_post`+idPost+`" class="menu_btn_text">Si</p>
             <p id="no_post`+idPost+`" class="menu_btn_text">No</p>
           </div>
        </div>
      </div>
      <div class="box_post_btn">
          <div style="display:flex; flex-direction:row;">
            <img id ="like`+idPost+`" value="" type="button" class="menu_btn_text evente_like" src="https://github.com/anasofiamoreno/Red-Social/blob/gh-pages/img/likeicon.png?raw=true">
            <p id ="contlike`+idPost+`" class="menu_btn_text"></p>
          </div>
          <img class="menu_btn_text" id="share_post`+idPost+`" src="https://github.com/anasofiamoreno/Red-Social/blob/gh-pages/img/shericon2.png?raw=true">
          <img class="menu_btn_text event_comment" id="make_comment_on_post`+idPost+`"  src="https://github.com/anasofiamoreno/Red-Social/blob/gh-pages/img/coment.png?raw=true">
          <img class="menu_btn_text show_menu" id="menu_options`+idPost+`"  src="https://github.com/anasofiamoreno/Red-Social/blob/gh-pages/img/menuicon2.png?raw=true">

          
            
      </div>
      
    
    </div>

    `;
  
  return result 
  }
  
  },
  makecomment: {
    path: '/makecomment',
    template: `
  
    <form class="box_make_comment">
      <div class="comment_publish">
        <textarea class='text_post' placeholder='Realiza aqui tu comentario' type ='text'></textarea>
        <div class="box_comment_btn_publish">
          <div>
            <button type="submit" id="publish_comment_profile">Comentar</button>
          </div>
        </div>  
      </div> 
    </form>
   
    `,

  },
};
