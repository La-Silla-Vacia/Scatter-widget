/*global comentarios:true*/
/*eslint no-undef: "error"*/

const Handlebars = require('handlebars');
const createComment = require('./_createComment');

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.prototype.slice.apply(document.querySelectorAll(selector));
}

class app {
  constructor() {
    this.comments = {};
    this.commentPoints = [];
    this.commentPointsContainer = $('.grid__comments');
    this.commentPointActiveClass = 'comments__point--active';

    this.commentContainer = $('.comments');

    if (typeof(comentarios) === "object") {
      this.comments = comentarios.comments;
      this.createTemplates();
      this.drawCommentsOnGrid();

      this.createComments = new createComment(this.commentPointsContainer);
    }
  }

  createTemplates() {
    const commentPointTemplate = $('#comment-point--template').innerHTML;
    this.commentPointTemplate = Handlebars.compile(commentPointTemplate);

    const commentTemplate = $('#comment--template').innerHTML;
    this.commentTemplate = Handlebars.compile(commentTemplate);
  }

  drawCommentsOnGrid() {
    this.createCommentPoints();
    this.placeCommentPoints();
    this.watchCommentPoints();
  }

  createCommentPoints() {
    this.comments.map((el, index) => {
      if (el.comentario !== '') {
        const gridNumber = this.stringToNumber(el.grid);
        const gridRow = Math.floor(gridNumber / 70) + 1;

        const topPercentage = gridRow * 100 / 40;
        const leftPercentage = (gridNumber - ((gridRow - 1) * 70)) * 100 / 70;

        el.topPercentage = topPercentage;
        el.leftPercentage = leftPercentage;
        el.id = index;

        const commentPoint = this.commentPointTemplate(el);
        let newElement = document.createElement('div');
        newElement.innerHTML = commentPoint;
        this.commentPoints.push(newElement.childNodes[1]);
      }
    });
  }

  placeCommentPoints() {
    this.commentPoints.map((el) => {
      // this.commentPointsContainer.innerHTML = el;
      this.commentPointsContainer.insertBefore(el, this.commentPointsContainer.childNodes[0]);
    });
  }

  watchCommentPoints() {
    this.commentPoints.map((el) => {
      el.addEventListener('click', this.toggleCommentPoint.bind(this));
    });
  }

  toggleCommentPoint(el) {
    $$(`.${this.commentPointActiveClass}`).map((el) => {
      el.classList.remove(this.commentPointActiveClass);
    });

    const thisCommentPoint = el.target;

    thisCommentPoint.classList.add(this.commentPointActiveClass);

    const commentId = thisCommentPoint.getAttribute('data-id');
    const comment = this.comments[commentId];
    this.showComment(comment);
  }

  showComment(data) {
    const comment = this.commentTemplate(data);
    this.commentContainer.innerHTML = comment;
  }

  stringToNumber(string) {
    return parseFloat(string.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d\.]/g, ''));
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new app();
});