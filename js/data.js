'use strict';

(function () {
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

  window.data = generateAds();
})();
