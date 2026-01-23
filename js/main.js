import { getData } from './api.js';
import { renderPictures } from './pictures.js';
import { initForm } from './form.js';
import { showDataErrorMessage } from './messages.js';

const initApp = () => {
  initForm();

  getData()
    .then((photos) => {
      renderPictures(photos);
    })
    .catch(() => {
      showDataErrorMessage();
    });
};

initApp();
