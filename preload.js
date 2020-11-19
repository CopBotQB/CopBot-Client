const {shell} = require('electron');
const axios = require('axios');

window.addEventListener('DOMContentLoaded', () => {
        if (window.location.href.startsWith('http://localhost:4570')) {
            setInterval(function () {
                if (document.getElementById('redirect').innerHTML === "not busy") {
                    document.getElementById('redirect').innerHTML = "busy";
                    setTimeout(function () {
                        shell.openExternal('https://copbot-e0c62.web.app/');
                    }, 2000)
                }
                if (document.getElementById('outdated-version').innerHTML === "yes") {
                    document.getElementById('outdated-version').innerHTML = "no";
                    shell.openExternal('https://bubblebyb.github.io/copbotqb/downloads/');
                    setTimeout(function () {
                        window.close();
                    }, 1000);
                }
            }, 1000);
        }
    }
);