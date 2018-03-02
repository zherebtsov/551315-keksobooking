'use strict';

(function () {
  var Url = {
    GET: 'https://js.dump.academy/keksobooking/data',
    POST: 'https://js.dump.academy/keksobooking'
  };
  var XHR_TIMEOUT = 10000; // 10c
  var SUCCESS_CODE = 200;

  var request = function (method, url, loadingMsg, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      window.toast.hide();
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка, статус ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Ошибка, превышено время ожидания ответа (' + xhr.timeout + ' мс)');
    });

    xhr.timeout = XHR_TIMEOUT;

    xhr.open(method, url);

    if (typeof data !== 'undefined') {
      xhr.send(data);
    } else {
      xhr.send();
    }

    window.toast.show(loadingMsg);
  };

  var get = function (onLoad, onError) {
    request('GET', Url.GET, 'Загрузка...', onLoad, onError);
  };

  var post = function (data, onLoad, onError) {
    request('POST', Url.POST, 'Отправка...', onLoad, onError, data);
  };

  window.backend = {
    get: get,
    post: post
  };
})();
