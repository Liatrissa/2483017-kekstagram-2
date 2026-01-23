const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;
let scaleControlSmaller = null;
let scaleControlBigger = null;
let scaleControlValue = null;
let imagePreview = null;

const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onSmallerButtonClick = () => {
  if (currentScale > MIN_SCALE) {
    updateScale(currentScale - SCALE_STEP, scaleControlValue, imagePreview);
  }
};

const onBiggerButtonClick = () => {
  if (currentScale < MAX_SCALE) {
    updateScale(currentScale + SCALE_STEP, scaleControlValue, imagePreview);
  }
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE, scaleControlValue, imagePreview);
};

const initScale = () => {
  scaleControlSmaller = document.querySelector('.scale__control--smaller');
  scaleControlBigger = document.querySelector('.scale__control--bigger');
  scaleControlValue = document.querySelector('.scale__control--value');
  imagePreview = document.querySelector('.img-upload__preview img');

  scaleControlSmaller.addEventListener('click', onSmallerButtonClick);
  scaleControlBigger.addEventListener('click', onBiggerButtonClick);

  resetScale();
};
export { initScale, resetScale };
