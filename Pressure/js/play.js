
// Global variables for play state
var cursors, player, arm, claw, grabbed, grabCooldown, asteroids, desiredAngle, desiredLength, asteroidTimer;
var armGrabKey;

// Play state container
var playState = {

	create: function() {

		// Enable FPS monitoring
		game.time.advancedTiming = true;
		
		// Enable the Arcade physics system
		game.physics.startSystem(Phaser.Physics.ARCADE);
		
		// Create the player
		player = game.add.sprite(0, game.world.height-300, 'cheesecake');
		// Enable player physics
		game.physics.arcade.enable(player);
		// Set player physics properties
		player.body.gravity.y = 0;
		player.body.collideWorldBounds = true;
		player.anchor.set(0.5);
		
		// Create the player arm
		arm = game.add.sprite(0, game.world.height-300, 'cheesecake');
		arm.scale.set(3, 0.25);
		arm.anchor.y = 0.5;
		
		// Create the player claw
		claw = game.add.sprite(0, game.world.height-300, 'cheesecake');
		game.physics.arcade.enable(claw);
		claw.body.gravity.y = 0;
		claw.anchor.y = 0.5;
		claw.scale.set(0.5);
		grabbed = null;
		grabCooldown = 60;
		
		// Create groups
		asteroids = game.add.group();
		asteroids.enableBody = true;
		asteroidTimer = 100;
		
		// Add in the button for hallway state.
		goToHallwayButton = game.add.sprite(10, 10, 'goToHallwayButton');
		goToHallwayButton.inputEnabled = true;
		goToHallwayButton.events.onInputDown.add(function() { game.state.start('Hallway'); });
		
		// Initialize keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		game.input.mouse.capture = true;
	},
	
	update: function() {
		
		if(cursors.left.isDown){ // Move left if left is pressed
			player.body.velocity.x = -300;
		}
		else if(cursors.right.isDown){ // Move right if right is pressed
			player.body.velocity.x = 300;
		}
		else{
			player.body.velocity.x = 0;
		}
		if(cursors.up.isDown){ // Move up if up is pressed
			player.body.velocity.y = -300;
		}
		else if(cursors.down.isDown){ // Move down if down is pressed
			player.body.velocity.y = 300;
		}
		else{
			player.body.velocity.y = 0;
		}
		// Move claw to the cursor
		arm.x = player.x;
		arm.y = player.y;
		// Calulate desired arm angle and move towards it
		desiredAngle = (180 * Math.atan((player.y-game.input.y)/(player.x-game.input.x))/3.14);
		if(game.input.x <= player.x) desiredAngle += 180;
		if(desiredAngle >= 180) desiredAngle -= 360;
		if(Math.abs(desiredAngle-arm.angle) < 5) arm.angle = desiredAngle;
		else if(arm.angle > desiredAngle){
			if(arm.angle-desiredAngle > 180) arm.angle += 3;
			else arm.angle -= 3;
		}
		else{ //desiredAngle > arm.angle
			if(arm.angle-desiredAngle < -180) arm.angle -= 3;
			else arm.angle += 3;
		}
		// Calculate desired arm length and move towards it
		desiredLength = 0.02 * Math.sqrt(((player.y-game.input.y)*(player.y-game.input.y))+((player.x-game.input.x)*(player.x-game.input.x)));
		if(desiredLength > arm.scale.x+0.1) arm.scale.x += 0.1;
		else if(desiredLength < arm.scale.x-0.1) arm.scale.x -= 0.1;
		if(arm.scale.x < 1) arm.scale.x = 1;
		else if(arm.scale.x > 4) arm.scale.x = 4;
		// Move claw to end of arm
		claw.x = player.x + (arm.width * Math.cos(3.14 * arm.angle/180));
		claw.y = player.y + (arm.width * Math.sin(3.14 * arm.angle/180));
		claw.angle = arm.angle;
		// Move grabbed object with claw
		if(grabbed != null){
			var prevx = grabbed.x;
			var prevy = grabbed.y;
			grabbed.x = claw.x;
			grabbed.y = claw.y;
			// Release grabbed object if mouse button is no longer down
			if(!game.input.activePointer.leftButton.isDown){
				grabbed.body.velocity.y = 50*(grabbed.y - prevy);
				grabbed.body.velocity.x = 50*(grabbed.x - prevx);
				grabbed.primed = true;
				grabbed = null;
				grabCooldown = 20;
			}
		}
		// Call grabObject if the claw overlaps with an asteroid
		game.physics.arcade.overlap(claw, asteroids, grabObject, null, this);
		// Call hurtShip if the ship overlaps with an asteroid
		game.physics.arcade.overlap(player, asteroids, hurtShip, null, this);
		// Call destroyAsteroids if two asteroids overlap
		game.physics.arcade.overlap(asteroids, asteroids, destroyAsteroids, null, this);
		// Decrement grabCooldown and asteroidTimer
		// (grabCooldown keeps the player from grab-spamming)
		if(grabCooldown > 0) grabCooldown--;
		if(asteroidTimer > 0) asteroidTimer--;
		else{
			// Add asteroids at a regular interval
			var asteroid = asteroids.create(900, 100 + (400 * Math.random()), 'cheesecake');
			asteroid.body.gravity.y = 0;
			asteroid.scale.set(2 * Math.random() + 1);
			asteroid.anchor.set(0.5);
			asteroid.body.velocity.x = -150 * Math.random();
			asteroid.body.velocity.y = -25 + (50 * Math.random());
			asteroid.primed = false;
			asteroidTimer = 120;
		}
	}
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(claw, asteroid){
	// If the grab key is pressed, set grabbedObject to the object
	if(game.input.activePointer.leftButton.isDown && grabCooldown == 0 && grabbed == null){grabbed = asteroid; grabCooldown = 20;}
}
function hurtShip(player, asteroid){
	if(asteroid != grabbed && !asteroid.primed){
		player.x = 0;
		player.y = game.world.height-300;
		asteroids.forEach(function(asteroid){asteroid.kill();}, this);
	}
}
function destroyAsteroids(asteroid1, asteroid2){
	if(asteroid1.primed || asteroid2.primed){
		asteroid1.kill();
		asteroid2.kill();
	}
}
