const fs = require('fs');
const axios = require('axios');
const {app, BrowserWindow} = require('electron');
const path = require('path');
const Store = require('electron-store');
const store = new Store();
store.set('active', true);

const express = require('express');
let expressApp = express();
//setting middleware
expressApp.use(express.static(__dirname + '/public'));
expressApp.use(express.static(__dirname + '/public/css'));
expressApp.use(express.static(__dirname + '/public/js'));
expressApp.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

let server = expressApp.listen(0, function () {
    console.log('Listening on port ' + server.address().port);
});


function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        icon: './icon.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true
        }
    });
    mainWindow.removeMenu();
    mainWindow.setTitle("CopBot Client");
    mainWindow.loadURL('http://localhost:' + server.address().port, {userAgent: 'Chrome/85.0.4183.87'});
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (BrowserWindow.getAllWindows()[0]) {
            if (BrowserWindow.getAllWindows()[0].isMinimized()) myWindow.restore()
            BrowserWindow.getAllWindows()[0].focus()
        }
    });
}


app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('ready', function () {
    setInterval(function () {
        if (BrowserWindow.getAllWindows().length > 0) {
            if (store.get('active')) {
                if (BrowserWindow.getAllWindows()[0].webContents.getURL().startsWith('http://localhost:4570')) {
                    BrowserWindow.getAllWindows()[0].webContents
                        .executeJavaScript('({...localStorage});', true)
                        .then(localStorage => {
                            if (localStorage.uid) {
                                store.set('uid', localStorage.uid);
                            }
                            if (localStorage.email) {
                                store.set('email', localStorage.email);
                            }
                            if (localStorage.idToken) {
                                store.set('idToken', localStorage.idToken);
                            }
                            if (localStorage["ready to update"]) {
                                store.set('ready to update', localStorage["ready to update"]);
                            }
                        });
                } else {
                }
                if (store.get('ready to update')) {
                    if (store.get('ready to update') === "true") {
                        axios.patch("https://copbot-e0c62.firebaseio.com/users/" + store.get('uid') + ".json?auth=" + store.get('idToken'), {
                            online: true,
                            tabbedIn: BrowserWindow.getAllWindows()[0].isFocused(),
                            editTimestamp: Date.now()
                        });
                    }
                }
            }
        }
    }, 1000);
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.\

app.on('window-all-closed', function () {
    store.set('active', false);
    if (store.get('ready to update') === "true") {
        store.set('ready to update', false);
        axios.patch("https://copbot-e0c62.firebaseio.com/users/" + store.get('uid') + ".json?auth=" + store.get('idToken'), {
            online: false,
            tabbedIn: false,
            editTimestamp: Date.now()
        }).then(() => {
            if (BrowserWindow.getAllWindows().length > 0) {
                BrowserWindow.getAllWindows()[0].webContents.session.clearStorageData({origin: 'http://localhost:4570/'}).then(() => {
                    app.quit();
                });
            } else {
                app.quit();
            }
        });
    } else {
        app.quit();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.