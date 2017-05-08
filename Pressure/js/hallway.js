// The index of dialogues of each crew member
var convoIndexRed = 0;
var convoIndexGreen = 0;
var convoIndexBlue = 0;

var hallwayState = {
	
	preload: function() {
		
		game.load.path = 'assets/img/';
		game.load.image('redDoor', 'redDoor.png');
		game.load.image('greenDoor', 'greenDoor.png');
		game.load.image('blueDoor', 'blueDoor.png');
		
	},

	create: function() {

		redDoor = game.add.sprite(game.world.centerX - 100, game.world.centerY, 'redDoor');
		greenDoor = game.add.sprite(game.world.centerX, game.world.centerY, 'greenDoor');
		blueDoor = game.add.sprite(game.world.centerX + 100, game.world.centerY, 'blueDoor');
		
		redDoor.inputEnabled = true;
		redDoor.events.onInputDown.add(this.redDoorOpened, this);
		greenDoor.inputEnabled = true;
		greenDoor.events.onInputDown.add(this.greenDoorOpened, this);
		blueDoor.inputEnabled = true;
		blueDoor.events.onInputDown.add(this.blueDoorOpened, this);
		
	},
	
	update: function() {

		
	
	},
	
	redDoorOpened: function() {
		
		convoIndexRed++;
		console.log('r' + convoIndexRed);
		
		// Load red state.
		
	},
	
	greenDoorOpened: function() {
		
		convoIndexGreen++;
		console.log('g' + convoIndexGreen);
		
		// Load green state.
		
	},
	
	blueDoorOpened: function() {
		
		convoIndexBlue++;
		console.log('b' + convoIndexBlue);
		
		// Load blue state.
		
	}

};
