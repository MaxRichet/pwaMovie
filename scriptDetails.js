document.addEventListener("DOMContentLoaded", async function() {

    const result = document.getElementById('result');
    const params = new URLSearchParams(window.location.search);
    const k = params.get('parametre');

    const data = await cacheData('https://api.tvmaze.com/search/shows?q=girls');
    console.log(data);

    let div = document.createElement("div");
    div.classList.add("findDetail");

    let img = document.createElement("img");
    img.setAttribute("src", data[k].show.image.original);

    let h1 = document.createElement("h1");
    h1.textContent = data[k].show.name;

    div.appendChild(img);
    div.appendChild(h1);

    result.appendChild(div);

    async function cacheData(url, request) {
        try {
            const cacheResponse = await caches.match(url);
            if (!cacheResponse) {
                throw new Error('Les données ne sont pas encore mises en cache.');
            }
            const responseData = await cacheResponse.json();
            return responseData;
        } catch (error) {
            throw new Error('Impossible de récupérer les données en cache. = '+url);
        }
    }
});