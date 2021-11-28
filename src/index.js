
import './css/style.css'
import { getImages } from "./api";
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
let inputValue = "";
// let gallery = {};



form.addEventListener("submit", onSubmitForm);
btnLoad.addEventListener("click", onBtnLoadClick)



async function onSubmitForm(event) {
  event.preventDefault()
   
  inputValue = event.target.elements[0].value
  console.log(inputValue)
  try {
    const data = await getImages(inputValue.trim(), page, per_page)
    console.log(data)
    if (inputValue === '') {
      Notify.failure('Enter your serch query, please :)');
      galleryItem.innerHTML = ''
      btnLoad.classList.add("hidden")
    }
    else if (data.totalHits < 1) {
      Notify.warning("Sorry, there are no images matching your search query. Please try again.", { timeout: 3000 });
      btnLoad.classList.add("hidden")
    }
    else {
      Notify.success(`Hooray! We found ${inputValue} images`, { timeout: 2500 })
      setTimeout(() => {
        btnLoad.classList.remove("hidden")
      }, 2000);
    
    }
  } catch (error) {
    console.log(error.message)
  }
  
  form.reset()
  
}

export function markupImagesCard(images) {
   console.log(images)
    const markup = images.hits.map(
        ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => 
          
            `<div class="photo-card">
            <a class="gallery-item" href="${largeImageURL}">
              <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" height="250"/>
               <div class="info">
                  <p class="info-item">
                    <b class="info-text">Likes</b>${likes}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Views</b>${views}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Comments</b>${comments}
                  </p>
                  <p class="info-item">
                    <b class="info-text">Downloads</b>${downloads}
                  </p>
              </div>
              </a>
             </div>`
                      
    ).join('');
 
  
        
  
galleryItem.insertAdjacentHTML('beforeend', markup);
    const simpleLightbox = new SimpleLightbox('.gallery a', { captionsData: "alt", captionDelay: 250 });
}

 async function onBtnLoadClick() {
   const data = await getImages(inputValue.trim(), page, per_page)
   page += 1
   if ((page * per_page) >= data.total) {
    btnLoad.classList.add("hidden");
    Notify.info("We're sorry, but you've reached the end of search results.", { timeout: 4000 },);
   }
  
  
}

