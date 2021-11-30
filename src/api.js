import axios from "axios";

export async function getImages(name, page, per_page) {
    const searchParams = {
        params: {
            key: "24448107-fedb049fce312b69b088c85de",
            q:`${name}`,
            image_type: "photo",
            orientation: "horizontal",
            safesearch: true,
            page,
            per_page,
        }
    };

    const response = await axios.get("https://pixabay.com/api/", searchParams);
    return response.data;
};
