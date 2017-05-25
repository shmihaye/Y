
// Global variables for play state
var player, obstacles, background, timestep, levelData, speedUp;
var levelNum = 0;
var health = 5;
var addObstacles = [];

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
		
		// Set scroll speed to 1
		speedUp = 1;
		
		// Create obstacles group
		obstacles = game.add.group();
		obstacles.enableBody = true;
		
		// Create the player ship
		player = new Ship(game, 'ship');
		game.add.existing(player);
		
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
		
		// Add any obstacles pushed onto the stack
		if(addObstacles.length > 0){
			let numObstacles = addObstacles.length;
			for(let i = 0; i < numObstacles; i++){
				let spawnObj = addObstacles.shift();
				createObj(spawnObj);
			}
		}
		
		// Object creation from JSON object
		if(levelData.timestamps.length > 0 && levelData.timestamps[0].time == timestep/60){
			let spawnList = levelData.timestamps.shift();
			let listSize = spawnList.objects.length;
			for(let i = 0; i < listSize; i++){
				// Create equivalent object
				let spawnObj = spawnList.objects.shift();
				
				// Go to hallway state at the end of the level
				if(spawnObj.type == 'END'){
					hallStart = 600;
					//levelNum++; UNCOMMENT WHEN WE HAVE ANOTHER LEVEL :)
					this.camera.fade('#ffffff');
					this.camera.onFadeComplete.add(fadeComplete,this);
				}
				else if(spawnObj.type == 'SPDUP'){
					speedUp *= 2;
				}
				else createObj(spawnObj);
			}
		}
		timestep++;
		
		// If the player runs out of energy, restart the stage
		if(energy <= 0) game.state.start('Hallway');
		
		// Scroll background
		this.background.tilePosition.x -= (5 * speedUp);
		
		// Delete off-screen objects
		for (let i = 0, len = obstacles.children.length; i < len; i++){checkBounds(obstacles.children[i]);}
	},
	
	render: function() {
		// Display debug information
		game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 20, 560, 'yellow');
		game.debug.text('FPS: ' + game.time.fps, 20, 580, 'yellow');
		//for (let i = 0, len = obstacles.children.length; i < len; i++){if(obstacles.children[i].alive) game.debug.body(obstacles.children[i]);}
		//game.debug.body(player);
	}
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(claw, obstacle){
	// If the grab key is pressed, set grabbedObject to the obstacle
	if(game.input.activePointer.leftButton.isDown && player.grabCooldown == 0 && player.grabbed == null){
		player.grabbed = obstacle;
		obstacle.body.velocity.x = 0;
		obstacle.body.velocity.y = 0;
	}
}
function hurtShip(player, obstacle){
	// If the player touches an obstacle that hasn't been grabbed, lower energy
	if(obstacle != player.grabbed && !obstacle.friendly && player.invincibility == 0){energy -= 30; player.invincibility = 60;}
}
function hurtShield(shield, obstacle){
	// If an obstacle hit the shield, destroy the obstacle
	if(obstacle != player.grabbed && !obstacle.friendly && player.shield.active){
		obstacle.kill();
	}
}
function checkBounds(obstacle){
	
	// Don't delete orbit rock's moon.
	if (obstacle.constructor.name === 'OrbitRock') {
		
		//if (! obstacle.isCenter) {
			
			return;
			
		//}
		
	}
	
	// Delete obstacles that leave the level bounds
	if(obstacle.x < -100 || obstacle.x > 1500 || obstacle.y < -100 || obstacle.y > 700) obstacle.kill();
	
}
function destroyObstacles(obstacle1, obstacle2){
	// Destroy obstacles with thrown obstacles (unless the collision is off-screen)
	if((obstacle1.primed || obstacle2.primed) && obstacle1.x < 850 && obstacle2.x < 850){
		obstacle1.die(game);
		obstacle2.die(game);
	}
}
function createObj(spawnObj){
	var newObj = null;
	if(spawnObj.type == 'Asteroid') newObj = new Asteroid(game, 'rock');
	else if(spawnObj.type == 'GravRock') newObj = new GravRock(game, 'gravRock');
	else if(spawnObj.type == 'BombRock') newObj = new BombRock(game, 'bombRock');
	else if(spawnObj.type == 'FragRock') newObj = new FragRock(game, 'fragRock1');
	else if(spawnObj.type == 'FragRock2') newObj = new FragRock(game, 'fragRock2');
	else if(spawnObj.type == 'FragRock3') newObj = new FragRock(game, 'fragRock3');
	else if(spawnObj.type == 'FragRock4') newObj = new FragRock(game, 'fragRock4');
	else if(spawnObj.type == 'ToxicRock') newObj = new ToxicRock(game, 'toxicRock');
	else if(spawnObj.type == 'OrbitRock') newObj = new OrbitRock(game, 'rock');
	
	// Retrieve object properties
	if(spawnObj.x !== undefined) newObj.x = spawnObj.x;
	else newObj.x = 1100;
	if(spawnObj.y !== undefined) newObj.y = spawnObj.y;
	else newObj.y = 300;
	if(spawnObj.xvel !== undefined) newObj.body.velocity.x = spawnObj.xvel;
	else newObj.body.velocity.x = -100;
	if(spawnObj.yvel !== undefined) newObj.body.velocity.y = spawnObj.yvel;
	else newObj.body.velocity.y = 0;
	if(spawnObj.scale !== undefined) newObj.scale.setTo(spawnObj.scale);
	else newObj.scale.setTo(1);
	if(spawnObj.primed !== undefined) newObj.primed = spawnObj.primed;
	else newObj.primed = false;
	if(spawnObj.primedCooldown !== undefined) newObj.primedCooldown = spawnObj.primedCooldown;
	else newObj.primedCooldown = -1;
	if(spawnObj.canBreak !== undefined) newObj.canBreak = spawnObj.canBreak;
	else newObj.canBreak = true;
	if(newObj != null){
		newObj.friendly = false;
		newObj.body.gravity.y = 0;
		newObj.anchor.set(0.5);
		game.add.existing(newObj);
		obstacles.add(newObj);
		// If a new object is created offscreen, add a new sprite to the player's radar
		if(player.radarEnabled && newObj.x > 850){
			if(spawnObj.type == 'Asteroid' || (convoIndex4 > 1 && (spawnObj.type == 'FragRock' || spawnObj.type == 'GravRock')) || (convoIndex4 > 2 && spawnObj.type == 'BombRock')){
				var radarSprite = game.add.sprite(780, newObj.y, newObj.key);
				radarSprite.anchor.set(0.5);
				radarSprite.trackObj = newObj;
				radarSprite.tint = 0xADD8E6;
				radarSprite.blinkTimer = 10;
				player.radar.push(radarSprite);
			}
		}
		// Add moon if creating an OrbitRock
		if(spawnObj.type == 'OrbitRock'){
			var orbitMoon = new OrbitRock(game, 'rock');
			orbitMoon.x = newObj.x;
			orbitMoon.y = newObj.y + 100;
			orbitMoon.scale.setTo(1);
			orbitMoon.primed = false;
			orbitMoon.friendly = false;
			orbitMoon.body.gravity.y = 0;
			orbitMoon.anchor.set(0.5);
			game.add.existing(orbitMoon);
			obstacles.add(orbitMoon);
			newObj.moon = orbitMoon;
		}
	}
}
function fadeComplete(){
	this.state.start('Hallway'); 
}