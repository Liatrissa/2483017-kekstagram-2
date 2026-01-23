import { isEscapeKey } from './util.js';

const DATA_ERROR_SHOW_TIME = 5000;

const showDataErrorMessage = () => {
  const template = document.querySelector('#data-error');

  if (!template) {
    return;
  }

  const dataErrorElement = template.content.querySelector('.data-error').cloneNode(true);

  document.body.append(dataErrorElement);

  setTimeout(() => {
    dataErrorElement.remove();
  }, DATA_ERROR_SHOW_TIME);
};

const showMessage = (templateId, innerSelector, buttonSelector) => {
  const template = document.querySelector(templateId);
  if (!template) {
    return;
  }

  const messageElement = template.content.firstElementChild.cloneNode(true);
  const inner = messageElement.querySelector(innerSelector);
  const button = messageElement.querySelector(buttonSelector);

  document.body.append(messageElement);

  const close = () => {
    messageElement.remove();
    document.removeEventListener('keydown', onKeydown, true);
    document.removeEventListener('click', onOutsideClick, true);
  };

  function onKeydown(evt) {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      evt.stopImmediatePropagation();
      close(messageElement);
    }
  }

  function onOutsideClick(evt) {
    if (inner.contains(evt.target)) {
      return;
    }
    close(messageElement);
  }

  button.addEventListener('click', close);

  document.addEventListener('keydown', onKeydown, true);
  document.addEventListener('click', onOutsideClick, true);
};

const showSuccessMessage = () => {
  showMessage('#success', '.success__inner', '.success__button');
};

const showErrorMessage = () => {
  showMessage('#error', '.error__inner', '.error__button');
};

export { showDataErrorMessage, showSuccessMessage, showErrorMessage};
