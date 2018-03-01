'use strict';

(function () {
  var TEMPLATE = document.querySelector('template').content;
  var MAP = document.querySelector('.map');
  var MAP_FILTER = MAP.querySelector('.map__filters-container');

  var createElements = function (data, elementTemplate, cbChangeElement, cbEvent) {
    var fragment = document.createDocumentFragment();

    data.forEach(function (value, index) {
      var element = elementTemplate.cloneNode(true);
      cbChangeElement(data, index, element, cbEvent); // правило изменения элемента
      fragment.appendChild(element);
    });
    return fragment;
  };

  var enableElement = function (element, classDisable) {
    if (element.classList.contains(classDisable)) {
      element.classList.remove(classDisable);
    }
  };

  var disableElement = function (element, classDisable) {
    if (!element.classList.contains(classDisable)) {
      element.classList.add(classDisable);
    }
  };

  window.common = {
    TEMPLATE: TEMPLATE,
    MAP: MAP,
    MAP_FILTER: MAP_FILTER,
    createElements: createElements,
    enableElement: enableElement,
    disableElement: disableElement
  };
})();
