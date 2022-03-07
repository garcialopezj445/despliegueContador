// de esta manera es que comprobamos si existe un serviceworker en el navegador
if(navigator.serviceWorker){
    console.log("existe serivceWorker");
    navigator.serviceWorker.register("./ServiceWorker.js"); // con esto registramos un serviceworker en el cual vamos a trabajar
    console.log("serivceWorker registrado");
}