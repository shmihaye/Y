
// Global variables for play state
var player, asteroids, timestep;
var levelNum = 0;
var asteroidTimer; // [TEMPORARY]

// Play state container
var playState = {
	
	preload: function(){
		
		// Load next level data
		let levelName = levelNum.toString() + '.level';
		game.load.path = 'assets/data/level/';
		game.load.text('level', levelName);
	},
	
	create: function() {

		// Enable FPS monitoring
		game.time.advancedTiming = true;
		
		// Enable the Arcade physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Create the player ship
		player = new Ship(game, 'cheesecake');
		game.add.existing(player);
		
		// Create asteroids group
		asteroids = game.add.group();
		asteroids.enableBody = true;
		asteroidTimer = 100; // [TEMPORARY]
		
		// Load in level data
		let levelData = game.cache.getText('level');
		timestep = 0;
		// [FUTURE] Parse level data into a queue of objects to summon!
		
		// Add in the button for hallway state.
		goToHallwayButton = game.add.sprite(10, 10, 'goToHallwayButton');
		goToHallwayButton.inputEnabled = true;
		goToHallwayButton.events.onInputDown.add(function() { game.state.start('Hallway'); });
		
		// Initialize keyboard controls
		game.input.mouse.capture = true;
	},
	
	update: function() {
		
		// Call grabObject if the claw overlaps with an asteroid
		game.physics.arcade.overlap(player.claw, asteroids, grabObject, null, this);
		
		// Call hurtShip if the ship overlaps with an asteroid
		game.physics.arcade.overlap(player, asteroids, hurtShip, null, this);
		
		// Call destroyAsteroids if two asteroids overlap
		game.physics.arcade.overlap(asteroids, asteroids, destroyAsteroids, null, this);
		
		// [TEMPORARY] Add asteroids at a regular interval
		if(asteroidTimer > 0) asteroidTimer--;
		else{
			var asteroid = new Asteroid(game, 'cheesecake');
			game.add.existing(asteroid);
			asteroids.add(asteroid);
			asteroidTimer = 120;
			timestep++;
		}
		
		// [FUTURE] Compare timestep to the time at the top of the queue,
		// pop off the top & summon obstacles if they are equal
		
	}
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(claw, asteroid){
	// If the grab key is pressed, set grabbedObject to the object
	if(game.input.activePointer.leftButton.isDown && player.grabCooldown == 0 && player.grabbed == null){
		player.grabbed = asteroid;
	}
}
function hurtShip(player, asteroid){
	// [TEMPORARY] If the player touches an asteroid that hasn't been grabbed, reset the game
	if(asteroid != player.grabbed && !asteroid.primed){
		player.x = 0;
		player.y = game.world.height-300;
		asteroids.forEach(function(asteroid){asteroid.kill();}, this);
	}
}
function destroyAsteroids(asteroid1, asteroid2){
	// Destroy asteroids with thrown asteroids
	if(asteroid1.primed || asteroid2.primed){
		asteroid1.kill();
		asteroid2.kill();
	}
}
