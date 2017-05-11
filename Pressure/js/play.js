
// Global variables for play state
var player, obstacles, timestep, levelData;
var levelNum = 0;

// Play state container
var playState = {
	
	preload: function(){
		
		// Load next level data
		let levelName = levelNum.toString() + '.json';
		game.load.path = 'assets/data/level/';
		game.load.json('level', levelName);
	},
	
	create: function() {

		// Enable FPS monitoring
		game.time.advancedTiming = true;
		
		// Enable the Arcade physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Create the player ship
		player = new Ship(game, 'cheesecake');
		game.add.existing(player);
		
		// Create obstacles group
		obstacles = game.add.group();
		obstacles.enableBody = true;
		
		// Load in level data
		levelData = game.cache.getJSON('level');
		timestep = 0;
		
		// Initialize keyboard controls
		game.input.mouse.capture = true;
	},
	
	update: function() {
		
		// Call grabObject if the claw overlaps with an asteroid
		game.physics.arcade.overlap(player.claw, obstacles, grabObject, null, this);
		
		// Call hurtShip if the ship overlaps with an asteroid
		game.physics.arcade.overlap(player, obstacles, hurtShip, null, this);
		
		// Call destroyAsteroids if two asteroids overlap
		game.physics.arcade.overlap(obstacles, obstacles, destroyAsteroids, null, this);
		
		// Object creation from queue
		if(levelData.timestamps.length > 0 && timestep == levelData.timestamps[0].time){
			let spawnList = levelData.timestamps.shift();
			let listSize = spawnList.objects.length;
			for(let i = 0; i < listSize; i++){
				// Create equivalent object
				let spawnObj = spawnList.objects.shift();
				var newObj;
				if(spawnObj.type == 'Asteroid') newObj = new Asteroid(game, 'cheesecake');
				// Retrieve object properties
				if(spawnObj.x !== undefined) newObj.x = spawnObj.x;
				if(spawnObj.y !== undefined) newObj.y = spawnObj.y;
				if(spawnObj.xvel !== undefined) newObj.body.velocity.x = spawnObj.xvel;
				if(spawnObj.yvel !== undefined) newObj.body.velocity.y = spawnObj.yvel;
				if(spawnObj.scale !== undefined) newObj.setScale(spawnObj.scale);
				game.add.existing(newObj);
				obstacles.add(newObj);
			}
		}
		timestep++;
	},
	
	render: function() {
		// Display debug information
		game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 20, 560, 'yellow');
		game.debug.text('FPS: ' + game.time.fps, 20, 580, 'yellow');
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
	game.state.start('Play');
}
function destroyAsteroids(asteroid1, asteroid2){
	// Destroy asteroids with thrown asteroids
	if(asteroid1.primed || asteroid2.primed){
		asteroid1.kill();
		asteroid2.kill();
	}
}
