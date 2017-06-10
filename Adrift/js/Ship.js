function Ship(game, image){
	
	// Call to Phaser.sprite
	Phaser.Sprite.call(this, game, 150, 300, image);
	
	// Add properties
	game.physics.enable(this);
	this.body.gravity.y = 0;
	this.body.collideWorldBounds = true;
	this.anchor.set(0.5);
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
		this.dashCooldown = 70 - (10 * convoIndex1); // The cooldown of the dash: min = 30, max = 60
	}
	
	// Add shield if convoIndex2 > 0
	this.shieldEnabled = false;
	if(convoIndex2 > 0){
		this.shieldEnabled = true;
		this.shield = game.add.sprite(0, 0, 'shield');
		game.physics.arcade.enable(this.shield);
		this.shield.anchor.set(0.5);
		this.shield.scale.set(0.5);
		this.shield.active = false;
		this.shield.alpha = 0.4;
		this.shield.timer = 0;
		this.shieldTimer = 60 * convoIndex2/2;
		this.shieldSize = 3 + (0.5 * convoIndex2); // The size & duration of the shield: min = 3.5, max = 5
		this.shieldRegen = 0.001 * convoIndex2; // The rate at which the shield regenerates after use: min = 0.001, max = 0.004
	}
	
	// Add punch if convoIndex3 > 0
	this.punchEnabled = false;
	if(convoIndex3 > 0){
		this.punchEnabled = true;
		this.punchTime = 0;
		this.claw.punchStrength = 200 + (100 * convoIndex3);
		this.punchCooldown = 240 - (20 * convoIndex3);
	}
	
	// Add radar if convoIndex4 > 0
	this.radarEnabled = false;
	if(convoIndex4 > 0){
		this.radarEnabled = true;
		this.radar = [];
	}
	
	// Add animations
	this.animations.add('fly', [0,1], 10, true);
	this.animations.play('fly');
	this.claw.animations.add('closed', [0], 10, true);
	this.claw.animations.add('open', [1], 10, true);
	this.claw.animations.play('open');
	
	// Add grabbed pointer
	this.grabbed = null;
	this.grabCooldown = 0;
	this.grabbedBeacon = false;
	
	// Resize hitbox
	this.body.setSize(50, 50, 7, 7);
	
}
Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship;
Ship.prototype.update = function(){
	
	// Keep track of claw motion
	let lastclawx = this.claw.x;
	let lastclawy = this.claw.y;
	
	// Ship movement
	// Do not move if the dash ability was just used (if it is enabled)
	if(!this.dashEnabled || this.dashTime > -this.dashCooldown + 8){
		if(game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			// Move left if left is pressed
			this.body.velocity.x = -300;
			// Remove wasd sprite when player moves
			if(wasd != null){
				game.add.tween(wasd).to( { alpha: 0 }, 200, "Linear", true);
				wasd = null;
			}
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.D) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			// Move right if right is pressed
			this.body.velocity.x = 300;
			// Remove wasd sprite when player moves
			if(wasd != null){
				game.add.tween(wasd).to( { alpha: 0 }, 200, "Linear", true);
				wasd = null;
			}
		}
		else this.body.velocity.x = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			// Move up if up is pressed
			this.body.velocity.y = -300;
			// Remove wasd sprite when player moves
			if(wasd != null){
				game.add.tween(wasd).to( { alpha: 0 }, 200, "Linear", true);
				wasd = null;
			}
		}
		else if(game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
			// Move down if down is pressed
			this.body.velocity.y = 300;
			// Remove wasd sprite when player moves
			if(wasd != null){
				game.add.tween(wasd).to( { alpha: 0 }, 200, "Linear", true);
				wasd = null;
			}
		}
		else this.body.velocity.y = 0;
	}
	
	// Dash ability
	if(this.dashEnabled){
	// If a key is double-tapped, quickly move the ship in that direction.
	if(this.dashTime >= 0){ // Check to make sure the ability isn't on cooldown.
		if(game.input.keyboard.justPressed(Phaser.Keyboard.A) || game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
			if(this.dashDirection == 0 && this.dashTime > 0){dashSound.play('',0,sfxVolume); this.body.velocity.x = -this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 0; this.dashTime = 20;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.D) || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
			if(this.dashDirection == 1 && this.dashTime > 0){dashSound.play('',0,sfxVolume); this.body.velocity.x = this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 1; this.dashTime = 20;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
			if(this.dashDirection == 2 && this.dashTime > 0){dashSound.play('',0,sfxVolume); this.body.velocity.y = -this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 2; this.dashTime = 20;}
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
			if(this.dashDirection == 3 && this.dashTime > 0){dashSound.play('',0,sfxVolume); this.body.velocity.y = this.dashSpeed; this.dashTime = -this.dashCooldown; this.tint = 0x0000ff;}
			else{this.dashDirection = 3; this.dashTime = 20;}
		}
	}
	if(this.dashTime > 0) this.dashTime--; // Key is single-tapped and ready for dash!
	else if(this.dashTime < 0){ // Dash was just used, cooldown in effect.
		if(this.dashTime == -this.dashCooldown + 8){
			this.tint = 0xADD8E6; // Add blue tint after initial speed burst
			abilityIcon1.alpha = 0.4;
			if(demoNum == 6 && !demoComplete){
				demoComplete = true;
				var demoCompleteText = game.add.text(player.x-20, player.y, 'Nice!', style2);
				game.add.tween(demoCompleteText).to( { alpha: 0 }, 200, "Linear", true, 1000);
				demoCompleteText.stroke = '#000000';
				demoCompleteText.strokeThickness = 6;
			}
		}
		if(this.dashTime == -1){this.tint = 0xffffff; abilityIcon1.alpha = 1;} // Remove tint when cooldown is over
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
			if(this.shield.timer > 0) this.shield.timer--;
			else{
				this.shield.active = false;
				this.shield.alpha = 0.4;
			}
		}
	}
	// If the shield is not active, shrink it until it hits a scale of 1 (ready for use again)
	else{
		if(this.shield.scale.x > 0.7){
			this.shield.scale.setTo(this.shield.scale.x - this.shieldRegen);
			if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
				//Flash if summoned before ready
				errorSound.play('',0,sfxVolume);
				this.shield.flash = 40;
			}
			if(this.shield.flash % 4 == 1) this.shield.visible = !this.shield.visible;
			if(this.shield.flash > 0) this.shield.flash--;
			else this.shield.visible = true;
		}
		else{
			abilityIcon2.alpha = 1;
			if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){ // The shield is ready & summoned!
				this.shield.active = true;
				abilityIcon2.alpha = 0.4;
				this.shield.alpha = 0.8;
				this.shield.timer = this.shieldTimer;
				shieldSound.play('',0,sfxVolume);
			}
		}
	}}
	
	// Punch ability
	if(this.punchEnabled){
	// If left-click is double-clicked, fling nearby objects away from the ship
	if(this.punchTime >= 0){ // Check to make sure the ability isn't on cooldown.
		if(game.input.activePointer.leftButton.justPressed()){
			if(this.punchTime > 0 && this.punchTime < 19){
				// Call punchObject on all obstacles that overlap with the claw
				game.physics.arcade.overlap(this.claw, obstacles, punchObject, null, this);
				this.punchTime = -this.punchCooldown;
				this.claw.scale.x = 4;
				punchSound.play('',0,sfxVolume);
			}
			else this.punchTime = 20;
		}
		else if(game.input.keyboard.justPressed(Phaser.Keyboard.E)){
			// Call punchObject on all obstacles that overlap with the claw
			game.physics.arcade.overlap(this.claw, obstacles, punchObject, null, this);
			this.punchTime = -this.punchCooldown;
			this.claw.scale.x = 4;
			punchSound.play('',0,sfxVolume);
		}
	}
	if(this.punchTime > 0) this.punchTime--;
	else if(this.punchTime < 0){
		if(this.punchTime == -this.punchCooldown + 8){
			this.claw.tint = 0xADD8E6; // Add blue tint after punch
			abilityIcon3.alpha = 0.4;
			this.claw.scale.setTo(2);
		}
		if(this.punchTime == -1){this.claw.tint = 0xffffff; abilityIcon3.alpha = 1;} // Remove tint when cooldown is over
		this.punchTime++;
	}}
	
	// Radar ability
	if(this.radarEnabled){
		let radarSize = this.radar.length;
		for(let i = 0; i < radarSize; i++){
			let radarSprite = this.radar[i];
			if(radarSprite.trackObj.x < 850 || !radarSprite.trackObj.alive){
				radarSprite.kill();
			}
			else{
				radarSprite.y = radarSprite.trackObj.y;
				if(radarSprite.blinkTimer <= 0){
					radarSprite.visible = !radarSprite.visible;
					radarSprite.blinkTimer = 10;
				}
				else radarSprite.blinkTimer--;
			}
		}
	}
	
	// Move arm1 to ship
	this.arm1.x = this.x;
	this.arm1.y = this.y;
	
	// Calulate desired arm angle and move towards it
	let changeLength = false;
	let desiredAngle = (180 * Math.atan((this.y-game.input.y)/(this.x-game.input.x))/3.14);
	if(game.input.x <= this.x) desiredAngle += 180;
	if(desiredAngle >= 180) desiredAngle -= 360;
	if(Math.abs(desiredAngle-this.arm1.angle) < 10){
		this.arm1.angle = desiredAngle;
		changeLength = true;
	}
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
	if(changeLength){
	let desiredLength = 0;
	// Only extend desiredLength past 0 if the y component of the angle
	// and the distance between the ship and mouse cursor have the same sign
	if((angleY * (game.input.y-this.claw.y) >= 0) && (angleX * (game.input.x-this.claw.x) >= 0)) desiredLength = Math.sqrt(((this.y+(80*angleY)-game.input.y)*(this.y+(80*angleY)-game.input.y))+((this.x+(80*angleX)-game.input.x)*(this.x+(80*angleX)-game.input.x)));
	if(desiredLength > this.arm2.extDist + 5) this.arm2.extDist += 5;
	else if(desiredLength < this.arm2.extDist - 5) this.arm2.extDist -= 5;
	if(this.arm2.extDist < 0) this.arm2.extDist = 0;
	else if(this.arm2.extDist > 80) this.arm2.extDist = 80;
	}
	
	// Move arm2 extDist past arm1 and move claw to end of arm2
	this.arm2.x = this.arm1.x + (this.arm2.extDist * angleX);
	this.arm2.y = this.arm1.y + (this.arm2.extDist * angleY);
	this.claw.x = this.arm2.x + (72 * angleX);
	this.claw.y = this.arm2.y + (72 * angleY);
	
	// Open and close claw
	if(!game.input.activePointer.leftButton.isDown && !this.grabbedBeacon) this.claw.animations.play('open');
	else this.claw.animations.play('closed');
	
	// Move grabbed object with claw
	if(this.grabbed != null && !this.grabbed.alive) this.grabbed = null;
	if(this.grabbed != null){
		let prevx = this.grabbed.x;
		let prevy = this.grabbed.y;
		this.grabbed.x += (this.claw.x - lastclawx);
		this.grabbed.y += (this.claw.y - lastclawy);
		if (this.grabbed.constructor.name === 'ToxicRock' && demoNum == 0) {
			energy--;
		}
		this.grabbed.body.velocity.x = 0;
		this.grabbed.body.velocity.y = 0;
		this.grabbed.body.acceleration.x = 0;
		this.grabbed.body.acceleration.y = 0;
		this.grabbed.primed = true;
		// Release grabbed object if mouse button is no longer down
		if(!game.input.activePointer.leftButton.isDown && !this.grabbedBeacon){
			this.grabbed.body.velocity.y = 50*(this.grabbed.y - prevy);
			this.grabbed.body.velocity.x = 50*(this.grabbed.x - prevx);
			this.grabbed.friendly = 40;
			this.grabbed = null;
			this.grabCooldown = 40;
			releaseSound.play('',0,sfxVolume);
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
function punchObject(claw, obstacle){
	// Punch all obstacles away at the claw's angle
	obstacle.body.velocity.x = claw.punchStrength * Math.cos(3.14 * claw.angle/180);
	obstacle.body.velocity.y = claw.punchStrength * Math.sin(3.14 * claw.angle/180);
	obstacle.friendly = true;
	obstacle.primed = true;
	if(demoNum == 8 && !demoComplete){
		demoComplete = true;
		var demoCompleteText = game.add.text(player.claw.x, player.claw.y, 'Great!', style2);
		game.add.tween(demoCompleteText).to( { alpha: 0 }, 200, "Linear", true, 1000);
		demoCompleteText.stroke = '#000000';
		demoCompleteText.strokeThickness = 6;
	}
}