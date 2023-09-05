import { createApi } from 'unsplash-js';
import AOS from 'aos';

document.addEventListener('DOMContentLoaded', () => {
  const unsplash = createApi({ accessKey: 'HT8RFkUehZBd1F-rWSr1yMCah0y41WHrWzPzSvY6l1E' });

  const galleryWrapper = document.querySelector('.gallery__container');
  const gallery = document.querySelector('#gallery');
  const form = document.querySelector('.search');
  const input = document.querySelector('.search__input');

  const searchBtn = document.querySelector('.search__btn');
  const cleanBtn = document.querySelector('.search__btn-close');

  const loader = document.querySelector('.loader');

  function setFocus() {
    input.focus();
  }
  setFocus();

  unsplash.photos.getRandom({
    count: 24,
  })
    .then(result => {
      loader.classList.add('active');
      renderGallery(result.response);
      return result;
    })
    .then(() => {
      loader.classList.remove('active');
    })
    .catch(error => {
      console.log(error.message);
      const message = document.createElement('div');
      message.classList.add('gallery__message');

      message.textContent = 'Ошибка сервера. Попробуйте зайти позже.';

      galleryWrapper.append(message);
    })

  const showMoreBtn = document.createElement('button');
  showMoreBtn.classList.add('gallery__btn');
  showMoreBtn.textContent = 'Show more photos';

  galleryWrapper.append(showMoreBtn);

  //button show more
  let currentPage= 1;
  showMoreBtn.addEventListener('click', () => {
    currentPage++

    if (input.value.length > 0) {
      const str = input.value.trim().toLowerCase();
      unsplash.search.getPhotos({
        query: str,
        page: currentPage,
        per_page: 24,
      })
        .then(result => {
          loader.classList.add('active');
          renderGallery(result.response.results);
        })
        .then(() => {
          loader.classList.remove('active');
        })
    } else {
      unsplash.photos.getRandom({
        count: 24,
      })
        .then(result => {
          renderGallery(result.response);
        })
    }

  })

  input.addEventListener('input', ()=> {
    searchBtn.style.display = 'block';
    cleanBtn.style.display = 'block';
  })

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const str = input.value.trim().toLowerCase();

    unsplash.search.getPhotos({
      query: str,
      per_page: 24,
    })
      .then(result => {
        gallery.innerHTML = '';
        cleanBtn.style.display = 'block';
        renderGallery(result.response.results);
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        return result;
      })
  })

  cleanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    input.value = '';
    searchBtn.style.display = 'block';

    unsplash.photos.getRandom({
      count: 24,
    })
      .then(result => {
        renderGallery(result.response);
        return result;
      })
      .catch(error => {
        console.log(error.message);
        const message = document.createElement('div');
        message.classList.add('gallery__message');

        message.textContent = 'Server error. Try to come back later.';

        galleryWrapper.append(message);
      })
  })

  function renderGallery(arr) {
    for (let item of arr) {
      const galleryItem = document.createElement('a');
      galleryItem.classList.add('gallery__item');
      galleryItem.href = item.urls.regular;
      galleryItem.setAttribute('data-aos', 'zoom-in-up');
      galleryItem.setAttribute('data-aos-easing', 'ease-in-sine');
      galleryItem.target = '_blank'

      const image = document.createElement('img');
      image.classList.add('gallery__image');

      image.src = item.urls.small;
      image.alt = item.alt_description;

      galleryItem.append(image);
      gallery.append(galleryItem);
    }
    return gallery;
  }

  AOS.init();

})
