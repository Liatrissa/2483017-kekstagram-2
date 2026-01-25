import { renderPictures } from './pictures.js';
import { debounce } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const RERENDER_DELAY = 500;

const FilterId = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filtersSectionElement = document.querySelector('.img-filters');
const filtersFormElement = document.querySelector('.img-filters__form');
const filterButtonElements = filtersFormElement.querySelectorAll('.img-filters__button');

let originalPhotos = [];

const showFilters = () => {
  filtersSectionElement.classList.remove('img-filters--inactive');
};

const setActiveButton = (activeId) => {
  filterButtonElements.forEach((button) => {
    button.classList.toggle('img-filters__button--active', button.id === activeId);
  });
};

const getRandomPhotos = (photos) => {
  const shuffledPhotos = photos.slice();

  for (let i = shuffledPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPhotos[i], shuffledPhotos[j]] = [shuffledPhotos[j], shuffledPhotos[i]];
  }

  return shuffledPhotos.slice(0, RANDOM_PHOTOS_COUNT);
};

const getDiscussedPhotos = (photos) =>
  photos.slice().sort((a, b) => b.comments.length - a.comments.length);

const applyFilter = (filterId) => {
  let photosToRender = originalPhotos.slice();

  if (filterId === FilterId.RANDOM) {
    photosToRender = getRandomPhotos(originalPhotos);
  } else if (filterId === FilterId.DISCUSSED) {
    photosToRender = getDiscussedPhotos(originalPhotos);
  }

  renderPictures(photosToRender);
};

const applyFilterDebounced = debounce(applyFilter, RERENDER_DELAY);

const onFiltersFormClick = (evt) => {
  const button = evt.target.closest('.img-filters__button');
  if (!button) {
    return;
  }

  if (
    button.classList.contains('img-filters__button--active') &&
    button.id !== FilterId.RANDOM
  ) {
    return;
  }
  setActiveButton(button.id);

  applyFilterDebounced(button.id);
};

const initFilters = (photos) => {
  originalPhotos = photos.slice();
  showFilters();
  filtersFormElement.addEventListener('click', onFiltersFormClick);
};

export { initFilters };
