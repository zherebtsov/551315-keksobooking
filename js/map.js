'use strict';

(function () {
  var MAP = window.common.MAP;
  var KeyCode = {
    ESC: 27,
    ENTER: 13
  };
  var MAP_PIN_MAIN = MAP.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_ARROW_HEIGHT = 18;
  var MIN_Y = 150;
  var MAX_Y = 500;
  var initCoordsMainPin = {};
  var CLASS_DISABLE = 'map--faded';

  var openPopupCard = function (card) {
    window.card.remove();
    window.card.render(card, onPopupCardCloseClick);
    document.addEventListener('keydown', onPopupCardEscPress);
  };

  var closePopupCard = function () {
    window.card.remove();
    document.removeEventListener('keydown', onPopupCardEscPress);
  };

  var onPopupCardCloseClick = function () {
    closePopupCard();
  };

  var onPopupCardEscPress = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closePopupCard();
    }
  };

  var onMainPinEnterPress = function (evt) {
    if (evt.keyCode === KeyCode.ENTER) {
      init();
    }
  };

  var enable = function () {
    window.common.enableElement(MAP, CLASS_DISABLE);
  };

  var disable = function () {
    window.card.remove();
    window.pin.remove();
    setCoordMainPin(initCoordsMainPin);
    window.common.disableElement(MAP, CLASS_DISABLE);
  };

  var getCoordMainPin = function () {
    var isActive = window.pageState.check();
    var box = MAP_PIN_MAIN.getBoundingClientRect();
    var width = box.width;
    var height = isActive ? box.height + MAP_PIN_MAIN_ARROW_HEIGHT : box.height;
    var x = box.x + width / 2;
    var y = isActive ? box.y + height : box.y + height / 2;

    return {
      x: x + pageXOffset,
      y: y + pageYOffset
    };
  };

  var onDataLoad = function (data) {
    window.pin.render(data, openPopupCard);
    window.filter.enable();
    window.filter.setData(data);
  };

  var onError = function (error) {
    window.toast.showMessage('Не удалось загрузить объявления (' + error + ')');
  };

  var refreshAds = function (data) {
    window.pin.remove();
    window.pin.render(data, openPopupCard);
  };

  var init = function () {
    if (!window.pageState.check()) {
      window.pageState.enable();
      window.backend.get(onDataLoad, onError);
    }
  };

  var setCoordMainPin = function (coord) {
    var mapSize = MAP.getBoundingClientRect();
    var pinSize = MAP_PIN_MAIN.getBoundingClientRect();
    var topEdge = MIN_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var bottomEdge = MAX_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var leftEdge = mapSize.left;
    var rigthEdge = mapSize.left + mapSize.width;

    if (coord.y > topEdge && coord.y < bottomEdge) {
      MAP_PIN_MAIN.style.top = coord.y + 'px';
    }

    if (coord.x > leftEdge && coord.x < rigthEdge) {
      MAP_PIN_MAIN.style.left = (coord.x - mapSize.left) + 'px';
    }

    window.form.setAddress(getCoordMainPin());
  };

  MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    init();

    var prevCoordMouse = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: prevCoordMouse.x - moveEvt.clientX,
        y: prevCoordMouse.y - moveEvt.clientY
      };

      prevCoordMouse = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentCoordMouse = {
        x: prevCoordMouse.x - shift.x + pageXOffset,
        y: prevCoordMouse.y - shift.y + pageYOffset
      };

      setCoordMainPin(currentCoordMouse);
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();

      window.form.setAddress(getCoordMainPin());
      MAP.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    MAP.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  var onContentLoad = function () {
    initCoordsMainPin = getCoordMainPin();
    window.form.setAddress(initCoordsMainPin);
    window.form.saveInitState();
    document.removeEventListener('DOMContentLoaded', onContentLoad);
  };

  MAP_PIN_MAIN.addEventListener('keydown', onMainPinEnterPress);
  document.addEventListener('DOMContentLoaded', onContentLoad);

  window.map = {
    refreshAds: refreshAds,
    closePopupCard: closePopupCard,
    enable: enable,
    disable: disable
  };
})();
