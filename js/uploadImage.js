'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var isImage = function (file) {
    var fileName = file.name.toLowerCase();

    return FILE_TYPES.some(function (type) {
      return fileName.endsWith(type);
    });
  };

  window.uploadImage = function (inputElement, onLoad) {
    var fileList = inputElement.files;
    var images = [];

    [].forEach.call(fileList, function (file) {
      if (isImage(file)) {
        var reader = new FileReader();

        reader.addEventListener('load', function () {
          images.push(reader.result);

          if (images.length === fileList.length) {
            onLoad(images);
          }
        });

        reader.readAsDataURL(file);
      } else {
        window.toast.showMessage('Пожалуйста выберите картинку с одним из этих форматов: *.gif, *.jpg, *.jpeg, *.png');
      }
    });
  };

})();
