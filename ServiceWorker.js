const cache_elements = [
    "./",
    "https://unpkg.com/react@17/umd/react.production.min.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.production.min.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js",
    "./register.js",
    "./index.js"
]

const cache_name = "v3_cache_contador_react" //generalmente se le llama por la versión del serviceWorker

// este es el primer ciclo de vida del serviceWorker, lo que va a hacer esto es instalarse para cachaer las rutas para que mi serviceWorker me provea toda esta información y ya no tenga que estar haciendo peticiones a internet cada rato
self.addEventListener("install", (e) => {
    console.log(e)
    e.waitUntil( //con esto decimos que espere hasta que el evento suceda
        caches.open(cache_name).then(cache => {
            cache.addAll(cache_elements).then(() => { //esto me permite agregar el cache a todas las rutas
                //si todo sale bien
                self.skipWaiting(); // esto hace que si hay una nueva versión de caché lo va a skipear automáticamente, estoe evita cerrar y reabrir la página
            }).catch(console.log)
        })
    )
})

//En este ciclo procedemos a la activación del serviceWorker
self.addEventListener("activate", (e) => {
    //esta constante va a ser un array de todo el v1_cache_contador_react
    const cacheWhiteList = [cache_name];

    e.waitUntil(
        //el método keys directamente da todas las claves en caso de tener más de un caché instalado (más de una lista de caché)
        caches.keys().then(cacheNames => {
            console.log(cacheNames);
            //el promise.all puede resolver varias promesas dentro de un array, en este caso lo haremos para comparar los caches
            return Promise.all(cacheNames.map(cacheName => { //mapeamos cada cacheName para compararlos
                return cacheWhiteList.indexOf(cacheName) === -1 && caches.delete(cacheName)// si este nombre es el mismo (misma versión) que está en mi whiteList retorna cero, entonces borramos el caché anterior, estamos usando el operador ternario para este acción
            }))
        }).then(() => self.clients.claim()) //después de que se retorne que se pudo eliminar el caché viejo ejecutamos la arrow function que pide el caché actual
    )
})

//el fetch lo que hace es que se dispara cada vez que abrimos en el navegador, lo que hace es buscar una nueva versión de nuestros archivos y va a retornar o capturar las respuestas que tenga cacheadas, en caso de hacer una petición de manera dinámica fetch va a recibir la petición y cachearla
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            if (res) {
                return res;
            }
            
            return fetch(e.request);
        })        
   ) // este examina si existe el cache del contenido dentro de la ruta, si no, cachea, cada que se obtenga una respuesta se pregunta si vienen vacía (no existe), se retorna la respuesta, de lo contrario, retornamos la función fetch que va obtener el cache de internet
})