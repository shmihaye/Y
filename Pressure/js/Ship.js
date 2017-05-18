function Ship(game, image){
	
	// Call to Phaser.sprite
	Phaser.Sprite.call(this, game, 40, game.world.height-300, image);
	
	// Add properties
	game.physics.enable(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;
	this.anchor.set(0.5);
	this.health = 5;
	this.invincibility = 0;
	
	// Add arm
	this.arm2 = game.add.sprite(0, 0, 'arm2');
	this.arm2.anchor.y = 0.5;
	this.arm2.scale.setTo(2);
	this.arm2.extDist = 0; // The distance the arm has extended
	this.arm1 = game.add.sprite(0, 0, 'arm1');
	this.arm1.anchor.y = 0.5;
	this.arm1.scale.setTo(2);
	this.arm1.clockwise = 0;
	this.arm1.speedUp = 0;
	
	// Add claw
	this.claw = game.add.sprite(0, 0, 'claw');
	game.physics.arcade.enable(this.claw);
	this.claw.body.gravity.y = 0;
	this.claw.scale.setTo(2);
	this.claw.anchor.y = 0.5;
	
	// Add dash if convoIndex1 > 0
	this.dashEnabled = false;
	if(convoIndex1 > 0){
		this.dashEnabled = true;
		this.dashTime = 0;
		this.dashDirection = 0;
		this.dashSpeed = 500 + (150 * convoIndex1); // The speed and distance of the dash: min = 650, max = 1100
		this.dashCooldown = 120 - (20 * convoIndex1); // The cooldown of the dash: min = 40, max = 100
	}
	
	// Add shield if convoIndex2 > 0
	this.shieldEnabled = false;
	if(convoIndex2 > 0){
		this.shieldEnabled = true;
		this.shield = game.add.sprite(0, 0, 'gravRock');
		game.physics.arcade.enable(this.shield);
		this.shield.anchor.set(0.5);
		this.shield.scale.set(0.5);
		this.shield.active = false;
		this.shield.alpha = 0.1;
		this.shieldSize = 2 + (0.5 * convoIndex2); // The size & duration of the shield: min = 2.5, max = 4
		this.shieldRegen = 0.001 * convoIndex2; // The rate at which the shield regenerates after use: min = 0.001, max = 0.004
	}
	
	// Add beam if convoIndex3 > 0 (WIP)
	/*this.beamEnabled = false;
	if(convoIndex3 > 0){
		this.beamEnabled = true;
		this.beam = game.add.sprite(0, 0, 'cheesecake');
		game.physics.arcade.enable(this.beam);
		this.beam.anchor.set(0.5);
		this.beamTime = 0;
		this.beamCooldown = 120;
	}*/
	
	// Add animations
	this.animations.add('fly', [0,1], 10, true);
	this.animations.play('fly');
	this.claw.animations.add('closed', [0], 10, true);
	this.claw.animations.add('open', [1], 10, true);
	this.claw.animations.play('open');
	
	// Add grabbed pointer
	this.grabbed = null;
	this.grabCooldown = 0;
	
}
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.update = function(){
	
	// Ship movement
	// Do not move if the dash ability was just used (if it is enabled)
	if(!this.dashEnabled || this.dashTime > -this.dashCooldown + 8){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)){
			// Move left if left is pressed
			this.body.velocity.x = -300;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D)){
			// Move right if right is pressed
			this.body.velocity.x = 300;
		}
		else this.body.velocity.x = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)){
			// Move up if up is pressed
			this.body.velocity.y = -300;
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S)){
			// Move down if down is pressed
			this.body.velocity.y = 300;
		}
		else this.body.velocity.y = 0;
	}
	
	// Dash ability
	if(this.dashEnabled){
	// If a key is double-tapped, quickly move the ship in that direction.
	if(this.dashTime >= 0){ // Check to make sure the ability isn't on cooldown.
		if(game.input.keyboard.justPressed(Phaser.Keyboard.A)){
			if(this.dashDirection == 0 && this.dashTime > 0){this.body.velocity.x = -this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 0; this.dashTime = 30;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.D)){
			if(this.dashDirection == 1 && this.dashTime > 0){this.body.velocity.x = this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 1; this.dashTime = 30;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W)){
			if(this.dashDirection == 2 && this.dashTime > 0){this.body.velocity.y = -this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 2; this.dashTime = 30;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.S)){
			if(this.dashDirection == 3 && this.dashTime > 0){this.body.velocity.y = this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 3; this.dashTime = 30;}
		}
	}
	if(this.dashTime > 0) this.dashTime--; // Key is single-tapped and ready for dash!
	else if(this.dashTime < 0){ // Dash was just used, cooldown in effect.
		if(this.dashTime == -this.dashCooldown + 8) this.tint = 0xADD8E6; // Add blue tint after initial speed burst
		if(this.dashTime == -1) this.tint = 0xffffff; // Remove tint when cooldown is over
		this.dashTime++;
	}}
	
	// Shield ability
	if(this.shieldEnabled){
	// Move shield to ship
	this.shield.x = this.x;
	this.shield.y = this.y;
	// If the shield is active, grow it until it hits its max scale
	if(this.shield.active){
		if(this.shield.scale.x < this.shieldSize) this.shield.scale.setTo(this.shield.scale.x + 0.1);
		else{ // When the shielding is finished
			this.shield.active = false;
			this.shield.alpha = 0.1;
		}
	}
	// If the shield is not active, shrink it until it hits a scale of 1 (ready for use again)
	else{
		if(this.shield.scale.x > 0.7) this.shield.scale.setTo(this.shield.scale.x - this.shieldRegen);
		else if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){ // The shield is ready & summoned!
			this.shield.active = true;
			this.shield.alpha = 0.8;
		}
	}}
	
	// Beam ability (WIP)
	/*if(this.beamEnabled){
	// If left-click is double-clicked, create tractor beam!
	if(this.beamTime >= 0){ // Check to make sure the ability isn't on cooldown.
		if(game.input.activePointer.leftButton.justPressed){
			if(this.beamTime > 0){
				this.beam.x = game.input.x;
				this.beam.y = game.input.y;
				this.beamTime = -this.beamCooldown;
			}
			else this.beamTime = 30;
		}
	}}*/
	
	// Move arm1 to ship
	this.arm1.x = this.x;
	this.arm1.y = this.y;
	
	// Calulate desired arm angle and move towards it
	let desiredAngle = (180 * Math.atan((this.y-game.input.y)/(this.x-game.input.x))/3.14);
	if(game.input.x <= this.x) desiredAngle += 180;
	if(desiredAngle >= 180) desiredAngle -= 360;
	if(Math.abs(desiredAngle-this.arm1.angle) < 10) this.arm1.angle = desiredAngle;
	else if(this.arm1.angle > desiredAngle){
		if(this.arm1.angle-desiredAngle > 180) this.arm1.angle += 5;
		else this.arm1.angle -= 5;
	}
	else{ //desiredAngle > arm1.angle
		if(this.arm1.angle-desiredAngle < -180) this.arm1.angle -= 5;
		else this.arm1.angle += 5;
	}
	
	// Set the other arm segment and claw to the same angle
	this.arm2.angle = this.arm1.angle;
	this.claw.angle = this.arm1.angle;
	
	// Break the angle into x and y components
	let angleX = Math.cos(3.14 * this.arm1.angle/180);
	let angleY = Math.sin(3.14 * this.arm1.angle/180);
	
	// Calculate desired extension and move towards it
	let desiredLength = 0;
	// Only extend desiredLength past 0 if the y component of the angle
	// and the distance between the ship and mouse cursor have the same sign
	if((angleY * (game.input.y-this.claw.y) >= 0) && (angleX * (game.input.x-this.claw.x) >= 0)) desiredLength = Math.sqrt(((this.y+(80*angleY)-game.input.y)*(this.y+(80*angleY)-game.input.y))+((this.x+(80*angleX)-game.input.x)*(this.x+(80*angleX)-game.input.x)));
	if(desiredLength > this.arm2.extDist + 5) this.arm2.extDist += 5;
	else if(desiredLength < this.arm2.extDist - 5) this.arm2.extDist -= 5;
	if(this.arm2.extDist < 0) this.arm2.extDist = 0;
	else if(this.arm2.extDist > 80) this.arm2.extDist = 80;
	
	// Move arm2 extDist past arm1 and move claw to end of arm2
	this.arm2.x = this.arm1.x + (this.arm2.extDist * angleX);
	this.arm2.y = this.arm1.y + (this.arm2.extDist * angleY);
	this.claw.x = this.arm2.x + (72 * angleX);
	this.claw.y = this.arm2.y + (72 * angleY);
	
	// Open and close claw
	if(!game.input.activePointer.leftButton.isDown) this.claw.animations.play('open');
	else this.claw.animations.play('closed');
	
	// Move grabbed object with claw
	if(this.grabbed != null){
		let prevx = this.grabbed.x;
		let prevy = this.grabbed.y;
		this.grabbed.x = this.claw.x;
		this.grabbed.y = this.claw.y;
		// Release grabbed object if mouse button is no longer down
		if(!game.input.activePointer.leftButton.isDown){
			this.grabbed.body.velocity.y = 50*(this.grabbed.y - prevy);
			this.grabbed.body.velocity.x = 50*(this.grabbed.x - prevx);
			this.grabbed.primed = true;
			this.grabbed = null;
			this.grabCooldown = 40;
		}
	}
	
	// Decrement grabCooldown (which keeps the player from grab-spamming)
	if(this.grabCooldown > 0) this.grabCooldown--;
	
	// Decrement invincibility frame and flash ship
	if(this.invincibility > 0){
		if(this.invincibility == 1) this.visible = true;
		else if(this.invincibility % 4 == 0) this.visible = !this.visible;
		this.invincibility--;
	}
}