const electron = require('electron');
const {ipcRenderer} = electron;

const row = document.querySelector('.row');
const column = document.querySelectorAll('.column');
let elements = document.querySelectorAll('.element');

let toggled = false;
let autoScrolling = false;

ipcRenderer.on('ping', (event, message) => {
        
    let itemCounter = 0;

    async function processMessages(array) {

        for (const elem of array) {

            function placeContent(place) {
                if (elem.match(/.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
                    column[place].innerHTML += `<img class="element" src="${elem}">`;
                    // row.innerHTML += `<li class="source element">${elem}</li>`;
                } else if (elem.match(/.(m4v|mpg|mp4|webm|mov)$/i)) {
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

        function getContent() {
            elements = document.querySelectorAll('.element');
            let toggleStyle = document.querySelector('#toggleStyle');
            console.log(elements);
            elements.forEach((item) => {
                // console.log(item);
                item.addEventListener('click', () => {
                    item.classList.toggle('fullscreen');
                    document.body.classList.toggle('scrolLock');

                    function addStyleString(str) {
                        toggleStyle.innerHTML = str;
                        document.body.appendChild(toggleStyle);
                    }

                    if (toggled === false) {
                        addStyleString('video::-webkit-media-controls { bottom: 5vh; position: relative; } video::-webkit-media-controls-panel { background-image: linear-gradient(transparent, transparent) !important; }');
                        if (autoScrolling === true) {
                            pauseAutoScroll();
                            autoScrolling = false;
                        }
                        toggled = true;
                    } else {
                        toggleStyle.innerHTML = '';
                        toggled = false;
                    }

                })
            });
        }

        await getContent();
    }

    processMessages(message);

});

function autoScroll() {
    window.scrollBy(0, 1);
    scrolldelay = setTimeout(autoScroll, 10);
}

function pauseAutoScroll() {
    window.scrollBy(0, 0);
    clearTimeout(scrolldelay);
}

function pageScroll() {
    if (autoScrolling === false) {
        autoScroll();
        if (toggled === true) return pauseAutoScroll();
        autoScrolling = true;
    } else if (autoScrolling === true) {
        pauseAutoScroll();
        autoScrolling = false;
    }
}
