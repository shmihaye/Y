
// Global variables for play state
var player, obstacles, background, timestep, levelData, speedUp, energyReduction, emitter, beacon, wasd;
var breakSounds = [];
var grabSound, releaseSound, hurtSound, explodeSound, implodeSound, dashSound, punchSound, radarSound, playMusic;
var abilityIcon1, abilityIcon2, abilityIcon3, abilityIcon4;
var levelNum = 0, demoNum = 0;
var addObstacles = [];

// Play state container
var playState = {
	
	preload: function(){
		
		// Load next level data
		let levelName = '';
		if(demoNum > 0){levelName = demoNum.toString() + '.json'; demoComplete = false;}
		else levelName = levelNum.toString() + '.json';
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

		// Prepare sound effects
		for(let i = 1; i <= 5; i++){
			var sound = game.add.audio('break' + i.toString());
			breakSounds.push(sound);
		}
		grabSound = game.add.audio('grab');
		releaseSound = game.add.audio('release');
		hurtSound = game.add.audio('hurt');
		explodeSound = game.add.audio('boom');
		implodeSound = game.add.audio('implode');
		dashSound = game.add.audio('dash');
		punchSound = game.add.audio('punch');
		radarSound = game.add.audio('radar');
		shieldSound = game.add.audio('shield');
		errorSound = game.add.audio('error');
		
		// Initialize keyboard controls
		game.input.mouse.capture = true;
		
		// Create particle emitter
		emitter = game.add.emitter(0, 0, 100);
		emitter.makeParticles(['particle1','particle2','particle3']);
		
		// Create energy bar
		energyReduction = game.add.sprite(65, 580, 'bar');
		energyReduction.scale.x = 0;
		energyReduction.scale.y = 0.5;
		energyReduction.tint = 0xFF0000;
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		
		// Fade in from black
		this.camera.flash('#ffffff');
		
		// Add demo controls text
		if(demoNum > 0){
			var demoText;
			var abilityIcon;
			if(demoNum == 6){
				abilityIcon = game.add.sprite(368, 35, 'abilityBox1');
				demoText = game.add.text(0, 0, '>> Dash <<\n\nDouble-tap a direction for an evasive dash', style2);
			}
			else if(demoNum == 7){
				abilityIcon = game.add.sprite(368, 35, 'abilityBox2');
				demoText = game.add.text(0, 0, '>> Shield <<\n\nPress SPACE to freeze nearby objects', style2);
			}
			else if(demoNum == 8){
				abilityIcon = game.add.sprite(368, 35, 'abilityBox3');
				demoText = game.add.text(0, 0, '>> Punch <<\n\nDouble-click an object with the claw to shove it away', style2);
			}
			else if(demoNum == 9){
				abilityIcon = game.add.sprite(368, 35, 'abilityBox4');
				demoText = game.add.text(0, 0, '>> Radar <<\n\nIcons will notify you of incoming objects', style2);
				demoComplete = true;
			}
			demoText.setTextBounds(100, 34, 600, 150);
			game.add.tween(demoText).to( { alpha: 0 }, 200, "Linear", true, 5000);
			game.add.tween(abilityIcon).to( { alpha: 0 }, 200, "Linear", true, 5000);
			demoText.stroke = '#000000';
			demoText.strokeThickness = 6;
		}
		
		// Play music (unless this is a demo)
		if(demoNum == 0){
			playMusic = this.add.audio('playMusic');
			//playMusic.play('', 0, 0.75, true);
		}
		
		// Add wasd sprite if levelNum is 0
		if(levelNum == 0){
			wasd = game.add.sprite(player.x, player.y, 'wasd');
			wasd.anchor.set(0.5);
			wasd.scale.set(2);
		}
		else wasd = null;
		
		// Determine ability icon positions
		let count = 0;
		if(convoIndex1 > 0) count++;
		if(convoIndex2 > 0) count++;
		if(convoIndex3 > 0) count++;
		if(convoIndex4 > 0) count++;
		let positions = [];
		if(count == 1) positions = [368]
		else if(count == 2) positions = [328, 408]
		else if(count == 3) positions = [288, 368, 448]
		else positions = [248, 328, 408, 488]
		count = 0;
		
		// Add ability icons
		if(convoIndex1 > 0){abilityIcon1 = game.add.sprite(positions[count], 502, 'abilityIcon1'); count++;}
		if(convoIndex2 > 0){abilityIcon2 = game.add.sprite(positions[count], 502, 'abilityIcon2'); count++;}
		if(convoIndex3 > 0){abilityIcon3 = game.add.sprite(positions[count], 502, 'abilityIcon3'); count++;}
		if(convoIndex4 > 0){abilityIcon4 = game.add.sprite(positions[count], 502, 'abilityIcon4');}
		
	},
	
	update: function() {
		
		// Call grabBeacon if the claw overlaps with the beacon (if the beacon is not undefined)
		if(beacon !== undefined){
			game.physics.arcade.overlap(player.claw, beacon, grabBeacon, null, this);
		}
		
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
				
				if(spawnObj.type == 'FORCEFIN'){
					// Force transition to ending if the player has waited too long
					this.camera.fade('#ffffff', 8000);
					this.camera.onFadeComplete.add(endGame,this);
				}
				else if(spawnObj.type == 'FIN'){
					// Spawn beacon and slow background scrolling at the end of the last level
					beacon = game.add.sprite(850, 300, 'beacon');
					beacon.animations.add('default',[0,1,2,3,4,5,6], 10, true);
					beacon.animations.play('default');
					game.physics.arcade.enable(beacon);
					beacon.body.velocity.x = -30;
					beacon.scale.setTo(3);
					beacon.anchor.set(0.5);
					speedUp = 0.25;
					// Destroy all remaining obstacles
					obstacles.forEachAlive(
						function(obstacle){ obstacle.die();}
					);
				}
				else if(spawnObj.type == 'END'){
					// Go to hallway state at the end of the level
					if(demoNum == 0) levelNum++;
					this.camera.fade('#ffffff');
					this.camera.onFadeComplete.add(fadeComplete,this);
				}
				else if(spawnObj.type == 'SPDUP'){
					// Speed up background scrolling if SPDUP
					speedUp *= 2;
					// Fade in week number at end of level (except for demo levels and last level)
					if(demoNum == 0 && levelNum != 5){
						var endText;
						if(levelNum == 4) endText = game.add.text(0, 0, 'Week ' + (2+levelNum) + '\n1 week away from the beacon', style1);
						else endText = game.add.text(0, 0, 'Week ' + (2+levelNum) + '\n' + (5-levelNum).toString() + ' weeks away from the beacon', style1);
						endText.setTextBounds(0, 150, 800, 250);
						endText.alpha = 0;
						game.add.tween(endText).to( { alpha: 1 }, 200, "Linear", true, 200);
						endText.stroke = '#000000';
						endText.strokeThickness = 6;
					}
				}
				else createObj(spawnObj);
			}
		}
		if(wasd == null) timestep++; // Advance time unless wasd art is displayed
		
		// If the player runs out of energy, restart the stage (except during demo levels)
		if(energy <= 0){
			this.camera.fade('#ffffff');
			this.camera.onFadeComplete.add(fadeComplete,this);
		}
		
		// Scroll background
		this.background.tilePosition.x -= (5 * speedUp);
		
		// Delete off-screen objects
		for (let i = 0, len = obstacles.children.length; i < len; i++){checkBounds(obstacles.children[i]);}
		
		// Update energy bar scaling
		if(energy < 0) energy = 0;
		energyBar.scale.x = energy/30;
		if(energyBar.scale.x > energyReduction.scale.x) energyReduction.scale.x = energyBar.scale.x;
		else if(energyBar.scale.x < energyReduction.scale.x) energyReduction.scale.x -= 0.02;
		
		// Fade particles
		emitter.forEachAlive(
			function(p){ p.alpha= p.lifespan / emitter.lifespan; p.scale.setTo(2); p.body.allowGravity = false;}
		);
		
		// Tick down friendly
		obstacles.forEachAlive(
			function(obstacle){ if(obstacle.friendly > 0) obstacle.friendly--;}
		);
		
		// Stop the beacon once it reaches the center of the stage
		if(beacon !== undefined && beacon.x < 400){beacon.body.velocity.x = 0;}
		
		// Keep player from moving past the right side of the screen
		if(player.x > 800) player.x = 800;
	},
	
	/*render: function() {
		// Display debug information
		game.debug.text(`Debugging Phaser ${Phaser.VERSION}`, 20, 560, 'yellow');
		game.debug.text('FPS: ' + game.time.fps, 20, 580, 'yellow');
		for (let i = 0, len = obstacles.children.length; i < len; i++){if(obstacles.children[i].alive) game.debug.body(obstacles.children[i]);}
		game.debug.body(player);
	}*/
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(claw, obstacle){
	// If the grab key is pressed, set grabbedObject to the obstacle
	if(game.input.activePointer.leftButton.justPressed() && player.grabCooldown == 0 && player.grabbed == null){
		player.grabbed = obstacle;
		obstacle.body.velocity.x = 0;
		obstacle.body.velocity.y = 0;
		grabSound.play('',0,sfxVolume);
		if(obstacle.constructor === ToxicRock && demoLevel == 0){
			hurtSound.play('',0,sfxVolume);
			energy -= 26;
		}
	}
}
function grabBeacon(claw, beacon){
	// If the grab key is pressed on the beacon, transition to the credits state
	if(game.input.activePointer.leftButton.justPressed()){
		player.grabbed = beacon;
		player.grabbedBeacon = true;
		this.camera.fade('#ffffff', 8000);
		this.camera.onFadeComplete.add(endGame,this);
	}
}
function hurtShip(player, obstacle){
	// If the player touches an obstacle that hasn't been grabbed, lower energy
	if(obstacle != player.grabbed && obstacle.friendly <= 0 && player.invincibility == 0){
		hurtSound.play('',0,sfxVolume); 
		if(demoNum == 9) demoComplete = false;
		if(demoNum == 0) energy -= 26; 
		player.invincibility = 60;
	}
}
function hurtShield(shield, obstacle){
	// If an obstacle hits the shield, stop the obstacle in its tracks
	if(obstacle != player.grabbed && obstacle.friendly <= 0 && player.shield.active){
		obstacle.body.velocity.x = 0;
		obstacle.body.velocity.y = 0;
		if(demoNum == 7 && !demoComplete){
			demoComplete = true;
			var demoCompleteText = game.add.text(player.x-20, player.y, 'Good!', style2);
			game.add.tween(demoCompleteText).to( { alpha: 0 }, 200, "Linear", true, 1000);
			demoCompleteText.stroke = '#000000';
			demoCompleteText.strokeThickness = 6;
		}
	}
}
function checkBounds(obstacle){
	
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
	// Create object with constructor
	var newObj = null;
	if(spawnObj.type == 'Asteroid') newObj = new Asteroid(game, 'rock');
	else if(spawnObj.type == 'GravRock') newObj = new GravRock(game, 'gravRock');
	else if(spawnObj.type == 'BombRock') newObj = new BombRock(game, 'bombRock');
	else if(spawnObj.type == 'FragRock') newObj = new FragRock(game, 'fragRock1');
	else if(spawnObj.type == 'FragRock2') newObj = new FragRock(game, 'fragRock2');
	else if(spawnObj.type == 'FragRock3') newObj = new FragRock(game, 'fragRock3');
	else if(spawnObj.type == 'FragRock4') newObj = new FragRock(game, 'fragRock4');
	else if(spawnObj.type == 'ToxicRock') newObj = new ToxicRock(game, 'toxicRock');
	else if(spawnObj.type == 'OrbitRock'){
		newObj = new OrbitRock(game, 'orbitRock');
		// Add orbitRock animation
		newObj.animations.add('default', [0,1,2,3,4,5,6,7,8], 15, true);
		newObj.animations.play('default');
	}
	
	// Retrieve object properties (or set defaults)
	if(spawnObj.x !== undefined) newObj.x = spawnObj.x;
	else newObj.x = 1100;
	if(spawnObj.y !== undefined) newObj.y = spawnObj.y;
	else newObj.y = 300;
	if(spawnObj.xvel !== undefined) newObj.body.velocity.x = spawnObj.xvel;
	else newObj.body.velocity.x = -100;
	if(spawnObj.yvel !== undefined) newObj.body.velocity.y = spawnObj.yvel;
	else newObj.body.velocity.y = 0;
	if(newObj != null){
		// Set hitbox sizes
		// (For some reason setting the hitbox sizes from within the objects was only working half the time...)
		if(spawnObj.type == 'FragRock2' || spawnObj.type == 'FragRock3' || spawnObj.type == 'FragRock4' || spawnObj.type == 'GravRock') newObj.body.setSize(20, 20, 22, 22);
		else if(spawnObj.type == 'FragRock') newObj.body.setSize(26, 26, 19, 19);
		else if(spawnObj.type == 'BombRock' || spawnObj.type == 'orbitRock') newObj.body.setSize(30, 30, 17, 17);
		else newObj.body.setSize(40, 40, 12, 12);
	}
	if(spawnObj.scale !== undefined) newObj.scale.setTo(spawnObj.scale);
	else newObj.scale.setTo(1);
	if(spawnObj.primed !== undefined) newObj.primed = spawnObj.primed;
	else newObj.primed = false;
	if(spawnObj.primedCooldown !== undefined) newObj.primedCooldown = spawnObj.primedCooldown;
	else newObj.primedCooldown = -1;
	if(spawnObj.canBreak !== undefined) newObj.canBreak = spawnObj.canBreak;
	else newObj.canBreak = true;
	if(newObj != null){
		// Set a few more default properties
		newObj.friendly = 0;
		newObj.body.gravity.y = 0;
		newObj.anchor.set(0.5);
		game.add.existing(newObj);
		obstacles.add(newObj);
		// If a new object is created offscreen, add a new sprite to the player's radar
		if(player.radarEnabled && newObj.x > 850){
			if(spawnObj.type == 'Asteroid' || (convoIndex4 > 1 && (spawnObj.type == 'FragRock' || spawnObj.type == 'BombRock')) || (convoIndex4 > 2 && (spawnObj.type == 'ToxicRock' || spawnObj.type == 'OrbitRock'))
				|| (convoIndex4 > 3 && spawnObj.type == 'GravRock')){
				var radarSprite = game.add.sprite(780, newObj.y, newObj.key);
				radarSprite.anchor.set(0.5);
				radarSprite.trackObj = newObj;
				radarSprite.tint = 0xADD8E6;
				radarSprite.blinkTimer = 10;
				player.radar.push(radarSprite);
				radarSound.play('',0,sfxVolume);
			}
		}
		// Add moon if creating an OrbitRock (doing it from within OrbitRock itself can be glitchy)
		if(spawnObj.type == 'OrbitRock'){
			var orbitMoon = new OrbitRock(game, 'orbitRock2');
			orbitMoon.x = newObj.x;
			orbitMoon.y = newObj.y + 100;
			orbitMoon.body.setSize(20, 20, 22, 22);
			orbitMoon.scale.setTo(3);
			orbitMoon.primed = false;
			orbitMoon.friendly = false;
			orbitMoon.body.gravity.y = 0;
			orbitMoon.anchor.set(0.5);
			// Add orbitRock moon animation
			orbitMoon.animations.add('default', [0,1,2,3,4,5,6,7,8,9,10,11], 15, true);
			orbitMoon.animations.play('default');
			game.add.existing(orbitMoon);
			obstacles.add(orbitMoon);
			newObj.moon = orbitMoon;
		}
	}
}
// Go to hallway once fade is complete
function fadeComplete(){
	if(demoNum > 0 && !demoComplete) this.state.start('Play');
	else{
		//if(demoNum == 0) playMusic.pause();
		demoNum = 0;
		this.state.start('Hallway');
		
	}
}
// Go to ending once fade is complete
function endGame(){
	this.state.start('Credits'); 
}