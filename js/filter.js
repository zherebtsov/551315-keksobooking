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
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PRICE_LOW = 10000;
  var PRICE_HEIGHT = 50000;

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

  var isFeature = function (parameter) {
    return FEATURES.includes(parameter);
  };

  var applyFilter = function (items) {
    var cleanFilter = removeEmptyKeys(filter);
    var filterParameters = Object.keys(cleanFilter);

    if (filterParameters.length !== 0) {
      var result = items.filter(function (item) {
        var isValid = true;

        filterParameters.forEach(function (parameter) {
          var specialParameter = isFeature(parameter) ? 'features' : parameter;

          if (transformValue(parameter, item.offer[specialParameter]) !== filter[parameter]) {
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

  var changeFilter = function (parameter, value) {
    filter[parameter] = value;
    window.map.closePopupCard();
    window.debounce(function () {
      applyFilter(data);
    });
  };

  var removeEmptyKeys = function (object) {
    var result = {};

    Object.keys(object).forEach(function (key) {
      if (object[key]) {
        result[key] = object[key];
      }
    });
    return result;
  };

  var resetFilter = function () {
    var controls = Object.keys(Control);

    controls.forEach(function (name) {
      var parameter = getFilterParameter(name);
      if (isFeature(parameter)) {
        filter[parameter] = false;
        Control[name].checked = false;
      } else {
        filter[parameter] = '';
        Control[name].value = '';
      }
    });
  };

  var transformValue = function (parameter, value) {
    if (isFeature(parameter)) {
      return value.includes(parameter);
    }
    switch (parameter) {
      case 'price':
        if (value < PRICE_LOW) {
          return 'low';
        }
        if (value >= PRICE_HEIGHT) {
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

  var getFilterParameter = function (elementName) {
    return elementName.toLowerCase();
  };

  var controls = Object.keys(Control);
  controls.forEach(function (name) {
    Control[name].addEventListener('change', function (evt) {
      var parameter = getFilterParameter(name);
      var value = isFeature(parameter) ? evt.target.checked : evt.target.value;

      changeFilter(parameter, value);
    });
  });

  window.filter = {
    setData: setData,
    enable: enable,
    disable: disable
  };
})();
