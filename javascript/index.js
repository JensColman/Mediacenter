const electron = require('electron');
const { ipcRenderer } = electron;
const row = document.querySelector('.row');
const column = document.querySelectorAll('.column');

ipcRenderer.on('ping', (event, message) => {
    console.log(message);
    // console.log(message.length);

        for (let i=0; i<message.length; i++) {
            // if (message[i].match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
            //     console.log('image');
            // } else if (message[i].match(/.(m4v|mpg|mp4|webm)$/i)) {
            //     console.log('video');
            // } else {
            //     message.splice(i, 1);
            //     console.log(message);
            // }

            if (!message[i].match(/.(jpg|jpeg|png|gif|bmp)$/i) || message[i].match(/.(m4v|mpg|mp4|webm)$/i)) {
                message.splice(i, 1);
                console.log(message);
            }
            
        }
        
    let itemCounter = 0;

    message.forEach((elem, index) => {

        // switch (itemCounter) {
        //     case 0:
        //         placeContent(0);
        //         break;

        //     case 1:
        //         placeContent(1);
        //         break;

        //     case 2:
        //         placeContent(2);
        //         break;
                
        //     case 3:
        //         placeContent(3);
        //         break;
        // }

        // const itemSwitch = (number) => ({
        //     0: placeContent(0),
        //     1: placeContent(1),
        //     2: placeContent(2),
        //     3: placeContent(3)
        // });

        // itemSwitch(itemCounter);

        function placeContent(place) {
            if (elem.match(/.(jpg|jpeg|png|gif|bmp)$/i)) {
                column[place].innerHTML += `<img class="element" src="${elem}">`;
                // row.innerHTML += `<li class="source element">${elem}</li>`;
            }

            if (elem.match(/.(m4v|mpg|mp4|webm)$/i)) {
                column[place].innerHTML += `<video class="element" controls><source src="${elem}">Video is not supported.</video>`;
                // row.innerHTML += `<li class="source element">${elem}</li>`;
            }

            // console.log(place);
            if (place === 3) {
                itemCounter = 0;
            } else {
                itemCounter++;
            }
        }

        placeContent(itemCounter);

    });

});