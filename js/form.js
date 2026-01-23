import { isEscapeKey } from './util.js';
import { pristine } from './validate-form.js';
import { initScale, resetScale} from './scale-picture.js';
import { initEffects, resetEffects } from './image-effects.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...',
};

const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('.img-upload__input');
const form = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('.img-upload__cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = uploadForm.querySelector('#upload-submit');

const onEscapeKeydown = (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  if (evt.defaultPrevented) {
    return;
  }

  const isMessageOpen = document.querySelector('.success') || document.querySelector('.error');
  if (isMessageOpen) {
    return;
  }

  const isInputFocused = document.activeElement === hashtagsInput || document.activeElement === descriptionInput;

  if (isInputFocused) {
    return;
  }

  closeForm();
};

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const setUploadFormSubmit = () => {
  uploadForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (!isValid) {
      return;
    }

    blockSubmitButton();

    sendData(new FormData(evt.target))
      .then(() => {
        closeForm();
        showSuccessMessage();
      })
      .catch(() => {
        showErrorMessage();
      })
      .finally(() => {
        unblockSubmitButton();
      });
  });
};

const initForm = () => {
  uploadInput.addEventListener('change', () => {
    form.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEscapeKeydown);

    initScale();
    initEffects();
  });

  setUploadFormSubmit();
};

function closeForm () {
  form.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadInput.value = '';
  document.removeEventListener('keydown', onEscapeKeydown);

  uploadForm.reset();
  pristine.reset();
  resetScale();
  resetEffects();
}

cancelButton.addEventListener('click', closeForm);

export { initForm, closeForm };
