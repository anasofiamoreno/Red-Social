export function sendSingUp(email, password) {
  const message = firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorMessage = error.message;
      return errorMessage;
    });

  return message;
}

export function sendLogin(email, password) {
  const message = firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      const errorMessage = 'no coicide correo y contraseña';
      return errorMessage;
    });
  return message;
}

export function fnLogOutFb() {
  return firebase.auth().signOut()
    .then((message) => { return message; })
    .catch((error) => { return error; });
}

export function sendLoginGoogle(provider) {
  return firebase.auth().signInWithPopup(provider)
    .then((result) => 'Se realizo logeo con cuenta de google')
    .catch((error) => 'Hubo un error en cuanta de google');
}

export function writeFareBase(idUser, type, data) {
  let message;
  switch (type) {
    case 'namefirst': firebase.firestore().collection(idUser).doc('userInfo').set({
      name: data,
    });
      break;
    case 'name': return firebase.firestore().collection(idUser).doc('userInfo').update({
      name: data,
    })
      .then(() => {});
    case 'city': firebase.firestore().collection(idUser).doc('userInfo').update({
      city: data,
    });
      break;
    case 'work': firebase.firestore().collection(idUser).doc('userInfo').update({
      work: data,
    });
      break;
    case 'post':
      const date = new Date();
      const datePost = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

       
      firebase.firestore().collection(idUser).doc('userPost').update({
        [datePost]: {
          post: data,
          comments: "",
          likes: 0,
        }
      });
      break;
    case 'comment':
      console.log(data);
      break;

    default: message = 'Función mal definida';
}
  return message;
}

export function readfirebase(idUser, type) {
  switch (type) {
    case 'name':
      return firebase.firestore().collection(idUser).doc('userInfo').get()
        .then((doc) => doc.data().name)
        .catch((error) => {
          console.log('Error getting document:', error.message);
        });
    case 'city':
      return firebase.firestore().collection(idUser).doc('userInfo').get()
        .then((doc) => doc.data().city)
        .catch((error) => {
          console.log('Error getting document:', error.message);
        });
    case 'work':
      return firebase.firestore().collection(idUser).doc('userInfo').get()
        .then((doc) => doc.data().work)
        .catch((error) => {
          console.log('Error getting document:', error.message);
        });
    case 'img':
      return firebase.storage().ref(idUser + '/profileimg.jpg').getDownloadURL().then((url) => {
        return url;
      })
        .catch((error) => {
        // Handle any errors
        });

    default:
  }
}

export function fillposted(user){

  let posted = firebase.firestore().collection(user).doc('userPost').get()
  .then((doc) => {
    return doc.data();
  });

  return posted

}


export function fillPostedAll(){

  

}
