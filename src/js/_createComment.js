const Handlebars = require('handlebars');

function $(selector) {
  return document.querySelector(selector);
}

class newComment {
  constructor(container) {
    this.container = container;
    this.active = false;

    this.closeBtnClassName = 'comment-form__close-button';

    this.createTemplates();
    this.watch();
  }

  createTemplates() {
    const commentFormTemplate = $('#comment-form--template').innerHTML;
    this.commentFormTemplate = Handlebars.compile(commentFormTemplate);
  }

  watch() {
    this.container.addEventListener('click', this.createInput.bind(this));
  }

  createInput(el) {
    if (el.target !== this.container) return;
    if (this.active) {
      this.removeInputs();
      return;
    }

    const clickOffset = this.getOffset(el);
    const containerWidth = this.container.offsetWidth;
    const containerHeight = this.container.offsetHeight;

    const data = {
      leftPercentage: clickOffset.x * 100 / containerWidth,
      topPercentage: clickOffset.y * 100 /containerHeight
    };

    const commentForm = this.commentFormTemplate(data);
    this.formElement = document.createElement('div');
    this.formElement.innerHTML = commentForm;
    this.container.insertBefore(this.formElement, this.container.childNodes[0]);
    this.active = true;

    $(`.${this.closeBtnClassName}`).addEventListener('click', this.removeInputs.bind(this));
  }

  removeInputs(e) {
    if (e) e.preventDefault();
    if (this.formElement) this.formElement.parentNode.removeChild(this.formElement);
    this.active = false;
  }

  getOffset(evt) {
    let el = evt.target;
    let x = 0;
    let y = 0;

    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft;
      y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
    }

    x = evt.clientX - x;
    y = evt.clientY - y;

    return {x: x, y: y};
  }
}

module.exports = newComment;
