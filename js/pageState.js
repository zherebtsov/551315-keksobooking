'use strict';

(function () {
  var isActive = false;

  var enable = function () {
    window.map.enable();
    window.form.enable();
    isActive = true;
  };

  var disable = function () {
    isActive = false;
  };

  var check = function () {
    return isActive;
  };

  window.pageState = {
    enable: enable,
    disable: disable,
    check: check
  };
})();
