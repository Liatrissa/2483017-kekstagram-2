import { initComments, clearComments } from './comments.js';
import { isEscapeKey } from './util.js';

const body = document.body;

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImageElement = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const descriptionElement = bigPictureElement.querySelector('.social__caption');
const closeButtonElement = bigPictureElement.querySelector('.big-picture__cancel');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    closeBigPicture();
  }
};

const openBigPicture = (photo) => {
  body.classList.add('modal-open');
  bigPictureElement.classList.remove('hidden');

  bigPictureImageElement.src = photo.url;
  bigPictureImageElement.alt = photo.description;

  likesCountElement.textContent = photo.likes;
  descriptionElement.textContent = photo.description;

  clearComments();
  initComments(photo.comments);

  document.addEventListener('keydown', onDocumentKeydown);
};

function closeBigPicture() {
  body.classList.remove('modal-open');
  bigPictureElement.classList.add('hidden');

  clearComments();
  bigPictureImageElement.src = '';
  bigPictureImageElement.alt = '';

  likesCountElement.textContent = '';
  descriptionElement.textContent = '';

  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButtonElement.addEventListener('click', () => {
  closeBigPicture();
});

export { openBigPicture };
