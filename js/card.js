'use strict';

(function () {
  var MAP_CARD_TEMPLATE = window.common.TEMPLATE.querySelector('.map__card');
  var MAP = window.common.MAP;
  var FEATURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.feature');
  var PICTURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.popup__pictures li');
  var MAP_FILTER_ELEMENT = MAP.querySelector('.map__filters-container');

  var changeFeatureElement = function (data, index, element) {
    element.className = 'feature feature--' + data[index];
  };

  var changePictureElement = function (data, index, element) {
    var img = element.querySelector('img');

    img.setAttribute('src', data[index]);
    img.setAttribute('width', '100');
    img.setAttribute('height', '100');
  };

  var render = function (card, cbOnCloseClick) {
    var parentElement = MAP_FILTER_ELEMENT.parentNode;
    var element = MAP_CARD_TEMPLATE.cloneNode(true);

    element.querySelector('.popup__avatar').setAttribute('src', card.author);
    element.querySelector('h3').textContent = card.offer.title;
    element.querySelector('p small').textContent = card.offer.address;
    element.querySelector('.popup__price').textContent = card.offer.price + ' ₽/ночь';
    element.querySelector('h4').textContent = card.offer.type;
    element.querySelector('h4 + p')
        .textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    element.querySelector('h4 + p + p')
        .textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

    element.querySelector('.popup__features').textContent = ''; // удаляем содержимое элемента
    element.querySelector('.popup__features')
        .appendChild(window.common.createElements(card.offer.features, FEATURE_ELEMENT_TEMPLATE, changeFeatureElement));

    element.querySelector('.popup__features + p').textContent = card.offer.description;

    element.querySelector('.popup__pictures').textContent = '';
    element.querySelector('.popup__pictures')
        .appendChild(window.common.createElements(card.offer.photos, PICTURE_ELEMENT_TEMPLATE, changePictureElement));
    element.querySelector('.popup__close').addEventListener('click', cbOnCloseClick);

    parentElement.insertBefore(element, MAP_FILTER_ELEMENT);
  };

  var del = function () {
    var mapCardElement = MAP.querySelector('.map__card');

    if (mapCardElement) {
      mapCardElement.remove();
    }
  };

  window.card = {
    render: render,
    del: del
  };
})();
