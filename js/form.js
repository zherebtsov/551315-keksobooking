'use strict';

(function () {
  var FORM = document.querySelector('.notice__form');
  var FORM_ELEMENTS = FORM.querySelectorAll('.form__element');

  var AVATAR_INPUT = FORM.querySelector('#avatar');
  var TITLE_INPUT = FORM.querySelector('#title');
  var ADDRESS_INPUT = FORM.querySelector('#address');
  var TYPE_SELECT = FORM.querySelector('#type');
  var PRICE_INPUT = FORM.querySelector('#price');
  var TIME_IN_SELECT = FORM.querySelector('#timein');
  var TIME_OUT_SELECT = FORM.querySelector('#timeout');
  var ROOM_NUMBER_SELECT = FORM.querySelector('#room_number');
  var CAPACITY_SELECT = FORM.querySelector('#capacity');
  var DESCRIPTION_TEXTAREA = FORM.querySelector('#description');
  var IMAGES_INPUT = FORM.querySelector('#images');
  var SUBMIT_BTN = FORM.querySelector('.form__submit');
  var RESET_BTN = FORM.querySelector('.form__reset');

  var TITLE_LENGTH_MIN = 30;
  var TITLE_LENGTH_MAX = 100;
  var PRICE_MAX = 1000000;
  var REQUIRE_FIELDS = {
    title: TITLE_INPUT,
    price: PRICE_INPUT,
    capacity: CAPACITY_SELECT
  };
  var initState = {};

  var enable = function () {
    FORM.classList.remove('notice__form--disabled');
    FORM_ELEMENTS.forEach(function (element) {
      element.removeAttribute('disabled');
    });
  };

  var disable = function () {
    delRedBorder();
    resetForm();
    FORM.classList.add('notice__form--disabled');
    FORM_ELEMENTS.forEach(function (element) {
      element.setAttribute('disabled', '');
    });
  };

  var saveInitState = function () {
    initState = {
      type: TYPE_SELECT.value,
      timeIn: TIME_IN_SELECT.value,
      timeOut: TIME_OUT_SELECT.value,
      roomNumber: ROOM_NUMBER_SELECT.value,
      capacity: CAPACITY_SELECT.value
    };
  };

  var resetForm = function () {
    AVATAR_INPUT.value = '';
    TITLE_INPUT.value = '';
    TYPE_SELECT.value = initState.type;
    PRICE_INPUT.value = '';
    TIME_IN_SELECT.value = initState.timeIn;
    TIME_OUT_SELECT.value = initState.timeOut;
    ROOM_NUMBER_SELECT.value = initState.roomNumber;
    CAPACITY_SELECT.value = initState.capacity;
    DESCRIPTION_TEXTAREA.value = '';
    IMAGES_INPUT.value = '';

    var featureElements = FORM.querySelectorAll('input[type=checkbox]');
    featureElements.forEach(function (element) {
      element.checked = false;
    });
  };

  var setFieldValue = function (fieldElement, value) {
    fieldElement.value = value;
  };

  var setAddress = function (coordsPin) {
    var address = coordsPin.x + ', ' + coordsPin.y;
    setFieldValue(ADDRESS_INPUT, address);
  };

  var calcMinPrice = function (type) {
    var min = 0;

    switch (type) {
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

    return min;
  };

  var onTypeChange = function (evt) {
    var min = calcMinPrice(evt.target.value);

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
    return msg;
  };

  var onTimeinChange = function (evt) {
    setFieldValue(TIME_OUT_SELECT, evt.target.value);
  };

  var onTimeoutChange = function (evt) {
    setFieldValue(TIME_IN_SELECT, evt.target.value);
  };

  var onCapacityChange = function () {
    delRedBorder(CAPACITY_SELECT);
    validNumRoomsAccordanceCapacity();
  };

  var onSuccess = function () {
    window.toast.showMsg('Форма успешно отправлена!');
    window.pageState.disable();
  };

  var onError = function (error) {
    window.toast.showMsg('Не удалось отправить форму (' + error + ')');
  };

  var setRedBorder = function () {
    var fields = Object.assign({}, REQUIRE_FIELDS);
    var minPrice = calcMinPrice(TYPE_SELECT.value);

    if (fields.title.value.length >= TITLE_LENGTH_MIN && fields.title.value.length < TITLE_LENGTH_MAX) {
      delete (fields.title);
    }

    if (fields.price.value >= minPrice && fields.price.value < PRICE_MAX) {
      delete (fields.price);
    }

    if (validNumRoomsAccordanceCapacity() === '') {
      delete (fields.capacity);
    }

    var keys = Object.keys(fields);
    if (keys.length > 0) {
      keys.forEach(function (key) {
        fields[key].classList.add('invalid-field');
      });
    }

  };

  var delRedBorder = function (fieldElement) {
    var removeCLass = function (field) {
      if (field.classList.contains('invalid-field')) {
        field.classList.remove('invalid-field');
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

  var onTitleChange = function () {
    delRedBorder(TITLE_INPUT);
  };

  var onPriceChange = function () {
    delRedBorder(PRICE_INPUT);
  };

  var onFormSubmit = function (evt) {
    evt.preventDefault();
    var data = new FormData(FORM);
    window.backend.post(data, onSuccess, onError);
  };

  var onSubmitClick = function () {
    setRedBorder();
  };

  var onResetClick = function () {
    window.pageState.disable();
  };

  TYPE_SELECT.addEventListener('change', onTypeChange);
  TIME_IN_SELECT.addEventListener('change', onTimeinChange);
  TIME_OUT_SELECT.addEventListener('change', onTimeoutChange);
  ROOM_NUMBER_SELECT.addEventListener('change', onCapacityChange);
  CAPACITY_SELECT.addEventListener('change', onCapacityChange);
  FORM.addEventListener('submit', onFormSubmit);
  SUBMIT_BTN.addEventListener('click', onSubmitClick);
  TITLE_INPUT.addEventListener('change', onTitleChange);
  PRICE_INPUT.addEventListener('change', onPriceChange);
  RESET_BTN.addEventListener('click', onResetClick);

  window.form = {
    saveInitStateForm: saveInitState,
    setAddress: setAddress,
    enable: enable,
    disable: disable
  };
})();
