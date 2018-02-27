'use strict';

(function () {
  var ALERT = document.querySelector('.alert');
  var ALERT_TEXT = ALERT.querySelector('span');
  var DISPLAY_TIME = 5000; // 5c

  var show = function (text) {
    hide();
    ALERT_TEXT.textContent = text || '';
    if (ALERT.classList.contains('alert--disabled')) {
      ALERT.classList.remove('alert--disabled');
    }
  };

  var hide = function () {
    if (!ALERT.classList.contains('alert--disabled')) {
      ALERT.classList.add('alert--disabled');
    }
  };

  var showMsg = function (message) {
    show(message);
    setTimeout(hide, DISPLAY_TIME);
  };

  window.toast = {
    show: show,
    hide: hide,
    showMsg: showMsg
  };
})();
