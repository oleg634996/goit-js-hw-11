import "./css/style.css";
import { getImages } from "./api.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.2.min.css";
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector("#search-form");
const galleryItem = document.querySelector(".gallery");
const btnLoad = document.querySelector(".load-more");

btnLoad.classList.add("hidden");
let page = 1;
const per_page = 40;
let inputName = "";
let gallery = {};

form.addEventListener("submit", onSubmitForm);
btnLoad.addEventListener("click", onBtnLoadClick)

async function onSubmitForm(event) {
    event.preventDefault();
    galleryItem.innerHTML = "";
    page = 1;
    btnLoad.classList.add("hidden");
    inputName = event.target.searchQuery.value;

  if (inputName.trim() === "") {
      return  Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    };
  
    try {
      const data = await getImages(inputName.trim(), page, per_page);
      
        if (data.hits.length===0) {
          Notify.failure("Sorry, there are no images matching your search query. Please try again.", { timeout: 3000 });
        } else {
          Notify.success(`Hooray! We found ${data.totalHits} images`, { timeout: 2500 });
          markImageCard(data.hits);
          gallery = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
         
          (page * per_page) <= data.totalHits && btnLoad.classList.remove("hidden");
          
           page += 1;
        }
      
    }
    catch (error) {
      
      console.log(error.message);
  }
  form.reset()
};

async function onBtnLoadClick() {
  try {
    const data = await getImages(inputName.trim(), page, per_page);
    
      if ((page * per_page) >= data.totalHits) {
        btnLoad.classList.add("hidden");
        Notify.info("We're sorry, but you've reached the end of search results.", { timeout: 4000 },);
       }
      
    markImageCard(data.hits);
    gallery.refresh();
    page += 1;

      const {height} = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }
    catch(error) {
      console.log(error.message)
    }
}


function markImageCard(images) {
  const markUp = images.map(image => {
    const { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
    return `<a class="gallery__item" href="${largeImageURL}">
    <div class="photo-card">
      <div class="wrapper-img">
        <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" height="250"/>
      </div>  
      <div class="info">
        <p class="info-item">
          <b>Likes </b>${likes}
        </p>
        <p class="info-item">
          <b>Views </b>${views}
        </p>
        <p class="info-item">
          <b>Comments </b>${comments}
        </p>
        <p class="info-item">
          <b>Downloads </b>${downloads}
        </p>
      </div>
    </div>
  </a>`;
  }).join("");
  galleryItem.insertAdjacentHTML("beforeend", markUp)
};






