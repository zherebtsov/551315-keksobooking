'use strict';

var ADS_NUM = 8;
var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var TYPES = ['flat', 'house', 'bungalo'];
var TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];
var MAP_PIN_WIDTH = 50; // не понял, как получить высоту и ширину элемента
var MAP_PIN_HEIGHT = 70;

var generateRandomInt = function (min, max) {

  if (max !== 0 && !max) {
    max = min;
    min = 0;
  }

  var randomNum = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNum);
};

var getRandomElement = function (array) {
  return array[generateRandomInt(array.length - 1)];
};

var mixArray = function (array) {
  var resultArray = array.slice(0); // кастыль, чтобы скопировать массив, а не ссылку
  var compareRandom = function () {
    return Math.random() - 0.5;
  };

  resultArray.sort(compareRandom);

  return resultArray;
};

var generateAds = function () {
  var ads = [];
  var ad = {};
  var location = {};

  for (var i = 0; i < ADS_NUM; i++) {
    location = {
      x: generateRandomInt(300, 900),
      y: generateRandomInt(150, 500)
    };
    ad = {
      author: 'img/avatars/user0' + generateRandomInt(1, 8) + '.png',
      offer: {
        title: getRandomElement(TITLES),
        address: location.x + ', ' + location.y,
        price: generateRandomInt(1000, 1000000),
        type: getRandomElement(TYPES),
        rooms: generateRandomInt(1, 5),
        guests: generateRandomInt(1, 10),
        checkin: getRandomElement(TIMES),
        checkout: getRandomElement(TIMES),
        features: FEATURES.slice(generateRandomInt(FEATURES.length)),
        description: '',
        photos: mixArray(PHOTOS)
      }
    };
    ads.push(Object.assign(ad, {location: location}));
  }

  return ads;
};

var ads = generateAds();

var createMapPin = function (ad) {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinElement = mapPinTemplate.cloneNode(true);

  mapPinElement.setAttribute('style', 'left: ' + (ad.location.x - MAP_PIN_WIDTH / 2) + 'px; ' +
                                      'top: ' + (ad.location.y - MAP_PIN_HEIGHT) + 'px;');
  mapPinElement.querySelector('img').setAttribute('src', ad.author);

  return mapPinElement;
};

var renderMapPins = function () {
  var mapPinListElement = document.querySelector('.map__pins');
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createMapPin(ads[i]));
  }

  mapPinListElement.appendChild(fragment);
};

renderMapPins();

var createElements = function (dataArray, elementTemplate, changeElement) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < dataArray.length; i++) {
    var element = elementTemplate.cloneNode(true);
    element = changeElement(dataArray, i, element); // правило изменения элемента
    fragment.appendChild(element);
  }
  return fragment;
};

var createMapCard = function (card) {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
  var mapCardElement = mapCardTemplate.cloneNode(true);

  mapCardElement.querySelector('h3').textContent = card.offer.title;
  mapCardElement.querySelector('p small').textContent = card.offer.address;
  mapCardElement.querySelector('.popup__price').textContent = card.offer.price + ' &#x20bd;/ночь';
  mapCardElement.querySelector('h4').textContent = card.offer.type;
  mapCardElement.querySelector('h4 + p')
      .textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  mapCardElement.querySelector('h4 + p + p')
      .textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;

  var featureElementTemplate = mapCardElement.querySelector('.feature').cloneNode();
  mapCardElement.querySelector('.popup__features').textContent = ''; // удаляем содержимое элемента
  mapCardElement.querySelector('.popup__features')
      .appendChild(createElements(card.offer.features, featureElementTemplate, function (data, index, element) {
        element.className = 'feature feature--' + data[index];
        return element;
      }));

  mapCardElement.querySelector('.popup__features + p').textContent = card.offer.description;

  var pictureElementTemplate = mapCardElement.querySelector('.popup__pictures li').cloneNode(true);
  mapCardElement.querySelector('.popup__pictures').textContent = '';
  mapCardElement.querySelector('.popup__pictures')
      .appendChild(createElements(card.offer.photos, pictureElementTemplate, function (data, index, element) {
        var img = element.querySelector('img');
        img.setAttribute('src', data[index]);
        img.setAttribute('width', '100'); // не понял как получить ширину и высоту картинки, чтобы явно указать размеры в атрибутах
        return element;
      }));

  return mapCardElement;
};

var renderMapCard = function () {
  var mapFilterElement = document.querySelector('.map__filters-container');
  var parentElement = mapFilterElement.parentNode;
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(createMapCard(ads[i]));
  }

  parentElement.insertBefore(fragment, mapFilterElement);
};

renderMapCard();

