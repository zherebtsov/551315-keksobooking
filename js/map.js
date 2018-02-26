'use strict';

(function () {
  var MAP = window.common.MAP;
  var ESC_KEYCODE = 27;
  var MAP_PIN_MAIN = MAP.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_ARROW_HEIGHT = 18;
  var MIN_Y = 150;
  var MAX_Y = 500;

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
    if (evt.keyCode === ESC_KEYCODE) {
      closePopupCard();
    }
  };

  var enable = function () {
    MAP.classList.remove('map--faded');
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

  var init = function () {
    if (!window.pageState.check()) {
      window.pageState.enable();
      window.pin.render(window.data, openPopupCard);
    }
  };

  MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    init();

    var prevCoordsMouse = {
      x: evt.clientX,
      y: evt.clientY
    };
    var mapSize = MAP.getBoundingClientRect();
    var pinSize = MAP_PIN_MAIN.getBoundingClientRect();
    var topEdge = MIN_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var bottomEdge = MAX_Y - pinSize.height + MAP_PIN_MAIN_ARROW_HEIGHT;
    var leftEdge = mapSize.left;
    var rigthEdge = mapSize.left + mapSize.width;

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

      if (currentCoordsMouse.y > topEdge && currentCoordsMouse.y < bottomEdge) {
        MAP_PIN_MAIN.style.top = currentCoordsMouse.y + 'px';
      }

      if (currentCoordsMouse.x > leftEdge && currentCoordsMouse.x < rigthEdge) {
        MAP_PIN_MAIN.style.left = (currentCoordsMouse.x - mapSize.left) + 'px';
      }

      window.form.setAddress(getCoordsMainPin());
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

  window.map = {
    getCoordsMainPin: getCoordsMainPin,
    enable: enable
  };
})();
