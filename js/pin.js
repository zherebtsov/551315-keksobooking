'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var QUANTITY_PINS = 5;
  var MAP_PIN_TEMPLATE = window.common.TEMPLATE.querySelector('.map__pin');
  var MAP_PIN_LIST_ELEMENT = window.common.MAP.querySelector('.map__pins');

  var changePinElement = function (data, index, element, cbOnElementClick) {
    var item = data[index];

    element.setAttribute('style', 'left: ' + (item.location.x - MAP_PIN_WIDTH / 2) + 'px; ' +
      'top: ' + (item.location.y - MAP_PIN_HEIGHT) + 'px;');
    element.querySelector('img').setAttribute('src', item.author.avatar);
    element.addEventListener('click', function () {
      cbOnElementClick(item);
    });
  };

  var render = function (items, cbOnPinClick) {
    var pins = items.slice(0, QUANTITY_PINS);
    MAP_PIN_LIST_ELEMENT.appendChild(
        window.common.createElements(pins, MAP_PIN_TEMPLATE, changePinElement, cbOnPinClick)
    );
  };

  var remove = function () {
    var pins = MAP_PIN_LIST_ELEMENT.querySelectorAll('.map__pin');
    pins.forEach(function (pin) {
      if (!pin.classList.contains('map__pin--main')) {
        MAP_PIN_LIST_ELEMENT.removeChild(pin);
      }
    });
  };

  window.pin = {
    render: render,
    remove: remove
  };
})();
