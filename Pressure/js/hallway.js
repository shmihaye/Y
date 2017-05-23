
var energyBar;

var hallwayState = {
	
	create: function() {
		
		game.world.resize(1600, 600);
		game.camera.x = hallStart;
		game.add.sprite(0, 0, 'hallwayBackground');
		game.add.sprite(800, 0, 'controlHubBackground');

		var door1 = game.add.sprite(58, 335, 'hallwayDoor');
		var door2 = game.add.sprite(263.5, 335, 'hallwayDoor');
		var door3 = game.add.sprite(469.5, 335, 'hallwayDoor');
		var door4 = game.add.sprite(675.5, 335, 'hallwayDoor');
		var pilotButton = game.add.sprite(1145.5, 335, 'rock'); // Placeholder image
		energyBar = game.add.sprite(35, 10, 'rock'); // Placeholder image
		energyBar.scale.x = 10;
		energyBar.scale.y = 0.25;
		energyBar.fixedToCamera = true;
		
		
		if(convoIndex1 < 4){door1.inputEnabled = true; door1.events.onInputDown.add(this.door1Opened, this);}
		if(convoIndex2 < 4){door2.inputEnabled = true; door2.events.onInputDown.add(this.door2Opened, this);}
		if(convoIndex3 < 4){door3.inputEnabled = true; door3.events.onInputDown.add(this.door3Opened, this);}
		if(convoIndex4 < 4){door4.inputEnabled = true; door4.events.onInputDown.add(this.door4Opened, this);}
		pilotButton.inputEnabled = true; pilotButton.events.onInputDown.add(this.pilotShip, this);
	},
	
	update : function() {
		
		if(game.input.x > 700) game.camera.x += 10;
		else if(game.input.x < 100) game.camera.x -= 10;
		if(energy < 0) energy = 0;
		else if(energy < 100) energy += 0.01;
		energyBar.scale.x = energy/11;
	},
	
	door1Opened: function() {
		
		convoIndex1++;
		game.state.start('Narrative');
	},
	
	door2Opened: function() {
		
		convoIndex2++;
		game.state.start('Narrative');
	},
	
	door3Opened: function() {
		
		convoIndex3++;
		game.state.start('Narrative');
	},
	
	door4Opened: function() {
		
		convoIndex4++;
		game.state.start('Narrative');
	},
	
	pilotShip: function() {
		
		game.state.start('Play');
	}

};