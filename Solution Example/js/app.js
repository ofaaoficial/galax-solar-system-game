// Botones
var btn_start            = document.getElementById("start");
var btn_restart_end      = document.getElementById("restart-end");
var btn_restart_gameover = document.getElementById("restart-gameover");

// Modales
var modal_start     = document.getElementById("modal-start");
var modal_end       = document.getElementById("modal-end");
var modal_gameover  = document.getElementById("modal-gameover");

// Elementos
var bg        = document.getElementById("bg");
var stars     = document.getElementById("stars");
var fb        = undefined;
var ship      = undefined;
var asteroids = undefined;
var ast1      = undefined;
var ast2      = undefined;
var ast3      = undefined;
var fire      = false;

// Planetas
var uranus   = document.getElementById("uranus");
var saturn   = document.getElementById("saturn");
var jupiter  = document.getElementById("jupiter");
var mars     = document.getElementById("mars");
var earth    = document.getElementById("earth");

// Contadores
var cont_bg    = -5356;
var cont_stars = -6000;
var cont_ship  = 5900;
var cont_fb    = 5800;

// Fondos
var bgsp = -11;
var bgas = 0;

// Randoms
var rdm1 = 0;
var rdm2 = 0;
var rdm3 = 0;

// Caminos
var path  = 2;
var path1 = document.getElementById("path1");
var path2 = document.getElementById("path2");
var path3 = document.getElementById("path3");

// Intervalos
var sibg = undefined; // Set interval Background
var sisp = undefined; // Set interval Ship
var sias = undefined; // Set interval Asteroids
var sicc = undefined; // Set interval Check Collisions

btn_start.onclick = function(){
	modal_start.classList.add("hide");
	moveSpace();
	fillAsteroids();
	animAsteroids();
	moveShip();
	controlShip();
	checkCollisions();
}

btn_restart_end.onclick = function() {
	window.location.replace("");
} 

btn_restart_gameover.onclick = function() {
	window.location.replace("");
} 

function moveSpace(){
	sibg = setInterval(function() {
		cont_bg    += 10;
		cont_stars -= 2;
		bg.style.top    = cont_bg+"px";
		stars.style.top = cont_stars+"px";
		if( cont_bg > -10 ){ clearInterval(sibg); }
	}, 50);
}

function moveShip(){
	ship = document.getElementById("spacecraft");
	fb   = document.getElementById("fireball"); 
	sisp = setInterval(function() {
		cont_ship -= 10;
		cont_fb   -= 10;
		bgsp      -= 100;
		ship.style.backgroundPosition = bgsp+"px center";
		ship.style.top = cont_ship+"px";
		fb.style.top   = cont_fb+"px";
		if ( bgsp == -211 ) { bgsp = -11 };
		showSections(cont_ship);
	},50);
}

function showSections(sec) {
	switch(sec){
		case 5700:
			uranus.style.transform = "scale(1)";
			break;
		case 4800:
			saturn.style.transform = "scale(1)";
			break;
		case 3800:
			jupiter.style.transform = "scale(1)";
			break;
		case 2800:
			mars.style.transform = "scale(1)";
			break;
		case 1700:
			earth.style.transform = "scale(1)";
			break;
		case 1000:
			ship.classList.add("finalAnimation");
			setTimeout(function(){
				ship.style.opacity = "0";
				modal_end.classList.remove("hide");
			},4000);
			break;
	}
}

function controlShip() {
	window.onkeydown = function(e) {
		switch(e.keyCode){
			case 37:
				if ( path == 2 ) {
					ship.style.transform = "scale(.8) translateY(-15px) rotate(-45deg)";
					ship.style.left = "400px";
					fb.style.left = "-200px";
					path = 1;
				}
				else if ( path == 3 ) {
					ship.style.transform = "scale(.8) translateY(-15px) rotate(-45deg)";
					ship.style.left = "600px";
					fb.style.left = "0px";
					path = 2;
				}
				originalPosition();
				break;
			case 39:
				if ( path == 2 ) {
					ship.style.transform = "scale(.8) translateY(-15px) rotate(45deg)";
					ship.style.left = "800px";
					fb.style.left = "200px";
					path = 3;
				}
				else if ( path == 1 ) {
					ship.style.transform = "scale(.8) translateY(-15px) rotate(45deg)";
					ship.style.left = "600px";
					fb.style.left = "0px";
					path = 2;
				}
				originalPosition();
				break;
			case 32:
				fireBall();
				break;
		}
	}
}

function fireBall(){
	fb.style.opacity = "1";
	fire = true;
	setTimeout(function(){
		fb.style.opacity = "0";
		fire = false;
	}, 120);
}

function originalPosition () {
	setTimeout(function() {
		ship.style.transform = "scale(1) translateY(0px) rotate(0deg)";
	},200);
}

function fillAsteroids(){
	rdm1 = 0;
	rdm2 = 0;
	rdm3 = 0;

	path1.innerHTML = "";
	path2.innerHTML = "<figure id='spacecraft'></figure><span id='fireball'></span>";
	path3.innerHTML = "";

	for (var i = 1; i <= 5; i++) {
		rdm1 = Math.floor( Math.random() * (5000 - 1000 + 1) ) + 1000;
		rdm2 = Math.floor( Math.random() * (5000 - 1000 + 1) ) + 1000;
		rdm3 = Math.floor( Math.random() * (5000 - 1000 + 1) ) + 1000;

		path1.innerHTML += "<figure class='asteroids' style='top:"+rdm1+"px'></figure>";
		path2.innerHTML += "<figure class='asteroids' style='top:"+rdm2+"px'></figure>";
		path3.innerHTML += "<figure class='asteroids' style='top:"+rdm3+"px'></figure>";
	};
}

function animAsteroids() {
	asteroids = document.querySelectorAll(".asteroids");
	sias = setInterval(function() {
		for (var i = 0; i < asteroids.length; i++) {
			bgas -= 100;
			asteroids[i].style.backgroundPosition = bgas+"px center";
			if ( bgas == -200 ) { bgas = 0 };
		};
	}, 70);
}

function checkCollisions() {
	ast1 = document.querySelectorAll("#path1 .asteroids");
	ast2 = document.querySelectorAll("#path2 .asteroids");
	ast3 = document.querySelectorAll("#path3 .asteroids");

	sicc = setInterval(function(){

		if( path == 1 ){ nastr = ast1 }
		if( path == 2 ){ nastr = ast2 }
		if( path == 3 ){ nastr = ast3 }

		for (var i = 0; i < nastr.length; i++) {
			spTop    = ship.offsetTop;
			spBottom = Number(spTop) + Number(ship.offsetHeight); 
			// --------------------------------------------------------
			asTop    = nastr[i].offsetTop;
			asBottom = Number(asTop) + Number(nastr[i].offsetHeight); 
			// --------------------------------------------------------
			fbTop    = fb.offsetTop;
			fbBottom = Number(fbTop) + Number(fb.offsetHeight); 
			// --------------------------------------------------------

			if( spTop < asBottom && spBottom > asTop ) {
				modalGameOver();
				clearInterval(sisp);
				clearInterval(sibg);
				clearInterval(sias);
				clearInterval(sicc);
			}
			if( fbTop < asBottom && fbBottom > asTop && fire == true) {
				destroyAsteroid(nastr[i]);
			}
		};

	}, 50);
}

function modalGameOver(){
	modal_gameover.classList.remove("hide");
}

function destroyAsteroid(asteroid){
	asteroid.style.backgroundPosition = "-300px center";
	asteroid.style.transform = "scale(2)";
	setTimeout(function(){
		asteroid.style.display = "none";
	}, 120);
}