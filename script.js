let textValue = '';

const form = document.getElementById("myForm");
form.addEventListener("submit", function(event) {
    event.preventDefault();
    textValue = document.getElementById("textInput").value;
    fetchOrCacheData('https://api.tvmaze.com/search/shows?q='+textValue)
            .then(function (data) {
            const result = document.getElementById('result');
            for(i = 0; i <= data.length; i++){
                let divFind = document.createElement("div");
                divFind.classList.add("find");

                let anchorTag = document.createElement("a");
                anchorTag.setAttribute("href", "detail.html?parametre="+i);

                let imgElement = document.createElement("img");
                imgElement.setAttribute("src", data[i].show.image.original);

                let h1Element = document.createElement("h1");
                h1Element.textContent = data[i].show.name;

                anchorTag.appendChild(imgElement);
                anchorTag.appendChild(h1Element);

                divFind.appendChild(anchorTag);

                result.appendChild(divFind);
            }
            })
            .catch(function (error) {
                console.error('Une erreur s\'est produite :', error);
            });
            async function fetchOrCacheData(url) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('La requête a échoué avec un statut ' + response.status);
                    }
                    return response.json();
                } catch (error) {
                    const cacheResponse = await caches.match(url);
                    if (cacheResponse) {
                        return data = cacheResponse.json();
                    } else {
                        throw new Error('Impossible de récupérer les données en cache.');
                    }
                }
            }
});