import axios from "axios";
import { markupImagesCard } from "./index"
// import {onBtnLoadClick} from "./index"

export async function getImages(name,page,per_page) {
  
    const response = await axios.get("https://pixabay.com/api/", {
        params: {
            key: "24448107-fedb049fce312b69b088c85de",
            q:`${name}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page,
        }
    });
    
    markupImagesCard(response.data)
    return response.data;
     
}