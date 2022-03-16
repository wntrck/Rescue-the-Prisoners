function start() {

	$("#start").hide();
	
	$("#bgGame").append("<div id='player'></div>");
	$("#bgGame").append("<div id='enemy1'></div>");
	$("#bgGame").append("<div id='enemy2'></div>");
	$("#bgGame").append("<div id='prisoner'></div>");
	$("#bgGame").append("<div id='scoreboard'></div>");
	$("#bgGame").append("<div id='hp'></div>");

	var game = {}
	var key = {
		W: 87,
		S: 83,
		D: 68,
		A: 65,
		F: 70
		}
	var speedH = 4;
	var speedT = 2;
	var speedP = 2;
	var positionY = parseInt(Math.random() * (334) + 10);
	var canShoot = true;
	var gameover = false;
	var points = 0;
	var safe = 0;
	var lost = 0;
	var hp = 3;

	var audioShot = document.getElementById("audioShot");
	var audioExplosion = document.getElementById("audioExplosion");
	var audioMainTheme = document.getElementById("audioMainTheme");
	var audioGameover = document.getElementById("audioGameover");
	var audioLost = document.getElementById("audioLost");
	var audioSafe = document.getElementById("audioSafe");

	audioMainTheme.addEventListener("ended", function(){ audioMainTheme.currentTime = 0; audioMainTheme.play(); }, false);
	audioMainTheme.play();
	audioMainTheme.loop = true;
	audioMainTheme.currentTime = 0;

	game.pressed = [];
	$(document).keydown(function(e){
		game.pressed[e.which] = true;
		});
	
	
		$(document).keyup(function(e){
		   game.pressed[e.which] = false;
		});

	game.timer = setInterval(loop,20);
	
	function loop() {
	
	moveBg();
	movePlayer();
	moveEnemy1();
	moveEnemy2();
	movePrisoner();
	coll();
	score();
	setHp();
	}

	function moveBg() {
	
		left = parseInt($("#bgGame").css("background-position"));
		$("#bgGame").css("background-position",left-1);
	}

	function movePlayer() {
	
		if (game.pressed[key.W]) {
			
			var top = parseInt($("#player").css("top"));
			if (top >= 10) {
				$("#player").css("top",top-7);
			}
		}
		
		if (game.pressed[key.S]) {
			
			var top = parseInt($("#player").css("top"));
			if (top <= 455) {
				$("#player").css("top",top+7);
			}	
		}

		if (game.pressed[key.A]) {

			var left = parseInt($("#player").css("left"));
			if (left >= 8) {
				$("#player").css("left", left-7);
			}
		}

		if (game.pressed[key.D]) {

			var left = parseInt($("#player").css("left"));
			if (left <= 530) {
				$("#player").css("left", left+7);
			}
		}

		if (game.pressed[key.F]) {
			
			shot();
			}
		}
	
	function moveEnemy1() {

		positionX = parseInt($("#enemy1").css("left"));
		$("#enemy1").css("left",positionX-speedH);
		$("#enemy1").css("top",positionY);
			
		if (positionX<=0) {
		positionY = parseInt(Math.random() * (334) + 10);
		$("#enemy1").css("left",810);
		$("#enemy1").css("top",positionY);
			
		}
	}

	function moveEnemy2() {

		positionX = parseInt($("#enemy2").css("left"));
		$("#enemy2").css("left", positionX-speedT);

		if (positionX <= 0) {
			$("#enemy2").css("left",810);
		}

	}

	function movePrisoner() {

		positionX = parseInt($("#prisoner").css("left"));
		$("#prisoner").css("left", positionX + speedP);

		if (positionX >= 880) {
			$("#prisoner").css("left", 10);
			safe++;
			points = points + 10;
			audioSafe.play();
		}
	}

	function shot() {
	
		if (canShoot == true) {

			audioShot.play();
			canShoot = false;

			topo = parseInt($("#player").css("top"));
			posX = parseInt($("#player").css("left"));
			shotX = posX + 110;
			topShot = topo + 86;
			$("#bgGame").append("<div id='shot'></div");
			$("#shot").css("top", topShot);
			$("#shot").css("left", shotX);
			
			var timeShot = window.setInterval(doShot, 3);
		} 
   	    function doShot() {
			positionX = parseInt($("#shot").css("left"));
			$("#shot").css("left", positionX + 15); 

			if (positionX > 900) {			
				window.clearInterval(timeShot);
				timeShot = null;
				$("#shot").remove();
				canShoot = true;
			}
		}
	}

	function coll() {
		var collision1 = ($("#player").collision($("#enemy1")));
		var collision2 = ($("#player").collision($("#enemy2")));
		var collision3 = ($("#shot").collision($("#enemy1")));
		var collision4 = ($("#shot").collision($("#enemy2")));
		var collision5 = ($("#enemy2").collision($("#prisoner")));
	
		if (collision1.length > 0) {

			hp--;
			enemy1X = parseInt($("#enemy1").css("left"));
			enemy1Y = parseInt($("#enemy1").css("top"));
			explosion1(enemy1X, enemy1Y);

			positionY = parseInt(Math.random() * (334) + 10);
			$("#enemy1").css("left", 810);
			$("#enemy1").css("top", positionY);
		}

		if (collision2.length > 0) {

			hp--;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			explosion2(enemy2X, enemy2Y);

			$("#enemy2").remove();
			repositionEnemy2();
		}

		if (collision3.length > 0) {

			speedH = speedH + 0.2
			points++;
			enemy1X = parseInt($("#enemy1").css("left"));
			enemy1Y = parseInt($("#enemy1").css("top"));
			explosion1(enemy1X, enemy1Y);
			$("#shot").css("left", 950);

			positionY = parseInt(Math.random() * (334) + 10);
			$("#enemy1").css("left", 810);
			$("#enemy1").css("top", positionY);
		}

		if (collision4.length > 0) {

			speedT = speedT + 0.25
			points = points + 2;
			enemy2X = parseInt($("#enemy2").css("left"));
			enemy2Y = parseInt($("#enemy2").css("top"));
			explosion2(enemy2X, enemy2Y);
			$("#shot").css("left", 950);

			$("#enemy2").remove();
			repositionEnemy2();
		}

		if (collision5.length > 0) {

			audioLost.play();
			lost++;
			prisonerX = parseInt($("#prisoner").css("left"));
			prisonerY = parseInt($("#prisoner").css("top"));
			explosion3(prisonerX, prisonerY);
			$("#prisoner").remove();

			repositionPrisoner();
		}
	}

	function explosion1(enemy1X, enemy1Y) {

		audioExplosion.play();
		$("#bgGame").append("<div id='explosion1'></div>");
		$("#explosion1").css("background-image", "url(imgs/explosion.png)");
		
		var div = $("#explosion1");
		div.css("top", enemy1Y);
		div.css("left", enemy1X);
		div.animate({width:200, opacity:0}, "normal");
		
		var timeExplosion = window.setInterval(removeExplosion, 500);
	
		function removeExplosion() {
			div.remove();
			window.clearInterval(timeExplosion);
			timeExplosion = null;
		}
	}

	function explosion2(enemy2X, enemy2Y) {

		audioExplosion.play();
		$("#bgGame").append("<div id='explosion2'></div>");
		$("#explosion2").css("background-image", "url(imgs/explosion.png)");

		var div2 = $("#explosion2");
		div2.css("top", enemy2Y);
		div2.css("left", enemy2X);
		div2.animate({width:200, opacity:0}, "normal");

		var timeExplosion2 = window.setInterval(removeExplosion2, 500);

		function removeExplosion2() {
			div2.remove();
			window.clearInterval(timeExplosion2);
			timeExplosion2 = null;
		}
	}

	function explosion3(prisonerX, prisonerY) {
		$("#bgGame").append("<div id='explosion3' class='animPrisoner'></div>");
		$("#explosion3").css("top", prisonerY);
		$("#explosion3").css("left", prisonerX);

		var timeExplosion3 = window.setInterval(removeExplosion3, 500);

		function removeExplosion3() {
			$("#explosion3").remove();
			window.clearInterval(timeExplosion3);
			timeExplosion3 = null;
		}
	}

	function repositionEnemy2() {
		var timeCollision4 = window.setInterval(reposition4, 4000);

		function reposition4() {
			window.clearInterval(timeCollision4);
			timeCollision4 = null;
			
			if (gameover == false) {
				$("#bgGame").append("<div id=enemy2></div>");
			}
		}
	}

	function repositionPrisoner() {
		var timeCollision5 = window.setInterval(reposition5, 6000);

		function reposition5() {
			window.clearInterval(timeCollision5);
			timeCollision5 = null;

			if (gameover == false) {
				$("#bgGame").append("<div id='prisoner'></div>");
			}
		}
	}

	function score() {
		$("#scoreboard").html("<h2> Score: " + points + " Salvos: " + safe + " Mortos:" + lost);
	}

	function setHp() {
		if (hp == 3) {
			$("#hp").css("background-image", "url(imgs/3hp.png");
		}

		if (hp == 2) {
			$("#hp").css("background-image", "url(imgs/2hp.png");
		}

		if (hp == 1) {
			$("#hp").css("background-image", "url(imgs/1hp.png");
		}

		if (hp == 0) {
			$("#hp").css("background-image", "url(imgs/0hp.png");
			gameOver();
		}
	}

	function gameOver() {
		gameover = true;
		audioMainTheme.pause();
		audioGameover.play();
		audioGameover.loop = true;
		audioGameover.currentTime = 0;
		
		window.clearInterval(game.timer);
		game.timer = null;
		
		$("#player").remove();
		$("#enemy1").remove();
		$("#enemy2").remove();
		$("#prisoner").remove();
		
		$("#bgGame").append("<div id='end'></div>");
		
		$("#end").html("<img id=imgGameover src='imgs/gameover.png'>" + "<p>Score: " + points + "</p><p>Prisioneiros Resgatados: " + safe + "</p><p> Prisioneiros Mortos: " + lost + "</p><div id='restart' onClick = restartGame()><p class='playAgain'>Jogar Novamente</p></div>");
		}
}

function restartGame() {
	audioGameover.pause();
	$("#end").remove();
	start();
}