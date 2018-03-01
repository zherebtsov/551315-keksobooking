'use strict';

(function () {
  var ALERT = document.querySelector('.alert');
  var ALERT_TEXT = ALERT.querySelector('span');
  var DISPLAY_TIME = 5000; // 5c
  var CLASS_DISABLE = 'alert--disabled';

  var show = function (text) {
    hide();
    ALERT_TEXT.textContent = text || '';
    window.common.enableElement(ALERT, CLASS_DISABLE);
  };

  var hide = function () {
    window.common.disableElement(ALERT, CLASS_DISABLE);
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
