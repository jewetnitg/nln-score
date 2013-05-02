var socket = io.connect('http://54.214.3.38:3000');//configure this to point to the nodejs server

socket.on('connected', function (data) {
	console.log("connected",data);
    socket.emit('my other event', { my: 'data' });
});
