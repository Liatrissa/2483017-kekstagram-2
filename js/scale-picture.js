const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

let currentScale = DEFAULT_SCALE;
let scaleControlSmallerElement = null;
let scaleControlBiggerElement = null;
let scaleControlValueElement = null;
let imagePreviewElement = null;
let isScaleInited = false;

const updateScale = (value) => {
  currentScale = value;
  scaleControlValueElement.value = `${value}%`;
  imagePreviewElement.style.transform = `scale(${value / MAX_SCALE})`;
};

const onSmallerButtonClick = () => {
  if (currentScale > MIN_SCALE) {
    updateScale(currentScale - SCALE_STEP);
  }
};

const onBiggerButtonClick = () => {
  if (currentScale < MAX_SCALE) {
    updateScale(currentScale + SCALE_STEP);
  }
};

const resetScale = () => {
  updateScale(DEFAULT_SCALE);
};

const initScale = () => {
  scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
  scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
  scaleControlValueElement = document.querySelector('.scale__control--value');
  imagePreviewElement = document.querySelector('.img-upload__preview img');

  if (!isScaleInited) {
    scaleControlSmallerElement.addEventListener('click', onSmallerButtonClick);
    scaleControlBiggerElement.addEventListener('click', onBiggerButtonClick);
    isScaleInited = true;
  }

  resetScale();
};
export { initScale, resetScale };
