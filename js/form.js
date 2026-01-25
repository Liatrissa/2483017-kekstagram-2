import { isEscapeKey } from './util.js';
import { pristine } from './validate-form.js';
import { initScale, resetScale} from './scale-picture.js';
import { initEffects, resetEffects, updateEffectPreviews } from './image-effects.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const DEFAULT_PREVIEW = 'img/upload-default-image.jpg';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...',
};

const uploadForm = document.querySelector('#upload-select-image');
const uploadInput = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__overlay');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagsInput = document.querySelector('.text__hashtags');
const descriptionInput = document.querySelector('.text__description');
const submitButton = uploadForm.querySelector('#upload-submit');
const previewImage = document.querySelector('.img-upload__preview img');

let currentObjectUrl = null;

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
    const file = uploadInput.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

    if (!matches) {
      uploadInput.value = '';
      return;
    }

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);

    previewImage.src = currentObjectUrl;

    form.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onEscapeKeydown);

    initScale();
    initEffects();
    updateEffectPreviews(currentObjectUrl);
  });

  setUploadFormSubmit();
};

function closeForm () {
  form.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadInput.value = '';
  document.removeEventListener('keydown', onEscapeKeydown);

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  previewImage.src = DEFAULT_PREVIEW;

  uploadForm.reset();
  pristine.reset();
  resetScale();
  resetEffects();
  updateEffectPreviews(DEFAULT_PREVIEW);
}

cancelButton.addEventListener('click', closeForm);

export { initForm, closeForm };
