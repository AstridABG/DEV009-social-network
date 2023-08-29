/* eslint-disable */
import { logOut, createPost, addLike, dismissLikesbyUid, getPostsOrderByDateTime } from '../lib/index';
import { auth } from '../firebase/initializeFirebase';

function wall(navigateTo) {
  const sectionWall = document.createElement('section');
  sectionWall.id = 'timeLine';

  const header = document.createElement('header');
  header.id = 'headerWall';

  const logoWall = document.createElement('img');
  logoWall.id = 'logoWall';
  logoWall.src = 'img/logo.png';
  /* -------------------------------menu desplegable------------------------------- */
  const logOutButton = document.createElement('button');
  logOutButton.id = 'logOut';
  logOutButton.title = 'Cerrar sesion';
  logOutButton.addEventListener('click', () => {
    logOut(auth);
    navigateTo('/login');
  });
  /*-----------------------------------Input caja de texto para publicacion----------------------- */
  const divNewPost = document.createElement('div');
  divNewPost.id = 'newPostArea';
  const inputNewPost = document.createElement('input');
  inputNewPost.id = 'newPost';
  inputNewPost.type = 'text';
  inputNewPost.placeholder = '¿Qué te inspiró hoy?';
  const buttonPublishNewPost = document.createElement('button');
  buttonPublishNewPost.id = 'buttonPublish';
  buttonPublishNewPost.innerText = 'Publicar';
  const imgSend = document.createElement('img');
  imgSend.classList = 'sendIcon';
  imgSend.src = 'img/enviar.png';
  buttonPublishNewPost.appendChild(imgSend);
  // con esta instrucción, publica y de inmediato se muestra en el muro la publicación
  buttonPublishNewPost.addEventListener('click', async () => {
    // crea un nuevo post
    createPost(inputNewPost.value);
    // muestra todos los posts
    inputNewPost.value = '';
    loadAllPostStart();
  });

  divNewPost.append(inputNewPost, buttonPublishNewPost);
  /* -----------------------------------Cajas para despligue de publicaciones------------------- */
  const divAllPosts = document.createElement('div');
  divAllPosts.id = 'allPosts';
  const divPost = document.createElement('div');
  divPost.id = 'divPost';
  divAllPosts.appendChild(divPost);

  const postList = (list) => {
    console.log('dibujando');
    divAllPosts.innerHTML = '';
    list.forEach(doc => {
      const content = document.createElement('div');
      content.classList.add('postContent');
      let likeCount = 0;
      let userLikePost = 0;

      if (doc.data().likeCount !== 0) {
        if (doc.data().likeCount.includes(auth.currentUser.uid)) {
          userLikePost = 1;
        }
        likeCount = doc.data().likeCount.length;
      }

      content.innerHTML = `  
      <div class="postHeader" id = ${doc.id}>
        <img src="./img/user.png" id="iconoLogo" alt="user-img" class="user-img">
        <div class="postHeaderUserInfo">
        ${doc.data().userDisplayName} <span>${doc.data().userEmail}</span>
        <p>${doc.data().post}</p>
        </div>
      </div>
      <div class="counters">
        <div class="comments">
        <svg class="commentIcon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
        <div class="comment-count">${doc.data().comments}</div>
      </div>
        <div class="likes">
        <svg  class="likeIcon" width="20" height="20" viewBox="0 0 24 24" fill="${userLikePost > 0 ? "red" : "none"}"  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="likeIcon"  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        <div class="likes-count">
        ${likeCount}
        </div>
      </div>
      </div>`;
      content.addEventListener('click', async (e) => {
        console.log(doc.data().likeCount);
        console.log(auth.currentUser.uid);
        e.preventDefault();
        if (e.target.classList.contains('likeIcon')) {
          if ((doc.data().likeCount === 0) || (!doc.data().likeCount.includes(auth.currentUser.uid))) {
            console.log(doc.data().uidUser);
            addLike(doc.id).then(() => loadAllPostStart());
          }
          else {
            const likeActualizados = doc.data().likeCount.filter(like => like !== auth.currentUser.uid);
            console.log(likeActualizados);
            dismissLikesbyUid(doc.id, likeActualizados).then(() => loadAllPostStart());
          }
        }
        //loadAllPostStart();
      });
      divAllPosts.appendChild(content);
    });
  };

  // código que carga todos los posts al inicio, se están reultizando métodos
  const loadAllPostStart = async () => {
    // const postJSON = await getAllPosts();
    const allPosts = await getPostsOrderByDateTime();
    // const allPosts = await getAllPosts();
    // console.log(allPosts);
    postList(allPosts);
    // console.log(postJSON);
  };
  // esta función hace que se carguen todos los posts al inicio
  loadAllPostStart();

  sectionWall.append(header, divNewPost, divAllPosts);
  header.append(logoWall, logOutButton);
  return sectionWall;
}
export default wall;
