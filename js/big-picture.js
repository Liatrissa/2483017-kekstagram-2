import { initComments, ClearComments } from './comments.js';
import { isEscapeKey } from './util.js';

const body = document.body;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImage = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const description = bigPicture.querySelector('.social__caption');
const cancelButton = bigPicture.querySelector('.big-picture__cancel');

const onEscapeKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
};

const openBigPicture = (photo) => {
  body.classList.add('modal-open');
  bigPicture.classList.remove ('hidden');

  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;

  likesCount.textContent = photo.likes;
  description.textContent = photo.description;

  ClearComments();
  initComments(photo.comments);

  document.addEventListener('keydown', onEscapeKeydown);
};

function closeBigPicture () {
  body.classList.remove('modal-open');
  bigPicture.classList.add ('hidden');

  ClearComments();
  bigPictureImage.src = '';
  bigPictureImage.alt = '';

  likesCount.textContent = '';
  description.textContent = '';

  document.removeEventListener('keydown', onEscapeKeydown);
}

cancelButton.addEventListener('click', () => {
  closeBigPicture();
});

export { openBigPicture };
