const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const {app, BrowserWindow, Menu, ipcMain} = electron;
// Live reload for Electron
require('electron-reload')(__dirname);

// Set env
process.env.NODE_ENV = 'development';

let mainWindow;

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

    // Load content into HTML
    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('ping', getFiles(path.join(__dirname, 'images')));
    });
    
});



// Create menu template
const topMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'ctrl+Q',
                click() {
                    app.quit();
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