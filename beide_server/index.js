


/***************************/
/*      CONFIGURATION      */
/***************************/
var client		/* client.js file */												= "client_en.js";
var port		/* Port */															= 80; 
var maxplayers	/* Maximum amount of players. More than 4 is not recommended*/		= 4;
var autostart	/* Start the game automatically? */									= true; 
var minplayers  /* Minimal amount of players to start the game automatically. */	= 2; 
var autostop	/* Number of points to win. Set to 0 to disable automatic stop. */	= 20; 
var motd		/* Message of the day */											= "First player with "+autostop+" points wins!";
// It can be anything!
//var motd = "Welcome to the Beide server!"
//var motd = "Good luck!"
/***************************/






console.log("Starting Beide server v1.0");

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const inquirer = require('inquirer');
const publicIp = require('public-ip');
var os = require('os');
var interfaces = os.networkInterfaces();

var addresses = [];
for (var k in interfaces) {
	for (var k2 in interfaces[k]) {
		var address = interfaces[k][k2];
		if (address.family === 'IPv4' && !address.internal) {
			addresses.push("http://"+address.address);
		}
	}
}
addresses2 = []
for (var k in interfaces) {
	for (var k2 in interfaces[k]) {
		var address = interfaces[k][k2];
		if (address.family === 'IPv4' && !address.internal) {
			addresses2.push("http://"+address.address+":"+port);
		}
	}
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/client.js', function(req, res){
  res.sendFile(__dirname + '/files/'+client);
});
app.get('/fail.mp3', function(req, res){
  res.sendFile(__dirname + '/files/fail.mp3');
});
app.get('/succ.mp3', function(req, res){
  res.sendFile(__dirname + '/files/succ.mp3');
});
app.get('/favicon.png', function(req, res){
  res.sendFile(__dirname + '/files/favicon.png');
});
app.get('/bootstrap.min.css', function(req, res){
  res.sendFile(__dirname + '/files/bootstrap.min.css');
});
app.get('/jquery-3.3.1.js', function(req, res){
  res.sendFile(__dirname + '/files/jquery-3.3.1.js');
});
app.get('/css.css', function(req, res){
  res.sendFile(__dirname + '/files/css.css');
});


var users = [];
var restart = true;
var numUsers = 0;
var gs = 0;
var pid = 0;

function init() {
var questions = [{
  type: 'input',
  name: 'command',
  message: ">",
}]

inquirer.prompt(questions).then(answers => {
	switch(answers['command']) {
		case "reset":
			io.emit('reload');
			init();
			return;
		case "users":
			console.log("Connected users:")
			Object.keys(io.sockets.sockets).forEach(function(id) {
				console.log(io.sockets.connected[id]['plid']+". "+io.sockets.connected[id]['username'] + ": " + io.sockets.connected[id]['points'] + " points");
			});
			init();
			return;
		case "start":
			if(gs==0) {
				gs=1;
				io.emit('notify');
				starting = setTimeout(function(){
					restart = true;
					start();
				},3000);
			} else {
				console.log("Game is already running")
			}
			init();
			return;
		case "stop":
			if(gs==1) {
				clearTimeout(starting);
				restart = false;
				var end = {};
				Object.keys(io.sockets.sockets).forEach(function(id) {
					end[io.sockets.connected[id]['username']] = io.sockets.connected[id]['points'];
				});
				var winner = Object.keys(end).reduce(function(a, b){ return end[a] > end[b] ? a : b });
				console.log(winner + " won!");
				stop(winner);
			} else {
				console.log("Game is not running");
			}
			init();
			return;
		case "help":
			console.log("----------HELP----------");
			console.log("");
			console.log("Commands:");
			console.log("reset - disconnects all users and reset score");
			console.log("users - shows current status of the game");
			console.log("start - manually starts the game");
			console.log("stop - stops the game");
			console.log("exit - Closes the server");
			console.log("help - shows this help");
			console.log("motd <message> - changes motd");
			console.log("set <player id> <points> - changes player's points");
			console.log("");
			console.log("How to play:");
			if (autostop!=0) {
				console.log("Find a number that is in both white circles. First player with "+autostop+" points wins.");
			} else {
				console.log("Find a number that is in both white circles. Player with the most points wins.");
			}
			init();
			return;
		case "exit":
			io.emit('close');
			console.log("Exiting...");
			setTimeout(function(){
				io.emit('reload');
				process.exit();
			},1000)
			return;
		default:
			var cmd = answers['command'].split(" ");
			if(cmd[0]=="motd") {
				var cmd2 = cmd;
				cmd2.shift()
				motd = cmd2.join(" ");
				console.log("motd changed to: "+motd);
			} else if(cmd[0]=="set") {
				var cmd2 = cmd;
				cmd2.shift()
				var playerid = cmd2[0];
				cmd2.shift();
				var pts = cmd2[0];
				Object.keys(io.sockets.sockets).forEach(function(id) {
					if(io.sockets.connected[id]['plid']==playerid) {
						io.sockets.connected[id]['points'] = pts;
					}
				});
				users.push(motd);
			    Object.keys(io.sockets.sockets).forEach(function(id) {
					users.push(io.sockets.connected[id]['username'] + ": " + io.sockets.connected[id]['points']);
				});
				io.emit('table',users);
				users = [];
			} else {
				console.log("Unknown command. Try 'help'");
			}
			init();
			return;
	}
	
})
}


function stop(winner) {
	gs=0;
	io.emit('stop',winner);
	io.emit('points',0);
	io.emit('reset');
	Object.keys(io.sockets.sockets).forEach(function(id) {
		io.sockets.connected[id]['points'] = 0;
	});
}
function start() {
	
	var numbers = [];
	var arr1 = [];
	var arr2 = [];
	var sizes = [];
	card1 = [];
	card2 = [];

	while(arr1.length < 8){
		var r = Math.floor(Math.random()*15) + 1;
		if(arr1.indexOf(r) === -1) arr1.push(r);
		if(card1.indexOf(r) === -1) card1.push(r);
	}

	while(arr2.length < 8){
		var r = Math.floor(Math.random()*15) + 1;
		if(arr2.indexOf(r) === -1) arr2.push(r);
		if(card2.indexOf(r) === -1) card2.push(r);
	}

	while(sizes.length < 16){
		var r = Math.floor(Math.random() * 74 ) + 40;
		if(sizes.indexOf(r) === -1) sizes.push(r);
	}

	numbers = arr1.concat(arr2,card1,card2,sizes);

	io.emit('numbers', numbers);
	io.emit('start', 0);
}

io.on('connection', function(socket){
	++numUsers;
	if(numUsers>maxplayers) {
		socket.emit('full');
		socket.disconnect(true);
		numUsers--;
	}
	restart = true;
	io.emit('users', numUsers);
	var addedUser = false;
	socket.on('add user', (username) => {
    if (addedUser) return;
	pid++;
    socket.username = username;
    socket.points = 0;
    socket.plid = pid;
    console.log(socket.username + " connected.");
    users.push(motd);
    Object.keys(io.sockets.sockets).forEach(function(id) {
		users.push(io.sockets.connected[id]['username'] + ": " + io.sockets.connected[id]['points']);
	});
	io.emit('table',users);
	users = [];
    addedUser = true;
    if(autostart==false) {
    	io.emit('idle');
    }
  });
  socket.on('disconnect', function(){
  	socket.points = 0;
  	users.push(motd);
  	Object.keys(io.sockets.sockets).forEach(function(id) {
		users.push(io.sockets.connected[id]['username'] + ": " + io.sockets.connected[id]['points']);
	});
	io.emit('table',users);
	users = [];
    console.log(socket.username +' disconnected.');
    numUsers--;
    io.emit('users', numUsers);
    if(numUsers<minplayers&&gs==1&&autostart==true) {
    	clearTimeout(starting);
		stop();
	}
  });
  socket.on('number', function(msg){
  	if(card1.indexOf(parseInt(msg[1]))>-1&&card2.indexOf(parseInt(msg[1]))>-1) {
		socket.points++;
		socket.emit('points',socket.points);
		users.push(motd);
		Object.keys(io.sockets.sockets).forEach(function(id) {
			users.push(io.sockets.connected[id]['username'] + ": " + io.sockets.connected[id]['points']);
		});
		io.emit('table',users);
		users = [];
		socket.broadcast.emit('fail');
		if(socket.points>autostop-1&&autostop!=0) {
			restart = false;
			stop(socket.username);
			console.log(socket.username+" won!");
		} else {
			start();
		}
	}
  });
});


setInterval(function(){
	if(numUsers>minplayers-1&&gs==0&&autostart==true&&restart==true) {
		gs=1;
		io.emit('notify');
		starting = setTimeout(function(){
			start();
		},3000);
	}
},1000);
init();
http.listen(port, function(){
	console.log('listening on *:'+port);

	if(port==80) {
		console.log('Use '+addresses.join(" or ")+" for LAN connections.");
	} else {
		console.log('Use '+addresses2.join(" or ")+" for LAN connections.");
	}
	(async () => {
		if(port==80) {
			console.log('Use http://'+ await publicIp.v4() +" for external connections (port "+port+" must be open)");
		} else {
			console.log('Use http://'+ await publicIp.v4() +":"+port+" for external connections (port "+port+" must be open)");
		}
	})();
});