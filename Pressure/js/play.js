
// Global variables for play state
var cursors, player, arm, claw, grabbed, grabCooldown, asteroids;
var armLeftKey, armRightKey, armExtendKey, armContractKey, armGrabKey;

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
		
		// Add some asteroids
		for(var i = 0; i < 10; i++){
			var asteroid = asteroids.create(800 * Math.random(), 600 * Math.random(), 'cheesecake');
			asteroid.body.gravity.y = 0;
			asteroid.scale.set(2 * Math.random() + 1);
			asteroid.anchor.set(0.5);
		}
		
		// Add in the button for hallway state.
		goToHallwayButton = game.add.sprite(10, 10, 'goToHallwayButton');
		goToHallwayButton.inputEnabled = true;
		goToHallwayButton.events.onInputDown.add(function() { game.state.start('Hallway'); });
		
		// Initialize keyboard controls
		cursors = game.input.keyboard.createCursorKeys();
		armLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
		armRightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
		armExtendKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
		armContractKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
		armGrabKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
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
		arm.x = player.x;
		arm.y = player.y;
		claw.x = player.x + (arm.width * Math.cos(3.14 * arm.angle/180));
		claw.y = player.y + (arm.width * Math.sin(3.14 * arm.angle/180));
		if(grabbed != null){
			var prevx = grabbed.x;
			var prevy = grabbed.y;
			grabbed.x = claw.x;
			grabbed.y = claw.y;
			if(armGrabKey.isDown && grabCooldown == 0){
				grabbed.body.velocity.y = 50*(grabbed.y - prevy);
				grabbed.body.velocity.x = 50*(grabbed.x - prevx);
				grabbed = null;
				grabCooldown = 20;
			}
		}
		if(armLeftKey.isDown) arm.angle -= 2;
		else if(armRightKey.isDown) arm.angle += 2;
		if(armExtendKey.isDown && arm.scale.x < 4) arm.scale.x += 0.05;
		else if(armContractKey.isDown && arm.scale.x > 2) arm.scale.x -= 0.05;
		claw.angle = arm.angle;
		// Call grabObject if the claw overlaps with an asteroid
		game.physics.arcade.overlap(claw, asteroids, grabObject, null, this);
		game.physics.arcade.overlap(asteroids, asteroids, destroyAsteroids, null, this);
		if(grabCooldown > 0) grabCooldown--;
	}
};

// Misc. functions (phaser doesn't like them inside the play state container...)
function grabObject(player, asteroid){
	// If the grab key is pressed, set grabbedObject to the object
	if(armGrabKey.isDown && grabCooldown == 0 && grabbed == null){grabbed = asteroid; grabCooldown = 20;}
}
function destroyAsteroids(asteroid1, asteroid2){
	asteroid1.kill();
	asteroid2.kill();
}
