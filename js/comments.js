const COMMENTS_COUNT = 5;

const bigPictureElement = document.querySelector('.big-picture');
const socialCommentsElement = bigPictureElement.querySelector('.social__comments');
const socialCommentTemplateElement = bigPictureElement.querySelector('.social__comment');
const commentCountElement = bigPictureElement.querySelector('.social__comment-shown-count');
const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');
const commentTotalCountElement = bigPictureElement.querySelector('.social__comment-total-count');

let totalComments = [];
let count = 0;

const renderComments = (comments) => {
  const fragment = document.createDocumentFragment();
  comments.forEach((comment) => {
    const commentTemplateElement = socialCommentTemplateElement.cloneNode(true);
    const commentAuthorElement = commentTemplateElement.querySelector('.social__picture');
    commentAuthorElement.src = comment.avatar;
    commentAuthorElement.alt = comment.name;
    commentTemplateElement.querySelector('.social__text').textContent = comment.message;

    fragment.appendChild(commentTemplateElement);
  });
  socialCommentsElement.appendChild(fragment);

  commentCountElement.textContent = count;

  if (count >= totalComments.length) {
    commentsLoaderElement.classList.add('hidden');
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }
};

const clearComments = () => {
  socialCommentsElement.innerHTML = '';
  commentTotalCountElement.textContent = '';
};

const initComments = (comments) => {
  count = Math.min(COMMENTS_COUNT, comments.length);
  totalComments = comments;
  commentTotalCountElement.textContent = comments.length;
  renderComments(totalComments.slice(0, count));
};

commentsLoaderElement.addEventListener('click', () => {
  const prevCount = count;
  count = Math.min(count + COMMENTS_COUNT, totalComments.length);
  renderComments(totalComments.slice(prevCount, count));
});

export { clearComments, initComments };
