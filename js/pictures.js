import { openBigPicture } from './big-picture.js';

const pictureTemplateElement = document.querySelector('#picture').content.querySelector('.picture');
const picturesContainerElement = document.querySelector('.pictures');

const renderPictures = (photos) => {
  const oldPictureElements = picturesContainerElement.querySelectorAll('.picture');
  oldPictureElements.forEach((picture) => picture.remove());

  const fragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = pictureTemplateElement.cloneNode(true);
    const pictureImageElement = pictureElement.querySelector('.picture__img');

    pictureImageElement.src = photo.url;
    pictureImageElement.alt = photo.description;

    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;

    pictureElement.addEventListener('click', () => {
      openBigPicture(photo);
    });

    fragment.appendChild(pictureElement);
  });

  picturesContainerElement.appendChild(fragment);
};

export { renderPictures };
