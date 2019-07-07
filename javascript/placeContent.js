const electron = require('electron');
const { ipcRenderer } = electron;
const row = document.querySelector('.row');
const column = document.querySelectorAll('.column');

ipcRenderer.on('ping', (event, message) => {

        for (let i=0; i<message.length; i++) {
            if (!message[i].match(/.(jpg|jpeg|png|gif|bmp)$/i) || message[i].match(/.(m4v|mpg|mp4|webm)$/i)) {
                message.splice(i, 1);
            }  
        }
        
    let itemCounter = 0;

    // message.forEach((elem, index) => {

    //     function placeContent(place) {
    //         if (elem.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
    //             column[place].innerHTML += `<img class="element" src="${elem}">`;
    //             // row.innerHTML += `<li class="source element">${elem}</li>`;
    //         }

    //         if (elem.match(/.(m4v|mpg|mp4|webm)$/i)) {
    //             column[place].innerHTML += `<video class="element" controls><source src="${elem}">Video is not supported.</video>`;
    //             // row.innerHTML += `<li class="source element">${elem}</li>`;
    //         }

    //         if (place === 3) {
    //             itemCounter = 0;
    //         } else {
    //             itemCounter++;
    //         }
    //     }

    //     placeContent(itemCounter);

    // });

    async function processMessages(array) {

        for (const elem of array) {

            function placeContent(place) {
                if (elem.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
                    column[place].innerHTML += `<img class="element" src="${elem}">`;
                    // row.innerHTML += `<li class="source element">${elem}</li>`;
                }

                if (elem.match(/.(m4v|mpg|mp4|webm)$/i)) {
                    column[place].innerHTML += `<video class="element" controls><source src="${elem}">Video is not supported.</video>`;
                    // row.innerHTML += `<li class="source element">${elem}</li>`;
                }

                if (place === 3) {
                    itemCounter = 0;
                } else {
                    itemCounter++;
                }
            }

            await placeContent(itemCounter);
        }
    }

    processMessages(message);

});