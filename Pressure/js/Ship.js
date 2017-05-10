function Ship(game, image){
	
	// Call to Phaser.sprite
	Phaser.Sprite.call(this, game, 40, game.world.height-300, image);
	
	// Add properties
	game.physics.enable(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;
	this.anchor.set(0.5);
	
	// Add arm
	this.arm = game.add.sprite(0, 0, 'cheesecake');
	this.arm.scale.set(3, 0.25);
	this.arm.anchor.y = 0.5;
	
	// Add claw
	this.claw = game.add.sprite(0, 0, 'cheesecake');
	game.physics.arcade.enable(this.claw);
	this.claw.body.gravity.y = 0;
	this.claw.scale.set(0.5);
	this.claw.anchor.y = 0.5;
	
	// Add grabbed pointer
	this.grabbed = null;
	this.grabCooldown = 0;
}
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.update = function(){
	
	// Ship movement
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
}