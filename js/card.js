'use strict';

(function () {
  var MAP_CARD_TEMPLATE = window.common.TEMPLATE.querySelector('.map__card');
  var MAP = window.common.MAP;
  var FEATURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.feature');
  var PICTURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.popup__pictures li');
  var MAP_FILTER_ELEMENT = window.common.MAP_FILTER;
  var PICTURE_WIDTH = '100';
  var PICTURE_HEIGHT = '100';

  var changeFeatureElement = function (data, index, element) {
    element.className = 'feature feature--' + data[index];
  };

  var changePictureElement = function (data, index, element) {
    var image = element.querySelector('img');

    image.setAttribute('src', data[index]);
    image.setAttribute('width', PICTURE_WIDTH);
    image.setAttribute('height', PICTURE_HEIGHT);
  };

  var render = function (card, onCloseClick) {
    var parentElement = MAP_FILTER_ELEMENT.parentNode;
    var element = MAP_CARD_TEMPLATE.cloneNode(true);

    element.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);
    element.querySelector('h3').textContent = card.offer.title;
    element.querySelector('p small').textContent = card.offer.address;
    element.querySelector('.popup__price').textContent = card.offer.price + ' ₽/ночь';
    element.querySelector('h4').textContent = card.offer.type;
    element.querySelector('h4 + p')
        .textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
    element.querySelector('h4 + p + p')
        .textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

    if (card.offer.features.length !== 0) {
      element.querySelector('.popup__features').textContent = ''; // удаляем содержимое элемента
      element.querySelector('.popup__features')
          .appendChild(window.common.createElements(card.offer.features, FEATURE_ELEMENT_TEMPLATE, changeFeatureElement));
    } else {
      element.removeChild(element.querySelector('.popup__features'));
    }

    element.querySelector('.popup__description').textContent = card.offer.description;

    if (card.offer.photos.length !== 0) {
      element.querySelector('.popup__pictures').textContent = '';
      element.querySelector('.popup__pictures')
          .appendChild(window.common.createElements(card.offer.photos, PICTURE_ELEMENT_TEMPLATE, changePictureElement));
    } else {
      element.removeChild(element.querySelector('.popup__pictures'));
    }
    element.querySelector('.popup__close').addEventListener('click', onCloseClick);

    parentElement.insertBefore(element, MAP_FILTER_ELEMENT);
  };

  var remove = function () {
    var mapCardElement = MAP.querySelector('.map__card');

    if (mapCardElement) {
      mapCardElement.remove();
    }
  };

  window.card = {
    render: render,
    remove: remove
  };
})();
