const EFFECTS = {
  none: {
    filter: 'none',
    unit: '',
    min: 0,
    max: 100,
    step: 1,
  },
  chrome: {
    filter: 'grayscale',
    unit: '',
    min: 0,
    max: 1,
    step: 0.1,
  },
  sepia: {
    filter: 'sepia',
    unit: '',
    min: 0,
    max: 1,
    step: 0.1,
  },
  marvin: {
    filter: 'invert',
    unit: '%',
    min: 0,
    max: 100,
    step: 1,
  },
  phobos: {
    filter: 'blur',
    unit: 'px',
    min: 0,
    max: 3,
    step: 0.1,
  },
  heat: {
    filter: 'brightness',
    unit: '',
    min: 1,
    max: 3,
    step: 0.1,
  },
};

let imagePreview = null;
let effectLevelSlider = null;
let effectLevelValue = null;
let effectLevelContainer = null;
let effectsRadioButtons = null;
let currentEffect = 'none';
let effectsPreviews = null;
let isSliderUpdateBound = false;
let isEffectsBound = false;

const isSliderReady = () => effectLevelSlider && effectLevelSlider.noUiSlider !== undefined;

const createSlider = () => {
  if (!effectLevelSlider) {
    return;
  }

  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number(value),
      from: (value) => Number(value),
    },
  });
};

const updateSlider = (effect) => {
  const config = EFFECTS[effect];

  if (isSliderReady()) {
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: config.min,
        max: config.max,
      },
      start: config.max,
      step: config.step,
    });
  }
};

const applyEffect = (effect, value) => {
  if (!imagePreview || !effectLevelValue) {
    return;
  }

  const config = EFFECTS[effect];

  if (effect === 'none') {
    imagePreview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  imagePreview.style.filter = `${config.filter}(${value}${config.unit})`;
  effectLevelValue.value = value;
};

const toggleSliderVisibility = (show) => {
  if (!effectLevelContainer) {
    return;
  }

  if (show) {
    effectLevelContainer.classList.remove('hidden');
  } else {
    effectLevelContainer.classList.add('hidden');
  }
};

const updateEffectPreviews = (url) => {
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url(${url})`;
  });
};

const onEffectChange = (evt) => {
  currentEffect = evt.target.value;

  if (currentEffect === 'none') {
    toggleSliderVisibility(false);
    applyEffect('none', 0);
    return;
  }

  toggleSliderVisibility(true);
  updateSlider(currentEffect);

  const config = EFFECTS[currentEffect];
  applyEffect(currentEffect, config.max);
};

const onSliderUpdate = () => {
  if (isSliderReady()) {
    const value = effectLevelSlider.noUiSlider.get();
    applyEffect(currentEffect, value);
  }
};

const resetEffects = () => {
  currentEffect = 'none';
  const noneRadio = document.querySelector('#effect-none');
  if (noneRadio) {
    noneRadio.checked = true;
  }
  applyEffect('none', 0);
  toggleSliderVisibility(false);

  if (isSliderReady()) {
    effectLevelSlider.noUiSlider.set(100);
  }
};

const initEffects = () => {
  imagePreview = document.querySelector('.img-upload__preview img');
  effectLevelSlider = document.querySelector('.effect-level__slider');
  effectLevelValue = document.querySelector('.effect-level__value');
  effectLevelContainer = document.querySelector('.img-upload__effect-level');
  effectsRadioButtons = document.querySelectorAll('.effects__radio');
  effectsPreviews = document.querySelectorAll('.effects__preview');

  if (!isSliderReady()) {
    createSlider();
  }

  if (isSliderReady() && !isSliderUpdateBound) {
    effectLevelSlider.noUiSlider.on('update', onSliderUpdate);
    isSliderUpdateBound = true;
  }

  if (!isEffectsBound) {
    effectsRadioButtons.forEach((radio) => {
      radio.addEventListener('change', onEffectChange);
    });
    isEffectsBound = true;
  }

  toggleSliderVisibility(false);
};

export { initEffects, resetEffects, updateEffectPreviews };
