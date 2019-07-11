const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const {app, BrowserWindow, Menu, ipcMain, dialog} = electron;
// Live reload for Electron
require('electron-reload')(__dirname);

// Set env
process.env.NODE_ENV = 'development';

let mainWindow;
let pathToFollow = path.join(__dirname, 'images');
let autoScroll = true;

// Listen for the app to be ready
app.on('ready', () => {
    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load HTML into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'html/mainWindow.html'),
        protocol: 'file',
        slashes: true
    }));

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(topMenu);
    // Insert menu
    Menu.setApplicationMenu(mainMenu);

    if (pathToFollow === path.join(__dirname, 'images')) {
        mainWindow.webContents.executeJavaScript("defaultMainPage();");
    }

    dirList();
    
});

function dirList() {
    // Load content into HTML
    mainWindow.webContents.on('did-finish-load', () => {
        
        for (let obj in dirsToSend) {
            dirsToSend[obj]();
        }
    });
}

// Create a list of directories to load into the content
let dirsToSend = {
    'dir0': function() {
        return mainWindow.webContents.send('ping', getFiles(dirsArray[0]));
    }
};

let dirsArray = [
    pathToFollow
];



// Create menu template
const topMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open...',
                accelerator: process.platform == 'darwin' ? 'command+O' : 'ctrl+O',
                click() {
                    showOpen();
                }
            },
            {
                label: 'Add a directory...',
                accelerator: process.platform == 'darwin' ? 'command+shift+O' : 'ctrl+shift+O',
                click() {
                    showMore();
                }
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Auto scroll',
                accelerator: process.platform == 'darwin' ? 'command+L' : 'ctrl+L',
                click() {
                    mainWindow.webContents.executeJavaScript("pageScroll();");
                }
            }
        ]
    }
];

// If on Mac, add empty object to topMenu
if (process.platform == 'darwin') {
    topMenu.unshift({label: 'Electron'});
}

// Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
    topMenu.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'command+alt+I' : 'ctrl+alt+I',
                click(item, focusdWindow) {
                    focusdWindow.toggleDevTools();
                }
            },
            {
                role: 'Reload'
            }
        ]
    });
}

// Read all files in directory
function getFiles(dir, file) {
    file = file || [];
    var files = fs.readdirSync(dir);
    for (var i in files) {
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, file);
        } else {
            file.push(name);
        }
    }
    return file;
}



// Open Upload dialog
const showOpen = function () {
    dialog.showOpenDialog({
        filters: [
            { name: 'Folders', extensions: [''] }
        ],
        properties: [
            'openFile', 
            'openDirectory', 
            'createDirectory'
        ]}, 
        function(files) {
            if (files !== undefined) {
                pathToFollow = files.toString();

                dirsToSend = {
                    'dir0': function () {
                        return mainWindow.webContents.send('ping', getFiles(dirsArray[0]));
                    }
                };

                dirsArray = [
                    pathToFollow
                ];

                mainWindow.reload();
            }
        }
    );
};

const showMore = function () {
    dialog.showOpenDialog({
        filters: [
            { name: 'Folders', extensions: [''] }
        ],
        properties: [
            'openFile',
            'openDirectory',
            'createDirectory'
        ]
    },
        function (files) {
            if (files !== undefined) {
                pathToFollow = files.toString();
                dirsArray.push(files.toString());

                let i = 0;
                let j = 0;
                for (let obj in dirsToSend) {
                    i++;
                    j++;
                }

                let dirName = `dir${i}`;

                dirsToSend[dirName] = function() {
                    return mainWindow.webContents.send('ping', getFiles(dirsArray[j]));
                };

                console.log(files.toString());
                
                mainWindow.reload();
            }
        }
    );
};

// Set storage engine for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images/');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init upload
const upload = multer({
    storage: storage
});