const DEFAULT_EFFECT = 'none';
const DEFAULT_SLIDER_MIN = 0;
const DEFAULT_SLIDER_MAX = 100;
const DEFAULT_SLIDER_START = 100;
const DEFAULT_SLIDER_STEP = 1;
const DEFAULT_EFFECT_VALUE = 0;

const EFFECTS = {
  none: {
    filter: DEFAULT_EFFECT,
    unit: '',
    min: DEFAULT_SLIDER_MIN,
    max: DEFAULT_SLIDER_MAX,
    step: DEFAULT_SLIDER_STEP,
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

let imagePreviewElement = null;
let effectLevelSliderElement = null;
let effectLevelValueElement = null;
let effectLevelContainerElement = null;
let effectsRadioButtonElements = null;
let currentEffect = DEFAULT_EFFECT;
let effectsPreviewElements = null;
let isSliderUpdateBound = false;
let isEffectsBound = false;

const isSliderReady = () => effectLevelSliderElement && effectLevelSliderElement.noUiSlider !== undefined;

const createSlider = () => {
  if (!effectLevelSliderElement) {
    return;
  }

  noUiSlider.create(effectLevelSliderElement, {
    range: {
      min: DEFAULT_SLIDER_MIN,
      max: DEFAULT_SLIDER_MAX,
    },
    start: DEFAULT_SLIDER_START,
    step: DEFAULT_SLIDER_STEP,
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
    effectLevelSliderElement.noUiSlider.updateOptions({
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
  if (!imagePreviewElement || !effectLevelValueElement) {
    return;
  }

  const config = EFFECTS[effect];

  if (effect === DEFAULT_EFFECT) {
    imagePreviewElement.style.filter = config.filter;
    effectLevelValueElement.value = '';
    return;
  }

  imagePreviewElement.style.filter = `${config.filter}(${value}${config.unit})`;
  effectLevelValueElement.value = value;
};

const toggleSliderVisibility = (show) => {
  if (!effectLevelContainerElement) {
    return;
  }

  if (show) {
    effectLevelContainerElement.classList.remove('hidden');
  } else {
    effectLevelContainerElement.classList.add('hidden');
  }
};

const updateEffectPreviews = (url) => {
  effectsPreviewElements.forEach((preview) => {
    preview.style.backgroundImage = `url(${url})`;
  });
};

const onEffectsRadioButtonChange = (evt) => {
  currentEffect = evt.target.value;

  if (currentEffect === DEFAULT_EFFECT) {
    toggleSliderVisibility(false);
    applyEffect(DEFAULT_EFFECT, DEFAULT_EFFECT_VALUE);
    return;
  }

  toggleSliderVisibility(true);
  updateSlider(currentEffect);

  const config = EFFECTS[currentEffect];
  applyEffect(currentEffect, config.max);
};

const onEffectLevelSliderUpdate = () => {
  if (isSliderReady()) {
    const value = effectLevelSliderElement.noUiSlider.get();
    applyEffect(currentEffect, value);
  }
};

const resetEffects = () => {
  currentEffect = DEFAULT_EFFECT;
  const noneEffectRadioElement = document.querySelector('#effect-none');
  if (noneEffectRadioElement) {
    noneEffectRadioElement.checked = true;
  }
  applyEffect(DEFAULT_EFFECT, DEFAULT_EFFECT_VALUE);
  toggleSliderVisibility(false);

  if (isSliderReady()) {
    effectLevelSliderElement.noUiSlider.set(DEFAULT_SLIDER_START);
  }
};

const initEffects = () => {
  imagePreviewElement = document.querySelector('.img-upload__preview img');
  effectLevelSliderElement = document.querySelector('.effect-level__slider');
  effectLevelValueElement = document.querySelector('.effect-level__value');
  effectLevelContainerElement = document.querySelector('.img-upload__effect-level');
  effectsRadioButtonElements = document.querySelectorAll('.effects__radio');
  effectsPreviewElements = document.querySelectorAll('.effects__preview');

  if (!isSliderReady()) {
    createSlider();
  }

  if (isSliderReady() && !isSliderUpdateBound) {
    effectLevelSliderElement.noUiSlider.on('update', onEffectLevelSliderUpdate);
    isSliderUpdateBound = true;
  }

  if (!isEffectsBound) {
    effectsRadioButtonElements.forEach((radio) => {
      radio.addEventListener('change', onEffectsRadioButtonChange);
    });
    isEffectsBound = true;
  }

  toggleSliderVisibility(false);
};

export { initEffects, resetEffects, updateEffectPreviews };
