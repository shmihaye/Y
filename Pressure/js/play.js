
// Global variables for play state
var player, obstacles, background, timestep, levelData;
var levelNum = 0;
var health = 5;

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
		
		// Add background
		this.background = game.add.tileSprite(0, 0, game.width, game.height, 'spaceBackground');
		
		// Create the player ship
		player = new Ship(game, 'ship');
		game.add.existing(player);
		
		// Create obstacles group
		obstacles = game.add.group();
		obstacles.enableBody = true;
		
		/*// Create asteroids group
		asteroids = game.add.group();
		asteroids.enableBody = true;
		
		// Create gravRocks group;
		gravRocks = game.add.group();
		gravRocks.enableBody = true;*/
		
		// Load in level data
		levelData = game.cache.getJSON('level');
		timestep = 0;
		
		// Initialize keyboard controls
		game.input.mouse.capture = true;
	},
	
	update: function() {
		
		// Call grabObject if the claw overlaps with an obstacle
		game.physics.arcade.overlap(player.claw, obstacles, grabObject, null, this);
		
		// Call hurtShield if the ship's shield overlaps with an obstacle
		if(player.shieldEnabled) game.physics.arcade.overlap(player.shield, obstacles, hurtShield, null, this);
		
		// Call hurtShip if the ship overlaps with an obstacle
		game.physics.arcade.overlap(player, obstacles, hurtShip, null, this);
		
		// Call destroyObstacles if two obstacles overlap
		game.physics.arcade.overlap(obstacles, obstacles, destroyObstacles, null, this);
		
		// Object creation from JSON object
		if(levelData.timestamps.length > 0 && timestep == levelData.timestamps[0].time){
			let spawnList = levelData.timestamps.shift();
			let listSize = spawnList.objects.length;
			for(let i = 0; i < listSize; i++){
				// Create equivalent object
				let spawnObj = spawnList.objects.shift();
				var newObj = null;
				// Go to hallway state at the end of the level
				if(spawnObj.type == 'END') game.state.start('Hallway');
				else if(spawnObj.type == 'Asteroid') newObj = new Asteroid(game, 'cheesecake');
        else if(spawnObj.type == 'GravRock') newObj = new GravRock(game, 'gravRock');
				// Retrieve object properties
				if(spawnObj.x !== undefined) newObj.x = spawnObj.x;
				if(spawnObj.y !== undefined) newObj.y = spawnObj.y;
				if(spawnObj.xvel !== undefined) newObj.body.velocity.x = spawnObj.xvel;
				if(spawnObj.yvel !== undefined) newObj.body.velocity.y = spawnObj.yvel;
				if(spawnObj.scale !== undefined) newObj.scale.setTo(spawnObj.scale);
				if(newObj != null){
					game.add.existing(newObj);
					obstacles.add(newObj);
				}
			}
		}
		timestep++;
		
		// Scroll background
		this.background.tilePosition.x -= 10;
	},
	
	render: function() {
		// Display debug information
		game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 20, 560, 'yellow');
		game.debug.text('FPS: ' + game.time.fps, 20, 580, 'yellow');
	}
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(claw, obstacle){
	// If the grab key is pressed, set grabbedObject to the obstacle
	if(game.input.activePointer.leftButton.isDown && player.grabCooldown == 0 && player.grabbed == null){
		player.grabbed = obstacle;
	}
}
function hurtShip(player, obstacle){
	// If the player touches an obstacle that hasn't been grabbed, lower health
	if(obstacle != player.grabbed && !obstacle.primed && player.invincibility == 0){player.health--; player.invincibility = 60;}
	// If the player runs out of health, restart the stage
	if(player.health == 0) game.state.start('Play');
}
function hurtShield(shield, obstacle){
	// If an obstacle hit the shield, destroy the obstacle
	if(obstacle != player.grabbed && !obstacle.primed && player.shield.active){
		obstacle.kill();
	}
}
function destroyObstacles(obstacle1, obstacle2){
	// Destroy obstacles with thrown obstacles
	if(obstacle1.primed || obstacle2.primed){
		obstacle1.kill();
		obstacle2.kill();
	}
}
