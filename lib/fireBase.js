

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
      const errorMessage = 'No coinciden correo ó contraseña';
      return errorMessage;
    });
  return message;
}

export function fnLogOutFb() {
  return firebase.auth().signOut()
    .then((message) => {  return message; })
    .catch((error) => { return error; });
}

export function sendLoginGoogle(provider) {
  return firebase.auth().signInWithPopup(provider)
    .then((result) => {
      writeFareBase(result.user.uid, 'namefirst', result.user.displayName)
    })
    .catch((error) => 'Hubo un error en cuanta de google');
}

export function writeFareBase(idUser, type, data) {
  let message;
  let datadif = 0;
  let  datePost = 0 ;
  const date = new Date();
  switch (type) {
    case 'namefirst': firebase.firestore().collection(idUser).doc('userInfo').set({
      name: data,
      city: '',
      work: '',

    });
    firebase.firestore().collection(idUser).doc("userPost").set({
    });
    firebase.firestore().collection('userList').doc('list').update({
      [idUser]: idUser,
    });

    fetch("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
      .then((res) => res.blob()) // Gets the response and returns it as a blob
      .then((blob) => {
        firebase.storage().ref(idUser + '/profileimg.jpg').put(blob);
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
      datePost = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();

       
      firebase.firestore().collection(idUser).doc('userPost').update({
        [datePost]: {
          post: data,
          comments: "",
          likes: 0,
        }
      });
      break;
    case 'editpost':
    datadif = data.split('$-$');
    const ref = datadif[0] + '.post';
       
    firebase.firestore().collection(idUser).doc('userPost').update({
      [ref]: datadif[1],
    });

      break;
    case 'deletepost':
      firebase.firestore().collection(idUser).doc('userPost').update({
        [data] : firebase.firestore.FieldValue.delete(),
      })
      break;
    case 'comment':
      datadif = data.split("$-$");
      datePost = date.getDate()+'-'+(date.getMonth()+1)+'-'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
      const refcomment = datadif[1] + '.comments.' + [datePost] + '.comment';
      const refcommentuser = datadif[1] + '.comments.' + [datePost] + '.user';

      return firebase.firestore().collection(datadif[0]).doc('userPost').update({
        [refcomment] : datadif[2],
        [refcommentuser] : idUser,
      })
      console.log(data);
      break;

    default: message = 'Función mal definida';
}
  return 'ok';
}

export function readfirebase(idUser, type, data) {
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
      case 'like':
        return firebase.firestore().collection(idUser).doc('userPost').get()
          .then((doc) => Object.values(doc.data()[data].likes))
          .catch((error) => {
            console.log('Error getting document:', error.message);
          });

    default:
  }
}

export function fillPosted(user){

  return firebase.firestore().collection(user).doc('userPost').get()
  .then((doc) => {
    return doc.data();
  });
    
}

export function getUsersFireBase() {
  return firebase.firestore().collection('userList').doc('list').get()
  .then((docs) => {
    const idusers = Object.values(docs.data());
    return idusers
  });
}

export function fnMakeLike(userToGetLike, userToSetLike, post){  //--Funcion para dar like a publicacion
  
  const refToSetLike = [post.slice(4)] + '.likes.' + userToSetLike;
  
  let likes = 0;

  return firebase.firestore().collection(userToGetLike).doc('userPost').get()
  .then((ss) => {

    if(ss.data()[post.slice(4)].likes[userToSetLike]){
      return firebase.firestore().collection(userToGetLike).doc('userPost').update({
       [refToSetLike] : firebase.firestore.FieldValue.delete(),
      }).then(() => {
        return firebase.firestore().collection(userToGetLike).doc('userPost').get()
        .then((doc) => {
          Object.values(doc.data()[post.slice(4)].likes).map(function (counlikes){
            likes += counlikes;
          });
          return likes
          
        });
      });
      
    }
    else{
      return firebase.firestore().collection(userToGetLike).doc('userPost').update({
        [refToSetLike] : 1,
      })
      .then(() => {
    
        return firebase.firestore().collection(userToGetLike).doc('userPost').get()
        .then((doc) => {
          Object.values(doc.data()[post.slice(4)].likes).map(function (counlikes){
            likes += counlikes;
          });
          return likes
          
        });
    
    
      });
    };

  });

  

}

export function fnMakeLike2(userToGetLike, userToSetLike, post){  //--Funcion para dar like a publicacion
  
  const refToSetLike = [post.slice(4)] + '.likes.' + userToSetLike;
  let likes = 0;

  

  return firebase.firestore().collection(userToGetLike).doc('userPost').update({
    [refToSetLike] : 1,
  })
  .then(() => {

    return firebase.firestore().collection(userToGetLike).doc('userPost').get()
    .then((doc) => {
      Object.values(doc.data()[post.slice(4)].likes).map(function (counlikes){
        likes += counlikes;
      });
      return likes
      
    });


  });

}

