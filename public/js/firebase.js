localStorage.setItem('ready to update', "false");

axios.get("https://copbot-e0c62.firebaseio.com/_internal/.json")
    .then(result => {
        if (!(result.data.client.version === "1.0.0")) {
            alertify.alert('Outdated Client', 'A new version of CopBot Client has been released and the version on your device is now outdated. You must go and download the new version before continuing.', function () {
                document.getElementById('outdated-version').innerHTML = "yes";
            });
        }
    });

let firebaseConfig = {
    apiKey: "AIzaSyA9Kc7y9pSppfPF5U3RqNndquVRopMMHYc",
    authDomain: "copbot-e0c62.firebaseapp.com",
    databaseURL: "https://copbot-e0c62.firebaseio.com",
    projectId: "copbot-e0c62",
    storageBucket: "copbot-e0c62.appspot.com",
    messagingSenderId: "714029503373",
    appId: "1:714029503373:web:b736825356770a1562e3c4",
    measurementId: "G-YZ6FY8GR02"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function googleOauth2() {
    if (!firebase.auth().currentUser) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');
        firebase.auth().signInWithRedirect(provider);
    } else {
        firebase.auth().signOut();
    }
}

function initApp() {
    // Result from Redirect auth flow.
    // [START getidptoken]
    firebase.auth().getRedirectResult().then(function (result) {
        if (result.credential) {
            let token = result.credential.accessToken;
        }
        let user = result.user;
        if (user) {
            localStorage.setItem('uid', user.uid);
            localStorage.setItem('email', user.email);
            firebase.auth().currentUser.getIdToken(true).then(idToken => {
                localStorage.setItem('idToken', idToken)
                axios.get("https://copbot-e0c62.firebaseio.com/users/" + firebase.auth().currentUser.uid + ".json?auth=" + idToken)
                    .then(result => {
                        if (result.data) {
                            alertify.success('Valid login received');
                            alertify.success('Redirecting to Discord');
                            localStorage.setItem('ready to update', "true");
                            setTimeout(function () {
                                window.location.replace("https://discord.com/app")
                            }, 3000);

                        } else {
                            alertify.error('You must register with the web client first');
                            alertify.error('Redirecting to the web client');
                            document.getElementById('redirect').innerHTML = "not busy"
                        }
                    })
                    .catch(err => {
                    })
            }).catch(err => {
                throw err
            });
        }
    }).catch(function (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        let email = error.email;
        let credential = error.credential;
        if (errorCode === 'auth/account-exists-with-different-credential') {
            alert('You have already signed up with a different auth provider for that email.');
        } else {
            console.error(error);
        }
    });

}

window.onload = initApp();


