import { textValue } from 'script.js';

function getApi(key){
    // Faire une requête GET à l'API
    fetch('https://api.tvmaze.com/search/shows?q='+key)
        .then(function (response) {
            // Vérifier le statut de la réponse
            if (!response.ok) {
                throw new Error('La requête a échoué avec un statut ' + response.status);
            }
            // Convertir la réponse en JSON
            return response.json();
        })
        .then(function (data) {
            // Faire quelque chose avec les données de la réponse
            console.log(data);
        })
        .catch(function (error) {
            // Gérer les erreurs
            console.error('Une erreur s\'est produite :', error);
    });
}