'use strict';

(function () {
  var MAP = window.common.MAP;
  var ESC_KEYCODE = 27;
  var MAP_PIN_MAIN = MAP.querySelector('.map__pin--main');
  var MAP_PIN_MAIN_ARROW_HEIGHT = 22;

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

  var onMainPinMouseup = function () {
    window.pageState.enable();
    window.form.setAddress(getCoordsMainPin());
    window.pin.render(window.data, openPopupCard);
    MAP_PIN_MAIN.removeEventListener('mouseup', onMainPinMouseup);
  };

  MAP_PIN_MAIN.addEventListener('mouseup', onMainPinMouseup);

  window.map = {
    getCoordsMainPin: getCoordsMainPin,
    enable: enable
  };
})();
