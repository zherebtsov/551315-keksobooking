'use strict';

(function () {
  window.common = {
    TEMPLATE: document.querySelector('template').content,
    MAP: document.querySelector('.map'),

    createElements: function (data, elementTemplate, cbChangeElement, cbEvent) {
      var fragment = document.createDocumentFragment();

      data.forEach(function (value, index) {
        var element = elementTemplate.cloneNode(true);
        cbChangeElement(data, index, element, cbEvent); // правило изменения элемента
        fragment.appendChild(element);
      });

      return fragment;
    }
  };
})();
