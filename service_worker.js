const VERSION = "v30";
const HOST = location.protocol+'//'+location.host;
const FILECACHE = [
    HOST+"/css/main.css",
    "index.html",
    HOST+"/detail.html",
    HOST+"/script.js",
    HOST+"/scriptDetails.js",
    HOST+"/manifest.json", 
    HOST+'/img/icon512.png'
]


self.addEventListener("install", (e) => {
    self.skipWaiting();
    console.log("Version :", VERSION);
  
    // mise en cache des fichiers souhaités
    e.waitUntil(
      (async () => {
        const cache = await caches.open(VERSION);
  
        //on veut que tous les ajouts soit finis avant de faire la suite donc on utilise un Promise.all
        await Promise.all(
          [...FILECACHE].map(
              (path) => { return cache.add(path) }
          )
        )
      })()
    );
  });
  
  self.addEventListener('activate', (e) => {
  
      // Une fois qu'on active le service worker, on supprime le cache des anciennes versions
      e.waitUntil(
            (async () => {
              const keys = await caches.keys()
  
              await Promise.all(
                  keys.map((k) => {
                      if(!k.includes(VERSION))
                          return caches.delete(k);
                  })
              )
            })()
      )
  })
  
  self.addEventListener("fetch", (e) => {
    //stocker en cache via l'url
    console.log("Fetch :", e.request.url);
    console.log("Fetch :", e.request.mode);
  
    const link = "https://api.tvmaze.com/search/shows?q=";
    if (e.request.url.startsWith(link)) {
        e.waitUntil(
            (async () => {
                console.log(e.request.url);
                const cache = await caches.open(VERSION);
                cache.add(e.request.url);
            })()
        );
    }

    // si on lit une page, afficher un truc particulier
    if (e.request.mode === "navigate") {
      e.respondWith(
        (async () => {
          try {
            // on charge la page demandée depuis la mémoire
            const preloadedResponse = await e.preloadResponse;
            // on la trouve donc on la renvoie
            if (preloadedResponse) return preloadedResponse;
  
            return await fetch(e.request);
          } catch (error) {
            const cache = await caches.open(VERSION);


            const paths = ["index.html", 'https://api.tvmaze.com/search/shows?q=girls', "/detail.html"];
              
            const responses = await Promise.all(
              paths.map(path => cache.match(path))
            );
        
            const responseFound = responses.find(response => response !== undefined);
        
            return responseFound || new Response('Aucun fichier trouvé dans le cache.');
          }
        })()
      );
    }
    // pour les chargements qui ne sont pas en navigate
    else if (FILECACHE.includes(e.request.url)){
      //on sort le fichier du cache
      e.respondWith(caches.match(e.request))
    }
});