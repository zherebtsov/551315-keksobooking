'use strict';

(function () {
  var TITLE_LENGTH_MIN = 30;
  var TITLE_LENGTH_MAX = 100;
  var PRICE_MAX = 1000000;
  var REQUIRE_FIELDS = {
    title: window.form.field.TITLE,
    price: window.form.field.PRICE,
    capacity: window.form.field.CAPACITY
  };
  var INVALID_CLASS = 'invalid-field';
  var housingToMinPrice = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var validNumRoomsToNumGuests = function (numRooms, numGuests) {
    var msg = '';
    var room = Number(numRooms);
    var guest = Number(numGuests);

    switch (room) {
      case 1:
        if (guest !== room) {
          msg = 'В одной комнате можно разместить только одного гостя';
        }
        break;
      case 2:
      case 3:
        if (guest > room || guest === 0) {
          msg = 'В ' + room + ' комнатах можно разместить от 1 до ' + room + ' гостей';
        }
        break;
      case 100:
        if (guest !== 0) {
          msg = 'В 100 комнатах нельзя разместить гостей ;)';
        }
        break;
      default:
        break;
    }

    return msg;
  };

  var setRedBorder = function () {
    var fields = Object.assign({}, REQUIRE_FIELDS);
    var minPrice = housingToMinPrice[window.form.field.TYPE.value];

    if (fields.title.value.length >= TITLE_LENGTH_MIN && fields.title.value.length < TITLE_LENGTH_MAX) {
      delete (fields.title);
    }

    if (fields.price.value >= minPrice && fields.price.value < PRICE_MAX) {
      delete (fields.price);
    }

    if (validNumRoomsToNumGuests(window.form.field.ROOM_NUMBER.value, window.form.field.CAPACITY.value) === '') {
      delete (fields.capacity);
    }

    var keys = Object.keys(fields);
    if (keys.length > 0) {
      keys.forEach(function (key) {
        fields[key].classList.add(INVALID_CLASS);
      });
    }

  };

  var delRedBorder = function (fieldElement) {
    var removeCLass = function (field) {
      if (field.classList.contains(INVALID_CLASS)) {
        field.classList.remove(INVALID_CLASS);
      }
    };

    if (typeof fieldElement === 'undefined') {
      var keys = Object.keys(REQUIRE_FIELDS);
      if (keys.length > 0) {
        keys.forEach(function (key) {
          removeCLass(REQUIRE_FIELDS[key]);
        });
      }
    } else {
      removeCLass(fieldElement);
    }
  };

  window.validation = {
    validNumRoomsToNumGuests: validNumRoomsToNumGuests,
    housingToMinPrice: housingToMinPrice,
    setRedBorder: setRedBorder,
    delRedBorder: delRedBorder
  };
})();
