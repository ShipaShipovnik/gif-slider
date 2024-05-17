(function () {
    const GIPHY_KEY = 'oBP3zfHFymvZU0w0k5mqaYSqKf5cQd4i';

    function giphySearch(keyword) {
      return fetch(`http://api.giphy.com/v1/gifs/search?q=${keyword}&api_key=${GIPHY_KEY}&limit=25`)
        .then(response => response.json())
    }

    let imageUrls = []; // Массив для хранения ссылок на изображения

    function appendImage(img, url) {
      let $div = $('<div class="swiper-slide"></div>');
      $div.attr('data-index', imageUrls.length); // Добавить атрибут data-index
      $div.append(img);
      $('#thumbs').append($div);
      imageUrls.push(url); // Сохранить ссылку на изображение
    }

    function showLoader() {
      $('.loader-wrapper').addClass('shown');
    }

    function hideLoader() {
      $('.loader-wrapper').removeClass('shown');
    }

    (function listenOnFormSubmit() {
      $('#searchForm').submit((ev) => {
        ev.preventDefault();
        let $input = $('#searchInput');

        main($input.val());
      });
    })();

    function onImageLoad(img) {
      return new Promise((resolve, reject) => {
        img.onload = resolve;
      })
    }

    async function main(searchKeyword) {
      const result = await giphySearch(searchKeyword);
      $('#thumbs').html('');
      showLoader();
      let promises = [];
      result.data.forEach(data => {
        console.log(data.images.original.url);
        let img = new Image();
        img.src = data.images.original.url;
        promises.push(onImageLoad(img));
        appendImage(img, data.images.original.url);
      })

      $('.swiper-slide').on('click', function () {
        var index = $(this).attr('data-index');
        var url = imageUrls[index];
        window.location.href = url; // Переход по ссылке фото
      });
      await Promise.all(promises)
      console.log("All loaded");

      hideLoader();
     
    };

})();