// The index of dialogues of each crew member
var convoIndex1 = 0;
var convoIndex2 = 0;
var convoIndex3 = 0;
var convoIndex4 = 0;

var hallwayState = {
	
	// Place image loading in the Load state in main.js
	
	create: function() {
		
		game.add.sprite(0, 0, 'hallwayBackground');

		var door1 = game.add.sprite(58, 335, 'hallwayDoor');
		var door2 = game.add.sprite(263.5, 335, 'hallwayDoor');
		var door3 = game.add.sprite(469.5, 335, 'hallwayDoor');
		var door4 = game.add.sprite(675.5, 335, 'hallwayDoor');
		
		door1.inputEnabled = true; door1.events.onInputDown.add(this.door1Opened, this);
		door2.inputEnabled = true; door2.events.onInputDown.add(this.door2Opened, this);
		door3.inputEnabled = true; door3.events.onInputDown.add(this.door3Opened, this);
		door4.inputEnabled = true; door4.events.onInputDown.add(this.door4Opened, this);
		
	},
	
	update: function() {

		
	
	},
	
	door1Opened: function() {
		
		convoIndex1++;
		console.log('1 ' + convoIndex1);
		
		// Load state 1.
		
	},
	
	door2Opened: function() {
		
		convoIndex2++;
		console.log('2 ' + convoIndex2);
		
		// Load state 2.
		
	},
	
	door3Opened: function() {
		
		convoIndex3++;
		console.log('3 ' + convoIndex3);
		
		// Load state 3.
		
	},
	
	door4Opened: function() {
		
		convoIndex4++;
		console.log('4 ' + convoIndex4);
		
		// Load state 4.
		
	}

};
