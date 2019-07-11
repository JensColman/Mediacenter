const electron = require('electron');
const {ipcRenderer} = electron;

const row = document.querySelector('.row');
const column = document.querySelectorAll('.column');
let elements = document.querySelectorAll('.element');

let toggled = false;
let autoScrolling = false;
let contentArray = [];

ipcRenderer.on('ping', (event, message) => {
        
    let itemCounter = 0;
    // console.log(message);

    async function processMessages(array) {

        for (const elem of array) {

            function placeContent(place) {

                if (elem.match(/.(jpg|jpeg|png|gif|bmp|webp|m4v|mpg|mp4|webm|mov)$/i)) {
                    contentArray.push(elem);
                    // console.log('contentArray:', contentArray);
                }

                if (elem.match(/.(jpg|jpeg|png|gif|bmp|webp)$/i)) {
                    column[place].innerHTML += `<img class="element" src="${elem}">`;
                    placement(place);
                } else if (elem.match(/.(m4v|mpg|mp4|webm|mov)$/i)) {
                    column[place].innerHTML += `<video class="element" controls><source src="${elem}">Video is not supported.</video>`;
                    placement(place);
                }
            }

            function placement(place) {
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
            let contentNavigation = document.querySelector('#contentNavigation');
            let previousContent = document.querySelector('#previousContent');
            let nextContent = document.querySelector('#nextContent');
            console.log(elements);

            elements.forEach((item, index) => {
                // console.log(item);
                item.addEventListener('click', () => {
                    item.classList.toggle('fullscreen');
                    document.body.classList.toggle('scrolLock');

                    function addStyleString(str) {
                        toggleStyle.innerHTML = str;
                        document.body.appendChild(toggleStyle);
                    }

                    function navigateContent() {
                        console.log('Geklikte foto');
                        // console.log('Foto voor geklikte foto');
                        contentNavigation.style.display = 'block';

                        previousContent.addEventListener('click', () => {
                            console.log('Vorige foto');
                            item.classList.toggle('fullscreen');
                            elements[index - 1].classList.toggle('fullscreen');
                        });

                        nextContent.addEventListener('click', () => {
                            console.log('Volgende foto');
                        });
                    }

                    if (toggled === false) {
                        addStyleString('video::-webkit-media-controls { bottom: 5vh; position: relative; } video::-webkit-media-controls-panel { background-image: linear-gradient(transparent, transparent) !important; }');
                        if (autoScrolling === true) {
                            pauseAutoScroll();
                            autoScrolling = false;
                        }
                        // navigateContent();
                        toggled = true;
                    } else {
                        toggleStyle.innerHTML = '';
                        contentNavigation.style.display = 'none';
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

function defaultMainPage() {
    document.body.innerHTML = `<h3>Press ${process.platform == 'darwin' ? '&#8984+O' : 'Ctrl+O'} to open your favorite photos and videos.</h3>`;
}

// defaultMainPage();