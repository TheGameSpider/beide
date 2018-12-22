$(document).ready(function(){
	$("#submit").click(function(){
		if($("#namein").val()!=="") {
			init($("#namein").val());
		}
		
	});
	function init(username) {
		var socket = io();
		$("#login").remove();
		socket.emit('add user', username);
		$("#input").attr("hidden", false);
		$("#input").focus();

		var score;

		c = document.getElementById("beide");
		ctx = c.getContext("2d");

		ctx.fillStyle = "black";

		var fail = document.getElementById("fail"); 
		var succ = document.getElementById("succ"); 

		var gs;

		var card1;
		var card2;

		var pat;
		var pa;


		function rf(seed) {
			switch(Math.floor(seed/8)) {
				case 5:
					return "Shadows Into Light";
				case 6:
					return "Dancing Script";
				case 7:
					return "Lobster";
				case 8:
					return "Cabin";
				case 9:
					return "Josefin Sans";
				case 10:
					return "Anton";
				case 11:
					return "ZCOOL QingKe HuangYou";
				case 12:
					return "Indie Flower";
				case 13:
					return "Dosis";
				case 14:
					return "Major Mono Display";
				default:
					return "Arial";
			}
		}

		function begin() {
			ctx.font = "100px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Waiting for players...", 800, 350);
			ctx.textAlign = "start";
			$("body").css('background-color','#ffcc99');
		}
		function reset(sco,winner) {
			ctx.clearRect(0, 0, c.width, c.height);
			$("#input").val("");
			$("#input").attr("disabled",true);
			if(!isNaN(sco)) {
				ctx.font = "50px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Score: "+sco, 800, 120);
				ctx.textAlign = "start";
			}
			if(winner) {
				ctx.font = "75px Arial";
				ctx.textAlign = "center";
				ctx.fillText(winner+" won!", 800, 500);
				ctx.textAlign = "start";
			}
			ctx.font = "100px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Game over", 800, 350);
			ctx.textAlign = "start";

			$("body").css('background-color','#ffcc99');
			gs = 0;
		}

		var score = 0;

		var arr1 = [];
		var arr2 = [];

		card1 = [];
		card2 = [];

		var sizes = [];

		socket.on('full',function(){
			setTimeout(function() {
				ctx.clearRect(0, 0, c.width, c.height);
				ctx.font = "100px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Server is full :(", 800, 350);
				ctx.textAlign = "start";
				$("body").css('background-color','#ffcc99');
			},500);
			
		});
		socket.on('users',function(users){
			$("#users").text("Players: " + users);
		});
		socket.on('table',function(table){
			$("#name").empty();
			table.forEach(function(userp){
				$("#name").append(userp+"<br>");
			});
		});
		socket.on('points',function(points){
			score = points;
			succ.play();
		});
		
		socket.on('numbers',function(numbers){
			arr1 = numbers.slice(0,8);
			arr2 = numbers.slice(8,16);
			card1 = numbers.slice(16,24);
			card2 = numbers.slice(24,32);
			sizes = numbers.slice(32,48);
		});
		
		socket.on('start',function() {
			generate(score);
		});

		socket.on('stop',function(winner) {
			reset(score,winner);
		});
		socket.on('fail',function() {
			fail.play();
			$("body").css('background-color','#ff3333');
			setTimeout(function(){
				$("body").css('background-color','#ccffcc');
			},300);
		});
		socket.on('reset',function(){
			score = 0;
		});
		socket.on('reload',function(){
			location.reload();
		});
		socket.on('close',function(){
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.font = "100px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Server closed :(", 800, 350);
			ctx.textAlign = "start";
		});
		socket.on('idle',function(){
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.font = "100px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Waiting for the admin...", 800, 350);
			ctx.textAlign = "start";
		});

		socket.on('notify',function(){
			ctx.clearRect(0, 0, c.width, c.height);
			ctx.font = "100px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Get ready", 800, 350);
			ctx.textAlign = "start";
			$("body").css('background-color','#ccffcc');
		});
		function generate(sc) {
			$("#input").attr("disabled",false);
			$("#input").val("");
			$("#input").focus();

			ctx.clearRect(0, 0, c.width, c.height);
			
			ctx.beginPath();
			ctx.arc(400, 320, 300, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.fillStyle = 'black';
			ctx.beginPath();
			ctx.arc(1200, 320, 300, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fillStyle = 'white';
			ctx.fill();
			ctx.fillStyle = 'black';

			ctx.font = "50px Arial";
			ctx.textAlign = "center";
			ctx.fillText("Score: "+sc, 800, 120);
			ctx.textAlign = "start";

			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 340, 120);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 500, 250);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 240, 200);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 150, 370);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 550, 390);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 360, 380);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 450, 480);
			arr1.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr1[0], 300, 550);
			arr1.shift();
			sizes.shift();

			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1140, 120);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1300, 250);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1040, 200);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 950, 370);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1350, 390);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1160, 380);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1250, 480);
			arr2.shift();
			sizes.shift();
			ctx.font = sizes[0]+"px " + rf(sizes[0]);
			ctx.fillText(arr2[0], 1100, 550);
			arr2.shift();
			sizes.shift();

		}

		begin();

		$("#input").on("keyup",function(){
			socket.emit('number', [username, $('#input').val()]);
		});
	}
});