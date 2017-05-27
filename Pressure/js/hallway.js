
var hallwayState = {
	
	create: function() {
		
		game.world.resize(1400, 600);
		game.camera.x = hallStart;
		if(hallStart == 600) this.camera.flash('#ffffff');
		this.background = game.add.tileSprite(0, 0, 1400, game.height, 'spaceBackground');
		game.add.sprite(0, 0, 'hallwayBackground');

		var door1 = game.add.sprite(30, 320, 'hallwayDoor');
		var door2 = game.add.sprite(230, 320, 'hallwayDoor');
		var door3 = game.add.sprite(435, 320, 'hallwayDoor');
		var door4 = game.add.sprite(645, 320, 'hallwayDoor');
		var pilotButton = game.add.sprite(1015, 320, 'hallwayDoor');
		
		// Create energy bar
		energyBar = game.add.sprite(65, 580, 'bar');
		energyBar.scale.x = 3;
		energyBar.scale.y = 0.5;
		energyBar.fixedToCamera = true;
		
		if(convoIndex1 < 4){door1.inputEnabled = true; door1.events.onInputDown.add(this.door1Opened, this);}
		if(convoIndex2 < 4){door2.inputEnabled = true; door2.events.onInputDown.add(this.door2Opened, this);}
		if(convoIndex3 < 4){door3.inputEnabled = true; door3.events.onInputDown.add(this.door3Opened, this);}
		if(convoIndex4 < 4){door4.inputEnabled = true; door4.events.onInputDown.add(this.door4Opened, this);}
		pilotButton.inputEnabled = true; pilotButton.events.onInputDown.add(this.pilotShip, this);
	},
	
	update : function() {
		
		// Move camera if mouse is near the edge of the screen
		if(game.input.x > 650) game.camera.x += 10;
		else if(game.input.x < 150) game.camera.x -= 10;
		
		// Update energy bar scaling
		if(energy < 0) energy = 0;
		else if(energy < 100) energy += 0.01;
		energyBar.scale.x = energy/30;
		
		// Scroll background slowly
		this.background.tilePosition.x -= 2;
	},
	
	door1Opened: function() {
		
		// Go to Patricia's next conversation
		convoIndex1++;
		game.state.start('P' + convoIndex1.toString());
	},
	
	door2Opened: function() {
		
		// Go to Bridget's next conversation
		convoIndex2++;
		game.state.start('B' + convoIndex2.toString());
	},
	
	door3Opened: function() {
		
		// Go to Delson's next conversation
		convoIndex3++;
		game.state.start('D' + convoIndex3.toString());
	},
	
	door4Opened: function() {
		
		// Go to D4V3's next conversation
		convoIndex4++;
		game.state.start('R' + convoIndex4.toString());
	},
	
	pilotShip: function() {
		
		game.state.start('Play');
	}
};