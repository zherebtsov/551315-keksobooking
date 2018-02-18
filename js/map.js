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
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var MAP_PIN_TEMPLATE = document.querySelector('template').content.querySelector('.map__pin');
var MAP_CARD_TEMPLATE = document.querySelector('template').content.querySelector('.map__card');
var FEATURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.feature');
var PICTURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.popup__pictures li');
var MAP_FILTER_ELEMENT = document.querySelector('.map__filters-container');


var generateRandomInt = function (min, max) {

  if (max !== 0 && !max) {
    max = min;
    min = 0;
  }

  var randomNum = min + Math.random() * (max + 1 - min);
  return Math.floor(randomNum);
};

var generateRandomUniqueNumbers = function (qty) {
  var numbers = [];
  var number = 0;

  for (var i = 0; i < qty; i++) {
    number = generateRandomInt(1, qty);

    if (isContainsInArray(number, numbers)) {
      i--;
    } else {
      numbers.push(number);
    }
  }

  return numbers;
};

var getRandomArrayElement = function (array) {
  return array[generateRandomInt(array.length - 1)];
};

var isContainsInArray = function (element, array) {
  var index = array.findIndex(function (item) {
    return item === element;
  });

  return index !== -1;
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
    x = generateRandomInt(300, 900);
    y = generateRandomInt(150, 500);
    ad = {
      author: 'img/avatars/user0' + uniqueNumbers[i] + '.png',
      offer: {
        title: getRandomArrayElement(TITLES),
        address: x + ', ' + y,
        price: generateRandomInt(1000, 1000000),
        type: getRandomArrayElement(TYPES),
        rooms: generateRandomInt(1, 5),
        guests: generateRandomInt(1, 10),
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
  var mapPinListElement = document.querySelector('.map__pins');

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
