"use strict";

window.onload = function () {
  var page = document.querySelector('.page');
  var templatePopup = document.querySelector('.template-popup');
  var templateNote = document.querySelector('.template-note');
  var toDo = document.querySelectorAll('.board__cell_body')[0];
  var inProgress = document.querySelectorAll('.board__cell_body')[1];
  var done = document.querySelectorAll('.board__cell_body')[2];
  var footerCount = document.querySelectorAll('.footer__count');

  function getDate(param) {
    var newDate = new Date();
    if (param === 'date') return newDate.toLocaleDateString();
    if (param === 'time') return newDate.toLocaleTimeString();
    if (param === 'full') return newDate.toLocaleDateString() + ' ' + newDate.toLocaleTimeString();
  }

  function getRandom(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  getLocaleStorage();
  document.querySelector('.footer__date').innerHTML = getDate('date');
  page.onkeydown = page.onkeyup = assignKeys;

  function assignKeys(event) {
    var popup = document.querySelector('.popup');
    if (!popup) return;
    var textField = popup.querySelector('.popup__text-field');

    if (event.key === 'Escape') {
      popup.remove();
    }

    if (event.key === ' ') {
      if (!textField) {
        return false;
      } else if (textField.matches(':focus')) {
        return;
      } else {
        return false;
      }
    }

    if (event.key === 'Enter') {
      if (!textField) {
        popup.querySelector('.popup__button-ok').onclick();
        popup.remove();
      } else if (textField.matches(':focus')) {
        return;
      } else if (textField && textField.value === '') {
        event.preventDefault();
        textField.classList.add('popup__text-field_warning');
      } else if (textField && textField.value !== '') {
        popup.querySelector('.popup__button-ok').onclick();
        popup.remove();
      }
    }
  }

  document.querySelector('.create-note').onclick = function () {
    var popupCreate = templatePopup.content.cloneNode(true).firstElementChild;
    page.append(popupCreate);
    popupCreate.querySelector('.popup__name').innerHTML = 'Creating note';
    popupCreate.querySelectorAll('.popup__headline')[0].innerHTML = 'Select note priority';
    popupCreate.querySelectorAll('.popup__headline')[1].innerHTML = 'Enter note text';
    var popupHeight = popupCreate.querySelector('.popup__content').offsetHeight / 2;
    popupCreate.querySelector('.popup__content').style.top = 'calc(40% - ' + popupHeight + 'px)';
    var textField = document.querySelector('.popup__text-field');
    var toggles = document.querySelectorAll('.popup__toggle');

    textField.onfocus = function () {
      if (this.classList.contains('popup__text-field_warning')) {
        this.classList.remove('popup__text-field_warning');
      }
    };

    popupCreate.querySelector('.popup__button-close').onclick = function () {
      popupCreate.remove();
    };

    popupCreate.querySelector('.popup__button-cancel').onclick = function () {
      popupCreate.remove();
    };

    popupCreate.querySelector('.popup__button-ok').onclick = function () {
      var pattern = /[^\s]/;

      if (textField.value === '' || !pattern.test(textField.value)) {
        textField.classList.add('popup__text-field_warning');
        return false;
      } else {
        for (var i = 0; i < toggles.length; i++) {
          if (toggles[i].checked) {
            var note = templateNote.content.cloneNode(true).firstElementChild;
            note.className += ' note_priority_' + toggles[i].value;
            note.className += ' note_state_default';
            note.querySelector('.note__tape').className += ' note__tape_angle_' + getRandom(1, 3);
            note.querySelector('.note__sticker').className += ' note__sticker_angle_' + getRandom(1, 3);
            note.querySelector('.note__sticker').innerHTML = textField.value;
            document.querySelector('.footer__count_' + toggles[i].value).innerHTML++;
            toDo.append(note);
            setLocaleStorage();
            popupCreate.remove();
          }
        }
      }
    };
  };

  function deleteNote() {
    var _this = this;

    var popupDelete = templatePopup.content.cloneNode(true).firstElementChild;
    var priority = this.parentNode.classList[1].split('_')[2];
    page.append(popupDelete);
    popupDelete.querySelector('.popup__name').innerHTML = 'Deleting note';
    popupDelete.querySelector('.popup__main').innerHTML = 'Really want to delete note?';
    popupDelete.querySelector('.popup__main').className = 'popup__main popup__main_small';
    var popupHeight = popupDelete.querySelector('.popup__content').offsetHeight / 2;
    popupDelete.querySelector('.popup__content').style.top = 'calc(40% - ' + popupHeight + 'px)';

    popupDelete.querySelector('.popup__button-close').onclick = function () {
      popupDelete.remove();
    };

    popupDelete.querySelector('.popup__button-cancel').onclick = function () {
      popupDelete.remove();
    };

    popupDelete.querySelector('.popup__button-ok').onclick = function () {
      _this.parentNode.remove();

      document.querySelector('.footer__count_' + priority).innerHTML--;
      setLocaleStorage();
      popupDelete.remove();
    };
  }

  function editNote(event) {
    var _this2 = this;

    var popupEdit = templatePopup.content.cloneNode(true).firstElementChild;
    page.append(popupEdit);
    popupEdit.querySelector('.popup__name').innerHTML = 'Changing note';
    popupEdit.querySelectorAll('.popup__headline')[0].innerHTML = 'Change note priority';
    popupEdit.querySelectorAll('.popup__headline')[1].innerHTML = 'Change note text';
    var popupHeight = popupEdit.querySelector('.popup__content').offsetHeight / 2;
    popupEdit.querySelector('.popup__content').style.top = 'calc(40% - ' + popupHeight + 'px)';
    var textField = document.querySelector('.popup__text-field');
    var notes = document.querySelectorAll('.note');

    textField.onfocus = function () {
      if (this.classList.contains('popup__text-field_warning')) {
        this.classList.remove('popup__text-field_warning');
      }
    };

    var toggles = popupEdit.querySelectorAll('.popup__toggle');
    var priority = this.parentNode.classList[1].split('_')[2];

    for (var j = 0; j < toggles.length; j++) {
      if (toggles[j].value === priority) {
        toggles[j].checked = true;
      }
    }

    for (var i = 0; i < notes.length; i++) {
      popupEdit.querySelector('.popup__text-field').value = this.parentNode.querySelector('.note__sticker').innerHTML;
    }

    popupEdit.querySelector('.popup__button-close').onclick = function () {
      popupEdit.remove();
    };

    popupEdit.querySelector('.popup__button-cancel').onclick = function () {
      popupEdit.remove();
    };

    popupEdit.querySelector('.popup__button-ok').onclick = function () {
      var pattern = /[^\s]/;

      if (textField.value === '' || !pattern.test(textField.value)) {
        textField.classList.toggle('popup__text-field_warning');
        return false;
      } else {
        _this2.parentNode.querySelector('.note__sticker').innerHTML = popupEdit.querySelector('.popup__text-field').value;

        for (var _i = 0; _i < toggles.length; _i++) {
          if (toggles[_i].checked) {
            _this2.parentNode.className = 'note note_priority_' + toggles[_i].value + ' note_state_default';
            document.querySelector('.footer__count_' + toggles[_i].value).innerHTML++;
            document.querySelector('.footer__count_' + priority).innerHTML--;
            setLocaleStorage();
          }
        }

        popupEdit.remove();
      }
    };
  }

  var buttonCleanBoard = document.querySelector('.clean-board');

  buttonCleanBoard.onclick = function () {
    var popupClean = templatePopup.content.cloneNode(true).firstElementChild;
    page.append(popupClean);
    popupClean.querySelector('.popup__name').innerHTML = 'Cleaning board';
    popupClean.querySelector('.popup__main').innerHTML = 'Really want to clear board?';
    popupClean.querySelector('.popup__main').className = 'popup__main popup__main_small';
    var popupHeight = popupClean.querySelector('.popup__content').offsetHeight / 2;
    popupClean.querySelector('.popup__content').style.top = 'calc(40% - ' + popupHeight + 'px)';

    popupClean.querySelector('.popup__button-close').onclick = function () {
      popupClean.remove();
    };

    popupClean.querySelector('.popup__button-cancel').onclick = function () {
      popupClean.remove();
    };

    popupClean.querySelector('.popup__button-ok').onclick = function () {
      while (toDo.firstChild) {
        toDo.removeChild(toDo.firstChild);
      }

      while (inProgress.firstChild) {
        inProgress.removeChild(inProgress.firstChild);
      }

      while (done.firstChild) {
        done.removeChild(done.firstChild);
      }

      localStorage.clear();

      for (var i = 0; i < footerCount.length; i++) {
        footerCount[i].innerHTML = '0';
        setLocaleStorage();
      }

      popupClean.remove();
    };
  };

  var current = {};

  document.onmousedown = function (event) {
    var buttonDelete = event.target.closest('.note__button_delete');
    var buttonEdit = event.target.closest('.note__button_edit');

    if (event.target === buttonDelete || event.target.parentNode === buttonDelete) {
      buttonDelete.addEventListener('click', deleteNote);
    } else if (event.target === buttonEdit || event.target.parentNode === buttonEdit) {
      buttonEdit.addEventListener('click', editNote);
    } else {
      if (event.which !== 1) return;
      var note = event.target.closest('.note');
      if (!note) return;
      current.note = note;
      current.parent = note.parentNode;
      current.nextSibling = note.nextSibling;
      current.downX = event.pageX;
      current.downY = event.pageY;
      current.shiftX = event.clientX - current.note.getBoundingClientRect().left + parseInt(getComputedStyle(current.note).marginTop);
      current.shiftY = event.clientY - current.note.getBoundingClientRect().top + parseInt(getComputedStyle(current.note).marginLeft);
      current.clone = current.note.cloneNode(true);
      current.target = null;
    }
  };

  document.onmousemove = function (event) {
    if (!current.note) return;
    var moveX = event.pageX - current.downX;
    var moveY = event.pageY - current.downY;
    if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;
    document.body.style.overflow = 'hidden';
    startMove(event);
    current.clone.style.left = event.pageX - current.shiftX + 'px';
    current.clone.style.top = event.pageY - current.shiftY + 'px';
    showTarget(event);
    return false;
  };

  document.onmouseup = function (event) {
    if (current.clone) {
      finishMove(event);
    }

    current = {};
    var cells = document.querySelectorAll('.board__cell_body');

    for (var i = 0; i < cells.length; i++) {
      cells[i].classList.toggle('board__cell_state_droppable', false);
      cells[i].classList.toggle('board__cell_state_default', true);
    }
  };

  function startMove(event) {
    current.note.classList.toggle('note_state_default', false);
    current.note.classList.toggle('note_state_invisible', true);
    var clone = current.clone;
    clone.classList.toggle('note_state_default', false);
    clone.classList.toggle('note_state_draggable', true);
    document.body.appendChild(clone);
  }

  function findTarget(event) {
    current.clone.hidden = true;
    var elem = document.elementFromPoint(event.clientX, event.clientY);
    current.clone.hidden = false;
    if (elem === null) return null;
    return elem.closest('.board__cell_body');
  }

  function showTarget(event) {
    var target = findTarget(event);

    if (current.target !== target) {
      if (current.target) {
        current.target.className = 'board__cell board__cell_body board__cell_state_default';
      }

      current.target = target;

      if (current.target && current.target !== current.note.parentNode) {
        current.target.className = 'board__cell board__cell_body board__cell_state_droppable';
      }
    }
  }

  function finishMove(event) {
    var target = findTarget(event);

    if (target === current.note.parentNode) {
      current.note.remove();
      current.parent.insertBefore(current.clone, current.nextSibling);
      current.clone.removeAttribute('style');
      current.clone.classList.toggle('note_state_draggable', false);
      current.clone.classList.toggle('note_state_default', true);
    } else {
      target.append(current.clone);
      current.clone.classList.toggle('note_state_draggable', false);
      current.clone.classList.toggle('note_state_default', true);
      current.clone.removeAttribute('style');
      current.note.remove();
      setLocaleStorage();
    }
  }

  function setLocaleStorage() {
    var serialToDo = JSON.stringify(toDo.innerHTML);
    var serialInProgress = JSON.stringify(inProgress.innerHTML);
    var serialDone = JSON.stringify(done.innerHTML);
    var serialFooterCountLow = JSON.stringify(footerCount[0].innerHTML);
    var serialFooterCountMiddle = JSON.stringify(footerCount[1].innerHTML);
    var serialFooterCountHigh = JSON.stringify(footerCount[2].innerHTML);
    localStorage.setItem("toDo", serialToDo);
    localStorage.setItem("inProgress", serialInProgress);
    localStorage.setItem("done", serialDone);
    localStorage.setItem("footerCountLow", serialFooterCountLow);
    localStorage.setItem("footerCountMiddle", serialFooterCountMiddle);
    localStorage.setItem("footerCountHigh", serialFooterCountHigh);
  }

  function getLocaleStorage() {
    var returnToDo = JSON.parse(localStorage.getItem("toDo"));
    var returnInProgress = JSON.parse(localStorage.getItem("inProgress"));
    var returnDone = JSON.parse(localStorage.getItem("done"));
    var returnFooterCountLow = JSON.parse(localStorage.getItem("footerCountLow"));
    var returnFooterCountMiddle = JSON.parse(localStorage.getItem("footerCountMiddle"));
    var returnFooterCountHigh = JSON.parse(localStorage.getItem("footerCountHigh"));
    document.querySelectorAll('.board__cell_body')[0].innerHTML = returnToDo;
    document.querySelectorAll('.board__cell_body')[1].innerHTML = returnInProgress;
    document.querySelectorAll('.board__cell_body')[2].innerHTML = returnDone;
    document.querySelectorAll('.footer__count')[0].innerHTML = returnFooterCountLow;
    document.querySelectorAll('.footer__count')[1].innerHTML = returnFooterCountMiddle;
    document.querySelectorAll('.footer__count')[2].innerHTML = returnFooterCountHigh;
  }
};