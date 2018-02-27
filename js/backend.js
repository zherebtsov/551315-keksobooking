'use strict';

(function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var POST_URL = 'https://js.dump.academy/keksobooking';
  var XHR_TIMEOUT = 10000; // 10c

  var request = function (method, url, loadingMsg, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      window.toast.hide();
      if (xhr.status === 200) {
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
    request('GET', GET_URL, 'Загрузка...', onLoad, onError);
  };

  var post = function (data, onLoad, onError) {
    request('POST', POST_URL, 'Отправка...', onLoad, onError, data);
  };

  window.backend = {
    get: get,
    post: post
  };
})();
