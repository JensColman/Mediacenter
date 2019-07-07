const electron = require('electron');
const { ipcRenderer } = electron;
const ul = document.querySelector('#content')

ipcRenderer.on('ping', (event, message) => {
    console.log(message);

    message.forEach((elem) => {
        if (elem.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
            ul.innerHTML += `<img class="element" src="${elem}">`;
            ul.innerHTML += `<li class="source element">${elem}</li>`;
        }

        if (elem.match(/.(m4v|mpg|mp4|webm)$/i)) {
            ul.innerHTML += `<video class="element" controls><source src="${elem}">Video is not supported.</video>`;
            ul.innerHTML += `<li class="source element">${elem}</li>`;
        }
    });

});