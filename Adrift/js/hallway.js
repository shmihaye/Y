
// Hallway state container
var hallwayState = {
	
	create: function() {
		
		// Add hallway backgrounds
		game.world.resize(1400, 600);
		this.background = game.add.tileSprite(0, 0, 1400, game.height, 'spaceBackground');
		game.add.sprite(0, 0, 'hallwayBackground');
		
		// Add doors
		if(convoIndex1 < 4 && lastConvo != 1){
			door1 = game.add.sprite(79, 125, 'selectPatricia');
			door1.inputEnabled = true;
			door1.events.onInputDown.add(this.door1Opened, this);
		}
		if(convoIndex2 < 4 && lastConvo != 2){
			door2 = game.add.sprite(331, 126, 'selectBridget');
			door2.inputEnabled = true;
			door2.events.onInputDown.add(this.door2Opened, this);
		}
		if(convoIndex3 < 4 && lastConvo != 3){
			door3 = game.add.sprite(548, 127, 'selectDelson');
			door3.inputEnabled = true;
			door3.events.onInputDown.add(this.door3Opened, this);
		}
		if(convoIndex4 < 4 && lastConvo != 4){
			door4 = game.add.sprite(739, 126, 'selectD4V3');
			door4.inputEnabled = true;
			door4.events.onInputDown.add(this.door4Opened, this);
		}
		pilotButton = game.add.sprite(1124, 196, 'selectChair');
		pilotButton.inputEnabled = true;
		pilotButton.events.onInputDown.add(this.pilotShip, this);
		
		// Create text background background and popup text
		abilityBackground = game.add.sprite(250, 64, 'textBackground');
		abilityBackground.alpha = 0;
		abilityBackground.fixedToCamera = true;
		abilityText1 = game.add.text(0, 0, '>> Dash <<\n\nDouble-tap a direction for an evasive dash\n\nPatricia\'s ability\nLevel ' + convoIndex1.toString(), style1);
		abilityText1.setTextBounds(250, 64, 300, 400);
		abilityText1.fixedToCamera = true;
		abilityText1.alpha = 0;
		abilityText2 = game.add.text(0, 0, '>> Shield <<\n\nPress SPACE to freeze nearby objects\n\nBridget\'s ability\nLevel ' + convoIndex2.toString(), style1);
		abilityText2.setTextBounds(250, 64, 300, 400);
		abilityText2.fixedToCamera = true;
		abilityText2.alpha = 0;
		abilityText3 = game.add.text(0, 0, '>> Punch <<\n\nDouble-click an object to shove it away\n\nDelson\'s ability\nLevel ' + convoIndex3.toString(), style1);
		abilityText3.setTextBounds(250, 64, 300, 400);
		abilityText3.fixedToCamera = true;
		abilityText3.alpha = 0;
		abilityText4 = game.add.text(0, 0, '>> Radar <<\n\nIcons will notify you of incoming objects\n\nD4V3\'s ability\nLevel ' + convoIndex4.toString(), style1);
		abilityText4.setTextBounds(250, 64, 300, 400);
		abilityText4.fixedToCamera = true;
		abilityText4.alpha = 0;
		
		
		// Determine button positions
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
		
		// Add buttons
		if(convoIndex1 > 0){
			abilityBox1 = game.add.sprite(positions[count], 502, 'abilityIcon1');
			abilityBox1.fixedToCamera = true;
			abilityBox1.inputEnabled = true;
			count++;
		}
		if(convoIndex2 > 0){
			abilityBox2 = game.add.sprite(positions[count], 502, 'abilityIcon2');
			abilityBox2.fixedToCamera = true;
			abilityBox2.inputEnabled = true;
			count++;
		}
		if(convoIndex3 > 0){
			abilityBox3 = game.add.sprite(positions[count], 502, 'abilityIcon3');
			abilityBox3.fixedToCamera = true;
			abilityBox3.inputEnabled = true;
			count++;
		}
		if(convoIndex4 > 0){
			abilityBox4 = game.add.sprite(positions[count], 502, 'abilityIcon4');
			abilityBox4.fixedToCamera = true;
			abilityBox4.inputEnabled = true;
			if(convoIndex4 == 4) abilityBox4.events.onInputDown.add(this.secret, this);
		}
		
		// Create energy bar
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		energyBar.fixedToCamera = true;
		
		// Create invisible mouse sprite for the camera to follow
		mouse = game.add.sprite(0, 0, 'rock');
		mouse.anchor.set(0.5);
		mouse.alpha = 0;
		this.camera.follow(mouse, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		this.camera.deadzone = new Phaser.Rectangle(200, 0, 400, 600);
		game.camera.x = hallStart;
		this.camera.flash('#ffffff');
		
		// Add volume sprite in upper right corner
		volumeSprite = game.add.sprite(726, 10, 'volume');
		volumeSprite.animations.add('max', [0], 10, true);
		volumeSprite.animations.add('mid', [1], 10, true);
		volumeSprite.animations.add('min', [2], 10, true);
		volumeSprite.animations.add('mute', [3], 10, true);
		if(sfxVolume == 0.1) volumeSprite.animations.play('max');
		else if(sfxVolume == 0.05) volumeSprite.animations.play('mid');
		else if(sfxVolume == 0.025) volumeSprite.animations.play('min');
		else volumeSprite.animations.play('mute');
		volumeSprite.inputEnabled = true;
		volumeSprite.fixedToCamera = true;
		volumeSprite.events.onInputDown.add(changeVolume, this);
		
		// Change energy regen rate depending on conversations
		energyRegen = 0.05 + (0.005 * convoIndex1 * convoIndex1) + (0.005 * convoIndex1 * convoIndex1) + (0.005 * convoIndex2 * convoIndex2) + (0.005 * convoIndex3 * convoIndex3) + (0.005 * convoIndex4 * convoIndex4);
	},
	
	update : function() {
		
		// Move camera if mouse is near the edge of the screen
		mouse.x = game.input.x + game.camera.x;
		mouse.y = game.input.y + game.camera.y;
		
		// Update energy bar scaling
		if(energy < 0) energy = 0;
		else if(energy < 100) energy += energyRegen;
		energyBar.scale.x = energy/30;
		
		// Scroll background slowly
		this.background.tilePosition.x -= 2;
		
		// Show/hide ability info
		if(convoIndex1 > 0){
			if(abilityBox1.input.pointerOver() && abilityBox1.cameraOffset.y == 502){tooltipSound.play('',0,sfxVolume); abilityBox1.alpha = 1; game.add.tween(abilityBox1.cameraOffset).to( { y: 492 }, 30, "Linear", true); game.add.tween(abilityText1).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox1.input.pointerOver()){abilityBox1.alpha = 0.5; game.add.tween(abilityBox1.cameraOffset).to( { y: 502 }, 30, "Linear", true); game.add.tween(abilityText1).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex2 > 0){
			if(abilityBox2.input.pointerOver() && abilityBox2.cameraOffset.y == 502){tooltipSound.play('',0,sfxVolume); abilityBox2.alpha = 1; game.add.tween(abilityBox2.cameraOffset).to( { y: 492 }, 30, "Linear", true); game.add.tween(abilityText2).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox2.input.pointerOver()){abilityBox2.alpha = 0.5; game.add.tween(abilityBox2.cameraOffset).to( { y: 502 }, 30, "Linear", true); game.add.tween(abilityText2).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex3 > 0){
			if(abilityBox3.input.pointerOver() && abilityBox3.cameraOffset.y == 502){tooltipSound.play('',0,sfxVolume); abilityBox3.alpha = 1; game.add.tween(abilityBox3.cameraOffset).to( { y: 492 }, 30, "Linear", true); game.add.tween(abilityText3).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox3.input.pointerOver()){abilityBox3.alpha = 0.5; game.add.tween(abilityBox3.cameraOffset).to( { y: 502 }, 30, "Linear", true); game.add.tween(abilityText3).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex4 > 0){
			if(abilityBox4.input.pointerOver() && abilityBox4.cameraOffset.y == 502){tooltipSound.play('',0,sfxVolume); abilityBox4.alpha = 1; game.add.tween(abilityBox4.cameraOffset).to( { y: 492 }, 30, "Linear", true); game.add.tween(abilityText4).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox4.input.pointerOver()){abilityBox4.alpha = 0.5; game.add.tween(abilityBox4.cameraOffset).to( { y: 502 }, 30, "Linear", true); game.add.tween(abilityText4).to( { alpha: 0 }, 30, "Linear", true);}
		}
		let showBackground = false;
		if(convoIndex1 > 0 && abilityBox1.input.pointerOver()) showBackground = true;
		if(convoIndex2 > 0 && abilityBox2.input.pointerOver()) showBackground = true;
		if(convoIndex3 > 0 && abilityBox3.input.pointerOver()) showBackground = true;
		if(convoIndex4 > 0 && abilityBox4.input.pointerOver()) showBackground = true;
		
		if(showBackground) game.add.tween(abilityBackground).to( { alpha: 0.8 }, 30, "Linear", true);
		else game.add.tween(abilityBackground).to( { alpha: 0 }, 60, "Linear", true);
		
		// Show/hide door selectors
		if(convoIndex1 < 4 && lastConvo != 1){
			if(door1.input.pointerOver() && door1.alpha == 0.2){doorSound.play('',0,sfxVolume); game.add.tween(door1).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!door1.input.pointerOver()) game.add.tween(door1).to( { alpha: 0.2 }, 30, "Linear", true);
		}
		if(convoIndex2 < 4 && lastConvo != 2){
			if(door2.input.pointerOver() && door2.alpha == 0.2){doorSound.play('',0,sfxVolume); game.add.tween(door2).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!door2.input.pointerOver()) game.add.tween(door2).to( { alpha: 0.2 }, 30, "Linear", true);
		}
		if(convoIndex3 < 4 && lastConvo != 3){
			if(door3.input.pointerOver() && door3.alpha == 0.2){doorSound.play('',0,sfxVolume); game.add.tween(door3).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!door3.input.pointerOver()) game.add.tween(door3).to( { alpha: 0.2 }, 30, "Linear", true);
		}
		if(convoIndex4 < 4 && lastConvo != 4){
			if(door4.input.pointerOver() && door4.alpha == 0.2){doorSound.play('',0,sfxVolume); game.add.tween(door4).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!door4.input.pointerOver()) game.add.tween(door4).to( { alpha: 0.2 }, 30, "Linear", true);
		}
		if(pilotButton.input.pointerOver() && pilotButton.alpha == 0.2){pilotSound.play('',0,sfxVolume); game.add.tween(pilotButton).to( { alpha: 1 }, 30, "Linear", true);}
		else if(!pilotButton.input.pointerOver()) game.add.tween(pilotButton).to( { alpha: 0.2 }, 30, "Linear", true);
		if(volumeSprite.input.pointerOver() && volumeSprite.alpha == 0.6){pilotSound.play('',0,sfxVolume); game.add.tween(volumeSprite).to( { alpha: 1 }, 30, "Linear", true);}
		else if(!volumeSprite.input.pointerOver()) game.add.tween(volumeSprite).to( { alpha: 0.6 }, 30, "Linear", true);
		
		// Play music
		if(!music.isPlaying){
			if(levelNum == 0) music = game.add.audio('hallwayMusic1');
			else music = game.add.audio('hallwayMusic' + levelNum.toString());
			music.addMarker('time', marker, 206 - marker, sfxVolume*2, true);
			music.play('time', 0, 0, false);
			music.fadeTo(200,sfxVolume*2);
		}
		else if((music.currentTime/1000) + marker > 205) marker = 0;
	},
	
	door1Opened: function() {
		
		// Go to Patricia's next conversation
		convoIndex1++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 1;
		hallStart = 0;
		game.state.start('P' + convoIndex1.toString());
	},
	
	door2Opened: function() {
		
		// Go to Bridget's next conversation
		convoIndex2++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 2;
		hallStart = 0;
		game.state.start('B' + convoIndex2.toString());
	},
	
	door3Opened: function() {
		
		// Go to Delson's next conversation
		convoIndex3++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 3;
		hallStart = 0;
		game.state.start('D' + convoIndex3.toString());
	},
	
	door4Opened: function() {
		
		// Go to D4V3's next conversation
		convoIndex4++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 4;
		hallStart = 0;
		game.state.start('R' + convoIndex4.toString());
	},
	
	pilotShip: function() {
		selectedSound.play('',0,sfxVolume);
		marker = marker + (music.currentTime/1000);
		music.stop();
		lastConvo = 0;
		hallStart = 600;
		game.state.start('Play');
	},
	
	secret: function() {
		var shh = game.add.sprite(0, 0, 'secret');
		game.add.tween(shh).to( { alpha: 0 }, 1000, "Linear", true, 2000);
		shh.fixedToCamera = true;
	}
};