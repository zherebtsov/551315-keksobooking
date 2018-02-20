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
var X_MIN = 300;
var X_MAX = 900;
var Y_MIN = 150;
var Y_MAX = 500;
var PRICE_MIN = 1000;
var PRICE_MAX = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var QUESTS_MIN = 1;
var QUESTS_MAX = 5;
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var TEMPLATE = document.querySelector('template').content;
var MAP_PIN_TEMPLATE = TEMPLATE.querySelector('.map__pin');
var MAP_CARD_TEMPLATE = TEMPLATE.querySelector('.map__card');
var FEATURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.feature');
var PICTURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.popup__pictures li');
var MAP_ELEMENT = document.querySelector('.map');
var MAP_FILTER_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');


var generateRandomInt = function (min, max) {

  if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }

  var randomNum = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNum);
};

var generateRandomUniqueNumbers = function (qty) {
  var numbers = [];

  for (var i = 0; i < qty; i++) {
    numbers.push(i + 1);
  }

  return shuffleArray(numbers);
};

var getRandomArrayElement = function (array) {
  return array[generateRandomInt(array.length - 1)];
};

var compareRandom = function () {
  return Math.random() - 0.5;
};

var shuffleArray = function (array) {
  var result = array.slice();

  result.sort(compareRandom);

  return result;
};

var generateAds = function () {
  var ads = [];
  var ad = {};
  var uniqueNumbers = generateRandomUniqueNumbers(ADS_NUM);
  var x = 0;
  var y = 0;

  for (var i = 0; i < ADS_NUM; i++) {
    x = generateRandomInt(X_MIN, X_MAX);
    y = generateRandomInt(Y_MIN, Y_MAX);
    ad = {
      author: 'img/avatars/user0' + uniqueNumbers[i] + '.png',
      offer: {
        title: getRandomArrayElement(TITLES),
        address: x + ', ' + y,
        price: generateRandomInt(PRICE_MIN, PRICE_MAX),
        type: getRandomArrayElement(TYPES),
        rooms: generateRandomInt(ROOMS_MIN, ROOMS_MAX),
        guests: generateRandomInt(QUESTS_MIN, QUESTS_MAX),
        checkin: getRandomArrayElement(TIMES),
        checkout: getRandomArrayElement(TIMES),
        features: shuffleArray(FEATURES).slice(generateRandomInt(FEATURES.length)),
        description: '',
        photos: shuffleArray(PHOTOS)
      },
      location: {
        x: x,
        y: y
      }
    };
    ads.push(ad);
  }

  return ads;
};

var createElements = function (data, elementTemplate, cbChangeElement) {
  var fragment = document.createDocumentFragment();

  data.forEach(function (value, index) {
    var element = elementTemplate.cloneNode(true);
    element = cbChangeElement(data, index, element); // правило изменения элемента
    fragment.appendChild(element);
  });

  return fragment;
};

var changeMapPinElement = function (data, index, element) {
  var item = data[index];

  element.setAttribute('style', 'left: ' + (item.location.x - MAP_PIN_WIDTH / 2) + 'px; ' +
                                'top: ' + (item.location.y - MAP_PIN_HEIGHT) + 'px;');
  element.querySelector('img').setAttribute('src', item.author);

  return element;
};

var renderMapPins = function (items) {
  var mapPinListElement = MAP_ELEMENT.querySelector('.map__pins');

  mapPinListElement.appendChild(createElements(items, MAP_PIN_TEMPLATE, changeMapPinElement));
};

var changeFeatureElement = function (data, index, element) {
  element.className = 'feature feature--' + data[index];

  return element;
};

var changePictureElement = function (data, index, element) {
  var img = element.querySelector('img');

  img.setAttribute('src', data[index]);
  img.setAttribute('width', '100');
  img.setAttribute('height', '100');

  return element;
};

var changeMapCardElement = function (data, index, element) {
  var card = data[index];

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
      .appendChild(createElements(card.offer.features, FEATURE_ELEMENT_TEMPLATE, changeFeatureElement));

  element.querySelector('.popup__features + p').textContent = card.offer.description;

  element.querySelector('.popup__pictures').textContent = '';
  element.querySelector('.popup__pictures')
      .appendChild(createElements(card.offer.photos, PICTURE_ELEMENT_TEMPLATE, changePictureElement));

  if (index !== data.length - 1) {
    element.classList.add('hidden');
  }

  return element;

};

var renderMapCard = function (items) {
  var parentElement = MAP_FILTER_ELEMENT.parentNode;
  var mapCardElements = createElements(items, MAP_CARD_TEMPLATE, changeMapCardElement);
  parentElement.insertBefore(mapCardElements, MAP_FILTER_ELEMENT);
};

var ads = generateAds();
renderMapPins(ads);
renderMapCard(ads);
