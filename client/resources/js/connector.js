var socket = io.connect('http://192.168.1.61:3000');//configure this to point to the nodejs server

socket.on('connected', function (data) {
	console.log("connected",data);
    socket.emit('my other event', { my: 'data' });
});