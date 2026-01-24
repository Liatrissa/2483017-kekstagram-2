import { getData } from './api.js';
import { renderPictures } from './pictures.js';
import { initForm } from './form.js';
import { showDataErrorMessage } from './messages.js';
import { initFilters } from './filters.js';

const initApp = () => {
  initForm();

  getData()
    .then((photos) => {
      renderPictures(photos);
      initFilters(photos);
    })
    .catch(() => {
      showDataErrorMessage();
    });
};

initApp();
