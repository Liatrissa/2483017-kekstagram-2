const ErrorMessage = {
  INVALID: 'Введён невалидный хэштег',
  COUNT: 'Превышено количество хэштегов',
  REPEAT: 'Хэштеги повторяются',
};

const MAX_HASHTAGS = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_REGEX = /^#[a-za-яё0-9]{1,19}$/i;

const uploadFormElement = document.querySelector('.img-upload__form');
const hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
const descriptionInputElement = document.querySelector('.text__description');

const pristine = new Pristine(uploadFormElement, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
});

const getHashtags = (value) => value?.trim().split(' ').filter((item) => !!item) ?? [];

const isValidHashtags = (value) => {
  const hashtags = getHashtags(value);
  return hashtags.every((item) => HASHTAG_REGEX.test(item));
};

const isValidCountHashtags = (value) => getHashtags(value).length <= MAX_HASHTAGS;

const isUniqueHashtags = (value) => {
  const hashtags = getHashtags(value).map((item) => item.toLowerCase());
  return hashtags.length === (new Set(hashtags)).size;
};

const validateHashtags = (value) => isValidHashtags(value) && isValidCountHashtags(value) && isUniqueHashtags(value);

const getErrorText = (value) => {
  if (!isValidHashtags(value)) {
    return ErrorMessage.INVALID;
  }

  if (!isValidCountHashtags(value)) {
    return ErrorMessage.COUNT;
  }

  if (!isUniqueHashtags(value)) {
    return ErrorMessage.REPEAT;
  }

  return 'Ошибка';
};

pristine.addValidator(hashtagsInputElement, validateHashtags, getErrorText);

pristine.addValidator(
  descriptionInputElement,
  (value) => value.length <= MAX_COMMENT_LENGTH,
  `Максимум ${MAX_COMMENT_LENGTH} символов`
);

export { pristine };
