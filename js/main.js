import { createPhotos } from './create-photos.js';
import { renderPictures } from './pictures.js';
import { initForm } from './form.js';
import './validate-form.js';


const photos = createPhotos();
renderPictures(photos);
initForm();
