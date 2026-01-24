import { openBigPicture } from './big-picture.js';

const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const containerPictures = document.querySelector('.pictures');

const renderPictures = (photos) => {
  const oldPictures = containerPictures.querySelectorAll('.picture');
  oldPictures.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const picture = templatePicture.cloneNode(true);
    const image = picture.querySelector('.picture__img');

    image.src = photo.url;
    image.alt = photo.description;

    picture.querySelector('.picture__comments').textContent = photo.comments.length;
    picture.querySelector('.picture__likes').textContent = photo.likes;

    picture.addEventListener('click', () => {
      openBigPicture(photo);
    });

    fragment.appendChild(picture);
  });

  containerPictures.appendChild(fragment);
};

export { renderPictures };
