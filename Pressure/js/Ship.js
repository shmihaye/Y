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
	this.arm = game.add.sprite(0, 0, 'cheesecake');
	this.arm.scale.set(3, 0.25);
	this.arm.anchor.y = 0.5;
	this.arm.clockwise = 0;
	this.arm.speedUp = 0;
	
	// Add claw
	this.claw = game.add.sprite(0, 0, 'cheesecake');
	game.physics.arcade.enable(this.claw);
	this.claw.body.gravity.y = 0;
	this.claw.scale.set(0.5);
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
		this.shield = game.add.sprite(0, 0, 'cheesecake');
		game.physics.arcade.enable(this.shield);
		this.shield.anchor.set(0.5);
		this.shield.active = false;
		this.shield.alpha = 0.2;
		this.shieldSize = 2 + (0.5 * convoIndex2); // The max scale of the shield sprite: min = 2.5, max = 4
		this.shieldHit = 1.2 - (0.2 * convoIndex2); // The amount of damage done to the shield when it is hit: min = 0.4, max = 1
		this.shieldDrain = 0.005; // The rate at which the shield shrinks when in use
		this.shieldRegen = 0.005; // The rate at which the shield grows when not in use
	}
	
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
	
	// Activate shield when space is pressed
	if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
		this.shield.active = true;
		this.shield.alpha = 0.7;
		// Slowly shrink shield when in use
		if(this.shield.scale.x > 0) this.shield.scale.setTo(this.shield.scale.x - this.shieldDrain);
	}
	else{
		this.shield.active = false;
		this.shield.alpha = 0.2;
		// Slowly grow the shield when not in use
		if(this.shield.scale.x < this.shieldSize) this.shield.scale.setTo(this.shield.scale.x + this.shieldRegen);
	}}
	
	// Move arm to ship
	this.arm.x = this.x;
	this.arm.y = this.y;
	
	// Calulate desired arm angle and move towards it
	let desiredAngle = (180 * Math.atan((this.y-game.input.y)/(this.x-game.input.x))/3.14);
	if(game.input.x <= this.x) desiredAngle += 180;
	if(desiredAngle >= 180) desiredAngle -= 360;
	if(Math.abs(desiredAngle-this.arm.angle) < 10) this.arm.angle = desiredAngle;
	else if(this.arm.angle > desiredAngle){
		if(this.arm.angle-desiredAngle > 180) this.arm.angle += 5;
		else this.arm.angle -= 5;
	}
	else{ //desiredAngle > arm.angle
		if(this.arm.angle-desiredAngle < -180) this.arm.angle -= 5;
		else this.arm.angle += 5;
	}
	
	// Calculate desired arm length and move towards it
	desiredLength = 0.02 * Math.sqrt(((this.y-game.input.y)*(this.y-game.input.y))+((this.x-game.input.x)*(this.x-game.input.x)));
	if(desiredLength > this.arm.scale.x+0.2) this.arm.scale.x += 0.2;
	else if(desiredLength < this.arm.scale.x-0.2) this.arm.scale.x -= 0.2;
	if(this.arm.scale.x < 0.5) this.arm.scale.x = 0.5;
	else if(this.arm.scale.x > 4) this.arm.scale.x = 4;
	
	// Move claw to end of arm
	this.claw.x = this.x + (this.arm.width * Math.cos(3.14 * this.arm.angle/180));
	this.claw.y = this.y + (this.arm.width * Math.sin(3.14 * this.arm.angle/180));
	this.claw.angle = this.arm.angle;
	
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