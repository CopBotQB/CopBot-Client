function submit() {
    console.log('Working')
    alertify.set('notifier','position', 'bottom-left');
    const input = document.getElementById("tokenInput").value
    axios.get('https://copbot-e0c62.firebaseio.com/.json').then((response) => {
        if (response.data[input]) {
            localStorage.setItem('token', input);
            console.log('hi');
            console.log(response.data[input]);
            axios.patch('https://copbot-e0c62.firebaseio.com/' + input + '.json', {
                    online: true,
            });
            alertify.success('Valid Token Received');
            alertify.success('Sending You To Discord!')
            setTimeout(function(){ window.location.replace("https://discordapp.com"); }, 2000);
        } else {
            alertify.error('Invalid Token!');
        }
    });
}
