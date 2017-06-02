
var door1, door2, door3, door4, pilotButton, mouse;
var abilityBox1, abilityBox2, abilityBox3, abilityBox4, textBackground;
var abilityText1, abilityText2, abilityText3, abilityText4;
var doorSound, pilotSound, tooltipSound, selectedSound;
var lastConvo = 0;

var hallwayState = {
	
	
	
	create: function() {
		
		// Add hallway backgrounds
		game.world.resize(1400, 600);
		this.background = game.add.tileSprite(0, 0, 1400, game.height, 'spaceBackground');
		game.add.sprite(0, 0, 'hallwayBackground');
		
		// Add doors
		if(convoIndex1 < 4 && lastConvo != 1){
			door1 = game.add.sprite(30, 320, 'hallwayDoor');
			door1.inputEnabled = true;
			door1.events.onInputDown.add(this.door1Opened, this);
		}
		if(convoIndex2 < 4 && lastConvo != 2){
			door2 = game.add.sprite(230, 320, 'hallwayDoor');
			door2.inputEnabled = true;
			door2.events.onInputDown.add(this.door2Opened, this);
		}
		if(convoIndex3 < 4 && lastConvo != 3){
			door3 = game.add.sprite(435, 320, 'hallwayDoor');
			door3.inputEnabled = true;
			door3.events.onInputDown.add(this.door3Opened, this);
		}
		if(convoIndex4 < 4 && lastConvo != 4){
			door4 = game.add.sprite(645, 320, 'hallwayDoor');
			door4.inputEnabled = true;
			door4.events.onInputDown.add(this.door4Opened, this);
		}
		pilotButton = game.add.sprite(1015, 320, 'hallwayDoor');
		pilotButton.inputEnabled = true;
		pilotButton.events.onInputDown.add(this.pilotShip, this);
		
		// Create text background background and popup text
		abilityBackground = game.add.sprite(250, 64, 'textBackground');
		abilityBackground.alpha = 0;
		abilityBackground.fixedToCamera = true;
		abilityText1 = game.add.text(0, 0, 'Dash\n Patricia\'s ability\n Level ' + convoIndex1.toString() + '\n\n Double-tap a direction for a short burst of speed', style1);
		abilityText1.setTextBounds(250, 64, 300, 400);
		abilityText1.fixedToCamera = true;
		abilityText1.alpha = 0;
		abilityText2 = game.add.text(0, 0, 'Shield\n Bridget\'s ability\n Level ' + convoIndex2.toString() + '\n\n Press space for a temporary deflection shield', style1);
		abilityText2.setTextBounds(250, 64, 300, 400);
		abilityText2.fixedToCamera = true;
		abilityText2.alpha = 0;
		abilityText3 = game.add.text(0, 0, 'Punch\n Delson\'s ability\n Level ' + convoIndex3.toString() + '\n\n Double-click an object to push it away', style1);
		abilityText3.setTextBounds(250, 64, 300, 400);
		abilityText3.fixedToCamera = true;
		abilityText3.alpha = 0;
		abilityText4 = game.add.text(0, 0, 'Radar\n D4V3\'s ability\n Level ' + convoIndex4.toString() + '\n\n Icons will notify you of incoming objects', style1);
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
			abilityBox1 = game.add.sprite(positions[count], 528, 'abilityBox1');
			abilityBox1.fixedToCamera = true;
			abilityBox1.inputEnabled = true;
			count++;
		}
		if(convoIndex2 > 0){
			abilityBox2 = game.add.sprite(positions[count], 528, 'abilityBox2');
			abilityBox2.fixedToCamera = true;
			abilityBox2.inputEnabled = true;
			count++;
		}
		if(convoIndex3 > 0){
			abilityBox3 = game.add.sprite(positions[count], 528, 'abilityBox3');
			abilityBox3.fixedToCamera = true;
			abilityBox3.inputEnabled = true;
			count++;
		}
		if(convoIndex4 > 0){
			abilityBox4 = game.add.sprite(positions[count], 528, 'abilityBox4');
			abilityBox4.fixedToCamera = true;
			abilityBox4.inputEnabled = true;
			if(convoIndex4 == 4) abilityBox4.events.onInputDown.add(this.secret, this);
		}
		
		// Create energy bar
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		energyBar.fixedToCamera = true;
		
		// Prepare sound effects
		tooltipSound = game.add.audio('tooltip');
		doorSound = game.add.audio('door');
		pilotSound = game.add.audio('pilot');
		selectedSound = game.add.audio('selected');
		
		// Create invisible mouse sprite for the camera to follow
		mouse = game.add.sprite(0, 0, 'rock');
		mouse.anchor.set(0.5);
		mouse.alpha = 0;
		this.camera.follow(mouse, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);
		this.camera.deadzone = new Phaser.Rectangle(200, 0, 400, 600);
		game.camera.x = hallStart;
		if(hallStart == 600) this.camera.flash('#ffffff');
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
			if(abilityBox1.input.pointerOver() && abilityBox1.cameraOffset.y == 528){tooltipSound.play('',0,sfxVolume); abilityBox1.alpha = 1; game.add.tween(abilityBox1.cameraOffset).to( { y: 512 }, 30, "Linear", true); game.add.tween(abilityText1).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox1.input.pointerOver()){abilityBox1.alpha = 0.5; game.add.tween(abilityBox1.cameraOffset).to( { y: 528 }, 30, "Linear", true); game.add.tween(abilityText1).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex2 > 0){
			if(abilityBox2.input.pointerOver() && abilityBox2.cameraOffset.y == 528){tooltipSound.play('',0,sfxVolume); abilityBox2.alpha = 1; game.add.tween(abilityBox2.cameraOffset).to( { y: 512 }, 30, "Linear", true); game.add.tween(abilityText2).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox2.input.pointerOver()){abilityBox2.alpha = 0.5; game.add.tween(abilityBox2.cameraOffset).to( { y: 528 }, 30, "Linear", true); game.add.tween(abilityText2).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex3 > 0){
			if(abilityBox3.input.pointerOver() && abilityBox3.cameraOffset.y == 528){tooltipSound.play('',0,sfxVolume); abilityBox3.alpha = 1; game.add.tween(abilityBox3.cameraOffset).to( { y: 512 }, 30, "Linear", true); game.add.tween(abilityText3).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox3.input.pointerOver()){abilityBox3.alpha = 0.5; game.add.tween(abilityBox3.cameraOffset).to( { y: 528 }, 30, "Linear", true); game.add.tween(abilityText3).to( { alpha: 0 }, 30, "Linear", true);}
		}
		if(convoIndex4 > 0){
			if(abilityBox4.input.pointerOver() && abilityBox4.cameraOffset.y == 528){tooltipSound.play('',0,sfxVolume); abilityBox4.alpha = 1; game.add.tween(abilityBox4.cameraOffset).to( { y: 512 }, 30, "Linear", true); game.add.tween(abilityText4).to( { alpha: 1 }, 30, "Linear", true);}
			else if(!abilityBox4.input.pointerOver()){abilityBox4.alpha = 0.5; game.add.tween(abilityBox4.cameraOffset).to( { y: 528 }, 30, "Linear", true); game.add.tween(abilityText4).to( { alpha: 0 }, 30, "Linear", true);}
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
	},
	
	door1Opened: function() {
		
		// Go to Patricia's next conversation
		convoIndex1++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 1;
		game.state.start('P' + convoIndex1.toString());
	},
	
	door2Opened: function() {
		
		// Go to Bridget's next conversation
		convoIndex2++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 2;
		game.state.start('B' + convoIndex2.toString());
	},
	
	door3Opened: function() {
		
		// Go to Delson's next conversation
		convoIndex3++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 3;
		game.state.start('D' + convoIndex3.toString());
	},
	
	door4Opened: function() {
		
		// Go to D4V3's next conversation
		convoIndex4++;
		tooltipSound.play('',0,sfxVolume);
		lastConvo = 4;
		game.state.start('R' + convoIndex4.toString());
	},
	
	pilotShip: function() {
		selectedSound.play('',0,sfxVolume);
		lastConvo = 0;
		game.state.start('Play');
	},
	
	secret: function() {
		var shh = game.add.sprite(0, 0, 'secret');
		game.add.tween(shh).to( { alpha: 0 }, 1000, "Linear", true, 2000);
		shh.fixedToCamera = true;
	}
};