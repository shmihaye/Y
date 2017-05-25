

var energyBar;

var hallwayState = {
	
	create: function() {
		
		game.world.resize(1400, 600);
		game.camera.x = hallStart;
		this.background = game.add.tileSprite(0, 0, 1400, game.height, 'spaceBackground');
		game.add.sprite(0, 0, 'hallwayBackground');

		var door1 = game.add.sprite(30, 320, 'hallwayDoor');
		var door2 = game.add.sprite(230, 320, 'hallwayDoor');
		var door3 = game.add.sprite(435, 320, 'hallwayDoor');
		var door4 = game.add.sprite(645, 320, 'hallwayDoor');
		var pilotButton = game.add.sprite(1015, 320, 'hallwayDoor');
		energyBar = game.add.sprite(35, 10, 'bar'); // Placeholder image
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
		
		if(game.input.x > 650) game.camera.x += 10;
		else if(game.input.x < 150) game.camera.x -= 10;
		if(energy < 0) energy = 0;
		else if(energy < 100) energy += 0.01;
		energyBar.scale.x = energy/30;
		
		// Scroll background
		this.background.tilePosition.x -= 20;
	},
	
	door1Opened: function() {

		if (convoIndex1 == 3){
			game.state.start('D4');
					convoIndex1++

		}


		if (convoIndex1 == 2){

			game.state.start('D3');
					convoIndex1++

		}


		if (convoIndex1 == 1){
			game.state.start('D2');
					convoIndex1++

		}


		if (convoIndex1 == 0){

			game.state.start('D1');
					convoIndex1++

		}
//		game.state.start('Narrative');




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