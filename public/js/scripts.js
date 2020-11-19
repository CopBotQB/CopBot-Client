/* function submit() {
    console.log('Working')
    alertify.set('notifier', 'position', 'bottom-left');
    const input = document.getElementById("tokenInput").value
    axios.get('https://copbot-e0c62.firebaseio.com/.json').then((response) => {
        if (response.data[input]) {
            alertify.confirm('Confirmation', 'I understand that this token will only work on this device, and that using this program on a device that you are not using for the tournament or sharing your token with a third party violates the tournament rules.', function () {
                    localStorage.setItem('token', input);
                    axios.patch('https://copbot-e0c62.firebaseio.com/' + input + '.json', {
                        online: true,
                    });
                    alertify.success('Valid Token Received');
                    alertify.success('Sending You To Discord!');
                    setTimeout(function () {
                        window.location.replace("https://discord.com/app");
                    }, 2000);
                }
                , function () {
                    alertify.error('Canceled');
                });
        } else {
            alertify.error('Invalid Token!');
        }
    });
}

 */
