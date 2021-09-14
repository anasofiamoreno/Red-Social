export function createBtnReg() {
  const btnMenuRegistrar = document.createElement('button');
  const divRegisterBtn = document.createElement('div');
  btnMenuRegistrar.classList.add('.btnMenuReg');
  btnMenuRegistrar.textContent = 'Registrate';
  /* btnMenuRegistrar.addEventListener('click', () => {
    const parrafo = document.createElement('p');
    parrafo.textContent = 'Prueba';
    btnMenuRegistrar.appendChild(parrafo);
    document.body.querySelector('.btnMenuReg').textContent = parrafo.outerHTML;
  }); */
  return divRegisterBtn.appendChild(btnMenuRegistrar);
}
