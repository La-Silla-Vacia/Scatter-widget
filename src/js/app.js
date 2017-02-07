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
    this.commentPointData = [];
    this.commentPointsContainer = $('.grid__comments');
    this.commentPointActiveClass = 'comments__point--active';

    this.commentContainer = $('.comments');

    if (typeof(comentarios) === "object") {
      this.comments = comentarios.comments;
      this.createTemplates();
      this.drawCommentsOnGrid();

      this.createComments = new createComment(this.commentPointsContainer);

      this.startAnimating();
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
        this.commentPointData.push(el);
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
    this.removeActiveClass();
    this.commentContainer.classList.remove('comments--hide');

    clearInterval(this.interval);

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

  removeActiveClass() {
    $$(`.${this.commentPointActiveClass}`).map((el) => {
      el.classList.remove(this.commentPointActiveClass);
    });
  }

  stringToNumber(string) {
    return parseFloat(string.replace(/\./g, '').replace(/,/g, '.').replace(/[^\d\.]/g, ''));
  }

  startAnimating() {
    const animDuration = 5000;
    const numberOfComments = this.commentPoints.length;
    let currentComment = 0;
    this.showComment(this.commentPoints[currentComment]);
    $(`button[data-id="${currentComment + 1}"]`).classList.add(this.commentPointActiveClass);
    currentComment += 1;

    this.interval = setInterval(() => {
      this.commentContainer.classList.remove('comments--hide');
      this.commentPoints[currentComment].classList.add(this.commentPointActiveClass);
      console.log(this.commentPointData[currentComment]);
      this.showComment(this.commentPointData[currentComment]);
      if (currentComment === numberOfComments - 1) {
        currentComment = 0;
      } else {
        currentComment++;
      }

      setTimeout(() => {
        this.commentContainer.classList.add('comments--hide');
        this.removeActiveClass();
      }, animDuration - 250);
    }, animDuration);

  }
}

document.addEventListener("DOMContentLoaded", function () {
  new app();
});