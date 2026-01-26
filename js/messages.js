import { isEscapeKey } from './util.js';

const DATA_ERROR_SHOW_TIME = 5000;

const showDataErrorMessage = () => {
  const templateElement = document.querySelector('#data-error');

  if (!templateElement) {
    return;
  }

  const dataErrorElement = templateElement.content.querySelector('.data-error').cloneNode(true);

  document.body.append(dataErrorElement);

  setTimeout(() => {
    dataErrorElement.remove();
  }, DATA_ERROR_SHOW_TIME);
};

const showMessage = (templateId, innerSelector, buttonSelector) => {
  const templateElement = document.querySelector(templateId);
  if (!templateElement) {
    return;
  }

  const messageElement = templateElement.content.firstElementChild.cloneNode(true);
  const innerElement = messageElement.querySelector(innerSelector);
  const buttonElement = messageElement.querySelector(buttonSelector);

  document.body.append(messageElement);

  const close = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown, true);
    document.removeEventListener('click', onDocumentClick, true);
  };

  function onDocumentKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      close();
    }
  }

  function onDocumentClick(evt) {
    if (innerElement.contains(evt.target)) {
      return;
    }
    close();
  }

  const onMessageCloseButtonClick = () => {
    close();
  };

  buttonElement.addEventListener('click', onMessageCloseButtonClick);

  document.addEventListener('keydown', onDocumentKeydown, true);
  document.addEventListener('click', onDocumentClick, true);
};

const showSuccessMessage = () => {
  showMessage('#success', '.success__inner', '.success__button');
};

const showErrorMessage = () => {
  showMessage('#error', '.error__inner', '.error__button');
};

export { showDataErrorMessage, showSuccessMessage, showErrorMessage };
