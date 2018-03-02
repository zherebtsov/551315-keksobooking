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
    window.card.del();
    window.card.render(card, onPopupCardCloseClick);
    document.addEventListener('keydown', onPopupCardEscPress);
  };

  var closePopupCard = function () {
    window.card.del();
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
    window.card.del();
    window.pin.del();
    setCoordsMainPin(initCoordsMainPin);
    window.common.disableElement(MAP, CLASS_DISABLE);
  };

  var getCoordsMainPin = function () {
    var isActive = window.pageState.check();
    var box = MAP_PIN_MAIN.getBoundingClientRect();
    var width = box.width;
    var height = isActive ? box.height + MAP_PIN_MAIN_ARROW_HEIGHT : box.height;
    var x = box.x + width / 2;
    var y = isActive ? box.y + height : box.y + height / 2;
    var coords = {
      x: x + pageXOffset,
      y: y + pageYOffset
    };

    return coords;
  };

  var onDataLoad = function (data) {
    window.pin.render(data, openPopupCard);
    window.filter.enable();
    window.filter.setData(data);
  };

  var onError = function (error) {
    window.toast.showMsg('Не удалось загрузить объявления (' + error + ')');
  };

  var refreshAds = function (data) {
    window.pin.del();
    window.pin.render(data, openPopupCard);
  };

  var init = function () {
    if (!window.pageState.check()) {
      window.pageState.enable();
      window.backend.get(onDataLoad, onError);
    }
  };

  var setCoordsMainPin = function (coords) {
    var mapSize = MAP.getBoundingClientRect();
    var pinSize = MAP_PIN_MAIN.getBoundingClientRect();
    var topEdge = MIN_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var bottomEdge = MAX_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var leftEdge = mapSize.left;
    var rigthEdge = mapSize.left + mapSize.width;

    if (coords.y > topEdge && coords.y < bottomEdge) {
      MAP_PIN_MAIN.style.top = coords.y + 'px';
    }

    if (coords.x > leftEdge && coords.x < rigthEdge) {
      MAP_PIN_MAIN.style.left = (coords.x - mapSize.left) + 'px';
    }

    window.form.setAddress(getCoordsMainPin());
  };

  MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    init();

    var prevCoordsMouse = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: prevCoordsMouse.x - moveEvt.clientX,
        y: prevCoordsMouse.y - moveEvt.clientY
      };

      prevCoordsMouse = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentCoordsMouse = {
        x: prevCoordsMouse.x - shift.x + pageXOffset,
        y: prevCoordsMouse.y - shift.y + pageYOffset
      };

      setCoordsMainPin(currentCoordsMouse);
    };

    var onMainPinMouseup = function (upEvt) {
      upEvt.preventDefault();

      window.form.setAddress(getCoordsMainPin());
      MAP.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseup);
    };

    MAP.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseup);
  });

  var onContentLoad = function () {
    initCoordsMainPin = getCoordsMainPin();
    window.form.setAddress(initCoordsMainPin);
    window.form.saveInitStateForm();
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
