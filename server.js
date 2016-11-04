var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9000;



server.listen(port, function () {
  console.log('Server listening at port '  + port);
});


var numUsers = 0;

io.on('connection', function(socket) {

	console.log('a socket connected');
	var addedUser = false;

	socket.on('send_message', function(text) {
		
		console.log(socket.username);
		socket.broadcast.emit('receive_message', {
			username: socket.username,
			text: text
		});
	});


	socket.on('user_join', function(username) {
		if (addedUser)
			return false;

		socket.username = username;
		console.log('user_join: '+ socket.username);

		++ numUsers;
		addedUser = true;



		socket.emit('login', {
			numberUsers: numUsers
		});


		// emit all user
		socket.broadcast.emit('new_user_join', {
			username: socket.username,
			numUsers: numUsers
		});
	});


	socket.on('typing', function(data) {
		socket.broadcast.emit('typing', {
			username: socket.username
		});
	});

	socket.on('disconnect', function() {
			if (addedUser)
				-- numUsers;

			socket.broadcast.emit('user_left', {
				username: socket.username,
				numUsers: numUsers
			});
	})

});