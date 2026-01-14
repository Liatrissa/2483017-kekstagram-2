import { isEscapeKey } from './util.js';
import { pristine } from './validate-form.js';
import { initScale} from './scale-picture.js';
import { initEffects, resetEffects } from './image-effects.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('.img-upload__input');
const form = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');

const onEscapeKeydown = (evt) => {
  const isInputFocused = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;

  if (isInputFocused) {
    return;
  }

  if (isEscapeKey(evt)) {
    closeForm();
  }
};

const initForm = () => {
  uploadInput.addEventListener('change', () => {
    form.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEscapeKeydown);

    initScale();
    initEffects();
  });
};

function closeForm () {
  form.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadInput.value = '';
  document.removeEventListener('keydown', onEscapeKeydown);

  uploadForm.reset();
  pristine.reset();
  resetEffects();
}

cancelButton.addEventListener('click', closeForm);

export { initForm, closeForm };
