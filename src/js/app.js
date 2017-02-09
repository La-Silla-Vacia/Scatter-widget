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
    this.allCommentsContainer = $('.comments--all');

    if (typeof(comentarios) === "object") {
      this.comments = comentarios.comments;
      this.createTemplates();
      this.drawCommentsOnGrid();

      this.createComments = new createComment(this.commentPointsContainer);

      this.startAnimating();
      this.listVerifiedComments();
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
      if (el.comentario) {
        const gridNumber = this.stringToNumber(el.grid);
        const gridRow = Math.floor(gridNumber / 70) + 1;

        const topPercentage = gridRow * 100 / 40;
        const leftPercentage = (gridNumber - ((gridRow - 1) * 70)) * 100 / 70;

        el.topPercentage = topPercentage;
        el.leftPercentage = leftPercentage;
        el.id = index;

        if (!el.user_image) el.user_image = './images/undefined.svg';
        (el.user_type == 'influencer') ? el.user_background_image = `background-image:url("${el.user_image}");` : el.user_background_image = '';

        if (el.timestamp) {
          const dateEl = document.createElement('span');
          dateEl.classList.add('comments__comment-data');
          dateEl.innerHTML = `${this.timeConverter(el.timestamp)} — `;
          el.comment_date = `${this.timeConverter(el.timestamp)} — `;
          // el.comment_date.classList.add('comments__comment-data');
        } else {
          el.comment_date = '';
        }

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
      this.commentPointsContainer.appendChild(el);
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

  showComment(data, append) {
    if (!data.user_image) data.user_image = './images/undefined.svg';
    const comment = this.commentTemplate(data);
    if (append) {
      let newElement = document.createElement('div');
      newElement.innerHTML = comment;
      this.allCommentsContainer.appendChild(newElement);
    } else {
      this.commentContainer.innerHTML = comment;
    }
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

  listVerifiedComments() {
    this.commentPointData.map((el) => {
      if (el.user_type == 'influencer')
        this.showComment(el, true);
    });
  }

  timeConverter(UNIX_timestamp) {
    const a = new Date(UNIX_timestamp * 1000);
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const year = a.getFullYear();
    const month = months[a.getMonth()];
    const date = a.getDate();
    // const hour = a.getHours();
    // const min = a.getMinutes();
    // const sec = a.getSeconds();
    const time = date + ' ' + month + ' ' + year;
    return time;
  }

  array_flip(trans) {
    let key, tmp_ar = {};
    for (key in trans) {
      if (trans.hasOwnProperty(key)) {
        tmp_ar[trans[key]] = key;
      }
    }

    return tmp_ar;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new app();
});