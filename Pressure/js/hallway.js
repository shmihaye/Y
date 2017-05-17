
var hallwayState = {
	
	create: function() {
		
		game.world.resize(1600, 600);
		game.camera.x = 800;
		game.add.sprite(0, 0, 'hallwayBackground');

		var door1 = game.add.sprite(58, 335, 'hallwayDoor');
		var door2 = game.add.sprite(263.5, 335, 'hallwayDoor');
		var door3 = game.add.sprite(469.5, 335, 'hallwayDoor');
		var door4 = game.add.sprite(675.5, 335, 'hallwayDoor');
		
		
		if(convoIndex1 < 4){door1.inputEnabled = true; door1.events.onInputDown.add(this.door1Opened, this);}
		if(convoIndex2 < 4){door2.inputEnabled = true; door2.events.onInputDown.add(this.door2Opened, this);}
		if(convoIndex3 < 4){door3.inputEnabled = true; door3.events.onInputDown.add(this.door3Opened, this);}
		if(convoIndex4 < 4){door4.inputEnabled = true; door4.events.onInputDown.add(this.door4Opened, this);}
		
	},
	
	update : function() {
		
		if(game.input.x > 700) game.camera.x += 10;
		else if(game.input.x < 100) game.camera.x -= 10;
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
	}

};