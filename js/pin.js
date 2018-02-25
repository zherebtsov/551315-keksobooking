'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;
  var MAP_PIN_TEMPLATE = window.common.TEMPLATE.querySelector('.map__pin');

  var changePinElement = function (data, index, element, cbOnElementClick) {
    var item = data[index];

    element.setAttribute('style', 'left: ' + (item.location.x - MAP_PIN_WIDTH / 2) + 'px; ' +
      'top: ' + (item.location.y - MAP_PIN_HEIGHT) + 'px;');
    element.querySelector('img').setAttribute('src', item.author);
    element.addEventListener('click', function () {
      cbOnElementClick(item);
    });
  };

  var render = function (items, cbOnPinClick) {
    var mapPinListElement = window.common.MAP.querySelector('.map__pins');

    mapPinListElement.appendChild(
        window.common.createElements(items, MAP_PIN_TEMPLATE, changePinElement, cbOnPinClick)
    );
  };

  window.pin = {
    render: render
  };
})();
