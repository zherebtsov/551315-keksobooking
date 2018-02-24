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
var MAP_PIN_MAIN_ARROW_HEIGHT = 22;
var ESC_KEYCODE = 27;
var TEMPLATE = document.querySelector('template').content;
var MAP_PIN_TEMPLATE = TEMPLATE.querySelector('.map__pin');
var MAP_CARD_TEMPLATE = TEMPLATE.querySelector('.map__card');
var FEATURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.feature');
var PICTURE_ELEMENT_TEMPLATE = MAP_CARD_TEMPLATE.querySelector('.popup__pictures li');
var MAP_ELEMENT = document.querySelector('.map');
var MAP_FILTER_ELEMENT = MAP_ELEMENT.querySelector('.map__filters-container');
var MAP_PIN_MAIN = MAP_ELEMENT.querySelector('.map__pin--main');

var FORM = document.querySelector('.notice__form');
var ADDRESS_INPUT = FORM.querySelector('#address');
var TYPE_SELECT = FORM.querySelector('#type');
var PRICE_INPUT = FORM.querySelector('#price');
var TIMEIN_SELECT = FORM.querySelector('#timein');
var TIMEOUT_SELECT = FORM.querySelector('#timeout');
var ROOM_NUMBER_SELECT = FORM.querySelector('#room_number');
var CAPACITY_SELECT = FORM.querySelector('#capacity');

var isActivePage = false; // текущее состояние страницы


var generateRandomInt = function (min, max) {

  if (typeof max === 'undefined') {
    max = min;
    min = 0;
  }

  return Math.floor(min + Math.random() * (max + 1 - min));
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
    cbChangeElement(data, index, element); // правило изменения элемента
    fragment.appendChild(element);
  });

  return fragment;
};

var changeMapPinElement = function (data, index, element) {
  var item = data[index];

  element.setAttribute('style', 'left: ' + (item.location.x - MAP_PIN_WIDTH / 2) + 'px; ' +
                                'top: ' + (item.location.y - MAP_PIN_HEIGHT) + 'px;');
  element.querySelector('img').setAttribute('src', item.author);
  element.addEventListener('click', function () {
    openPopupMapCard(item);
  });
};

var renderMapPins = function (items) {
  var mapPinListElement = MAP_ELEMENT.querySelector('.map__pins');

  mapPinListElement.appendChild(createElements(items, MAP_PIN_TEMPLATE, changeMapPinElement));
};

var changeFeatureElement = function (data, index, element) {
  element.className = 'feature feature--' + data[index];
};

var changePictureElement = function (data, index, element) {
  var img = element.querySelector('img');

  img.setAttribute('src', data[index]);
  img.setAttribute('width', '100');
  img.setAttribute('height', '100');
};

var renderMapCard = function (card) {
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
      .appendChild(createElements(card.offer.features, FEATURE_ELEMENT_TEMPLATE, changeFeatureElement));

  element.querySelector('.popup__features + p').textContent = card.offer.description;

  element.querySelector('.popup__pictures').textContent = '';
  element.querySelector('.popup__pictures')
      .appendChild(createElements(card.offer.photos, PICTURE_ELEMENT_TEMPLATE, changePictureElement));
  element.querySelector('.popup__close').addEventListener('click', onPopupCloseCLick);

  parentElement.insertBefore(element, MAP_FILTER_ELEMENT);
};

var delMapCard = function () {
  var mapCardElement = MAP_ELEMENT.querySelector('.map__card');

  if (mapCardElement) {
    mapCardElement.remove();
  }
};

var openPopupMapCard = function (card) {
  delMapCard();
  renderMapCard(card);
  document.addEventListener('keydown', onPopupMapCardEscPress);
};

var closePopupMapCard = function () {
  delMapCard();
  document.removeEventListener('keydown', onPopupMapCardEscPress);
};

var onPopupMapCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopupMapCard();
  }
};

var init = function () {
  var ads = generateAds();
  renderMapPins(ads);
};

var checkIsActivePage = function () {
  return isActivePage;
};

var enablePage = function () {
  isActivePage = true;
  MAP_ELEMENT.classList.remove('map--faded');
  FORM.classList.remove('notice__form--disabled');
  var formElements = FORM.querySelectorAll('.form__element');
  formElements.forEach(function (element) {
    element.removeAttribute('disabled');
  });
};

var getCoordsMapPinMain = function () {
  var isActive = checkIsActivePage();
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

var setFieldValue = function (fieldElement, value) {
  fieldElement.value = value;
};

var setAddress = function () {
  var pinCoords = getCoordsMapPinMain();
  var address = pinCoords.x + ', ' + pinCoords.y;
  setFieldValue(ADDRESS_INPUT, address);
};

var onContentLoad = function () {
  setAddress();
  document.removeEventListener('DOMContentLoaded', onContentLoad);
};

var onPopupCloseCLick = function () {
  closePopupMapCard();
};

var onMapPinMainMouseup = function () {
  enablePage();
  setAddress();
  init();
  MAP_PIN_MAIN.removeEventListener('mouseup', onMapPinMainMouseup);
};

var onTypeChange = function (evt) {
  var min = 0;

  switch (evt.target.value) {
    case 'flat':
      min = 1000;
      break;
    case 'house':
      min = 5000;
      break;
    case 'palace':
      min = 10000;
      break;
    case 'bungalo':
    default:
      break;
  }

  PRICE_INPUT.setAttribute('min', min.toString());
};

var onTimeinChange = function (evt) {
  setFieldValue(TIMEOUT_SELECT, evt.target.value);
};

var onTimeoutChange = function (evt) {
  setFieldValue(TIMEIN_SELECT, evt.target.value);
};

var validNumRoomsAccordanceCapacity = function () {
  var msg = '';
  var roomNum = Number(ROOM_NUMBER_SELECT.value);
  var guestNum = Number(CAPACITY_SELECT.value);

  switch (roomNum) {
    case 1:
      if (guestNum !== roomNum) {
        msg = 'В одной комнате можно разместить только одного гостя';
      }
      break;
    case 2:
    case 3:
      if (guestNum > roomNum || guestNum === 0) {
        msg = 'В ' + roomNum + ' комнатах можно разместить от 1 до ' + roomNum + ' гостей';
      }
      break;
    case 100:
      if (guestNum !== 0) {
        msg = 'В 100 комнатах нельзя разместить гостей ;)';
      }
      break;
    default:
      break;
  }

  CAPACITY_SELECT.setCustomValidity(msg);
};

var onRoomNumberChange = function () {
  validNumRoomsAccordanceCapacity();
};

var onCapacityChange = function () {
  validNumRoomsAccordanceCapacity();
};

MAP_PIN_MAIN.addEventListener('mouseup', onMapPinMainMouseup);

TYPE_SELECT.addEventListener('change', onTypeChange);
TIMEIN_SELECT.addEventListener('change', onTimeinChange);
TIMEOUT_SELECT.addEventListener('change', onTimeoutChange);
ROOM_NUMBER_SELECT.addEventListener('change', onRoomNumberChange);
CAPACITY_SELECT.addEventListener('change', onCapacityChange);

document.addEventListener('DOMContentLoaded', onContentLoad);
