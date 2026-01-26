import { isEscapeKey } from './util.js';
import { pristine } from './validate-form.js';
import { initScale, resetScale } from './scale-picture.js';
import { initEffects, resetEffects, updateEffectPreviews } from './image-effects.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];
const DEFAULT_PREVIEW = 'img/upload-default-image.jpg';

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Отправляю...',
};

const uploadFormElement = document.querySelector('#upload-select-image');
const uploadFileInputElement = document.querySelector('#upload-file');
const uploadOverlayElement = document.querySelector('.img-upload__overlay');
const uploadCancelButtonElement = document.querySelector('#upload-cancel');
const hashtagsInputElement = document.querySelector('.text__hashtags');
const descriptionInputElement = document.querySelector('.text__description');
const submitButtonElement = uploadFormElement.querySelector('#upload-submit');
const uploadPreviewImageElement = document.querySelector('.img-upload__preview img');

let currentObjectUrl = null;

const onDocumentKeydown = (evt) => {
  if (!isEscapeKey(evt)) {
    return;
  }

  if (evt.defaultPrevented) {
    return;
  }

  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  if (messageElement) {
    return;
  }

  const isInputFocused = document.activeElement === hashtagsInputElement || document.activeElement === descriptionInputElement;

  if (isInputFocused) {
    return;
  }

  closeForm();
};

const blockSubmitButton = () => {
  submitButtonElement.disabled = true;
  submitButtonElement.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButtonElement.disabled = false;
  submitButtonElement.textContent = SubmitButtonText.IDLE;
};

const setUploadFormSubmit = () => {
  uploadFormElement.addEventListener('submit', (evt) => {
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
  uploadFileInputElement.addEventListener('change', () => {
    const file = uploadFileInputElement.files[0];
    if (!file) {
      return;
    }

    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

    if (!matches) {
      uploadFileInputElement.value = '';
      return;
    }

    if (currentObjectUrl) {
      URL.revokeObjectURL(currentObjectUrl);
    }

    currentObjectUrl = URL.createObjectURL(file);

    uploadPreviewImageElement.src = currentObjectUrl;

    uploadOverlayElement.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onDocumentKeydown);

    initScale();
    initEffects();
    updateEffectPreviews(currentObjectUrl);
  });

  setUploadFormSubmit();
};

function closeForm() {
  uploadOverlayElement.classList.add('hidden');
  document.body.classList.remove('modal-open');
  uploadFileInputElement.value = '';
  document.removeEventListener('keydown', onDocumentKeydown);

  if (currentObjectUrl) {
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = null;
  }
  uploadPreviewImageElement.src = DEFAULT_PREVIEW;

  uploadFormElement.reset();
  pristine.reset();
  resetScale();
  resetEffects();
  updateEffectPreviews(DEFAULT_PREVIEW);
}

const onUploadCancelButtonClick = () => {
  closeForm();
};

uploadCancelButtonElement.addEventListener('click', onUploadCancelButtonClick);

export { initForm };
