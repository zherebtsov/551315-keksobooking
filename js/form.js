'use strict';

(function () {
  var FORM = document.querySelector('.notice__form');
  var ADDRESS_INPUT = FORM.querySelector('#address');
  var TYPE_SELECT = FORM.querySelector('#type');
  var PRICE_INPUT = FORM.querySelector('#price');
  var TIMEIN_SELECT = FORM.querySelector('#timein');
  var TIMEOUT_SELECT = FORM.querySelector('#timeout');
  var ROOM_NUMBER_SELECT = FORM.querySelector('#room_number');
  var CAPACITY_SELECT = FORM.querySelector('#capacity');
  var FORM_ELEMENTS = FORM.querySelectorAll('.form__element');

  var enable = function () {
    FORM.classList.remove('notice__form--disabled');
    FORM_ELEMENTS.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  };

  var setFieldValue = function (fieldElement, value) {
    fieldElement.value = value;
  };

  var setAddress = function (coordsPin) {
    var address = coordsPin.x + ', ' + coordsPin.y;
    setFieldValue(ADDRESS_INPUT, address);
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

  var onTimeinChange = function (evt) {
    setFieldValue(TIMEOUT_SELECT, evt.target.value);
  };

  var onTimeoutChange = function (evt) {
    setFieldValue(TIMEIN_SELECT, evt.target.value);
  };

  var onRoomNumberChange = function () {
    validNumRoomsAccordanceCapacity();
  };

  var onCapacityChange = function () {
    validNumRoomsAccordanceCapacity();
  };

  var onContentLoad = function () {
    var coordsPin = window.map.getCoordsMainPin();
    setAddress(coordsPin);
    document.removeEventListener('DOMContentLoaded', onContentLoad);
  };

  TYPE_SELECT.addEventListener('change', onTypeChange);
  TIMEIN_SELECT.addEventListener('change', onTimeinChange);
  TIMEOUT_SELECT.addEventListener('change', onTimeoutChange);
  ROOM_NUMBER_SELECT.addEventListener('change', onRoomNumberChange);
  CAPACITY_SELECT.addEventListener('change', onCapacityChange);

  document.addEventListener('DOMContentLoaded', onContentLoad);

  window.form = {
    setAddress: setAddress,
    enable: enable
  };
})();
