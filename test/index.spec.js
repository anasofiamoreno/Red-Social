/**
 * @jest-environment jsdom
 */

import { fnPageSignUp, obj_main } from '../src/nodom/nodom.js';
import { pages } from '../src/lib/templates.js';

//const btnMenuRegister = createBtnReg();

describe('Pruebas de Red Social', () => {
  test('Verifica HTML en Home', () => {
    
    obj_main.innerHTML = pages.home.template.replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : ' ');
    document.body.innerHTML = obj_main.outerHTML;
    expect(obj_main.innerHTML).toBe('<section class=\"page_home\"> <p class=\"subtitle\"> Unete a la comunidad más grande de desarrolladores!!! </p> <div class=\"home_content_login\"> <div class=\"home_box_img_stickers\"> <img class=\"home_img_stickers\" src=\"https://anasofiamoreno.github.io/CDMX011-SocialDev/img/stickers.jpeg\"> </div> <div class=\"home_box_login\"> <input type=\"button\" class=\"home_btn_login\" id=\"id_home_btn_login\" value=\"LogIn\"> <input type=\"button\" class=\"home_btn_login_google\" id=\"id_home_btn_login_google\" value=\"Cuenta de Google\"> <p class=\"home_text_01\">¿Aun no tienes cuenta?</p> <div class=\"home_text_02\" id=\"id_home_text_registro\"> <p class=\".btnMenuReg\">Registrate</p> <p id=\"loginErrorGoogle\"></p> </div> </div> </div> </section> ');
  });

  test('Precionar Boton de SingUP', () => {
    
    const obj_boton_singup = document.getElementById('id_home_text_registro');
    obj_boton_singup.addEventListener('click', fnPageSignUp);
    obj_boton_singup.click();
    expect(obj_main.innerHTML.replace(/(<.*?>)|\s+/g, (m, $1) => $1 ? $1 : ' ')).toBe('<section class=\"page_home\"> <p class=\"subtitle\"> Unete a la comunidad más grande de desarrolladores!!! </p> <div class=\"home_content_login\"> <div class=\"home_box_img_stickers\"> <img class=\"home_img_stickers\" src=\"https://anasofiamoreno.github.io/CDMX011-SocialDev/img/stickers.jpeg\"> </div> <div class=\"home_box_login\"> <input type=\"button\" class=\"home_btn_login\" id=\"id_home_btn_login\" value=\"LogIn\"> <input type=\"button\" class=\"home_btn_login_google\" id=\"id_home_btn_login_google\" value=\"Cuenta de Google\"> <p class=\"home_text_01\">¿Aun no tienes cuenta?</p> <div class=\"home_text_02\" id=\"id_home_text_registro\"> <p class=\".btnMenuReg\">Registrate</p> <p id=\"loginErrorGoogle\"></p> </div> </div> </div> </section> ');
  });

  test('Direccion singup en barra de direcciones', () => {
    expect(window.location.pathname).toBe('/singup');
  });
});
