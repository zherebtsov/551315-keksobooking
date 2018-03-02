'use strict';

(function () {
  var FORM = window.common.MAP_FILTER.querySelector('.map__filters');
  var Control = {
    TYPE: FORM.querySelector('#housing-type'),
    PRICE: FORM.querySelector('#housing-price'),
    ROOMS: FORM.querySelector('#housing-rooms'),
    GUESTS: FORM.querySelector('#housing-guests'),
    WIFI: FORM.querySelector('#filter-wifi'),
    DISHWASHER: FORM.querySelector('#filter-dishwasher'),
    PARKING: FORM.querySelector('#filter-parking'),
    WASHER: FORM.querySelector('#filter-washer'),
    ELEVATOR: FORM.querySelector('#filter-elevator'),
    CONDITIONER: FORM.querySelector('#filter-conditioner')
  };
  var CLASS_DISABLE = 'map__filters--hidden';
  var CHECKBOXS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var filter = {
    type: '',
    price: '',
    rooms: '',
    guests: '',
    wifi: false,
    dishwasher: false,
    parking: false,
    washer: false,
    elevator: false,
    conditioner: false
  };
  var data = [];

  var enable = function () {
    window.common.enableElement(FORM, CLASS_DISABLE);
  };

  var disable = function () {
    window.common.disableElement(FORM, CLASS_DISABLE);
    resetFilter();
  };

  var setData = function (items) {
    data = items;
  };

  var applyFilter = function (items) {
    var cleanFilter = delEmptyKeys(filter);
    var filterParams = Object.keys(cleanFilter);

    if (filterParams.length !== 0) {
      var result = items.filter(function (item) {
        var isValid = true;

        filterParams.forEach(function (param) {
          var specialParam = CHECKBOXS.includes(param) ? 'features' : param;

          if (transformValue(param, item.offer[specialParam]) !== filter[param]) {
            isValid = false;
          }
        });

        return isValid;
      });
      window.map.refreshAds(result);
    } else {
      window.map.refreshAds(items);
    }
  };

  var changeFilter = function (param, value) {
    filter[param] = value;
    window.map.closePopupCard();
    window.debounce(function () {
      applyFilter(data);
    });
  };

  var delEmptyKeys = function (obj) {
    var result = {};

    Object.keys(obj).forEach(function (key) {
      if (obj[key]) {
        result[key] = obj[key];
      }
    });
    return result;
  };

  var resetFilter = function () {
    var controls = Object.keys(Control);

    controls.forEach(function (name) {
      var param = getFilterParam(name);
      if (CHECKBOXS.includes(param)) {
        filter[param] = false;
        Control[name].checked = false;
      } else {
        filter[param] = '';
        Control[name].value = '';
      }
    });
  };

  var transformValue = function (param, value) {
    if (CHECKBOXS.includes(param)) {
      return value.includes(param);
    }
    switch (param) {
      case 'price':
        if (value < LOW_PRICE) {
          return 'low';
        }
        if (value >= HIGH_PRICE) {
          return 'high';
        }
        return 'middle';
      case 'rooms':
        return value.toString();
      case 'guests':
        return value.toString();
      default:
        return value;
    }
  };

  var getFilterParam = function (elemName) {
    return elemName.toLowerCase();
  };

  var controls = Object.keys(Control);
  controls.forEach(function (name) {
    Control[name].addEventListener('change', function (evt) {
      var param = getFilterParam(name);
      var value = CHECKBOXS.includes(param) ? evt.target.checked : evt.target.value;

      changeFilter(param, value);
    });
  });

  window.filter = {
    setData: setData,
    enable: enable,
    disable: disable
  };
})();
