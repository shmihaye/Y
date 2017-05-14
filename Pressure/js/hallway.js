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
		
		if(convoIndex1 < 4){door1.inputEnabled = true; door1.events.onInputDown.add(this.door1Opened, this);}
		if(convoIndex2 < 4){door2.inputEnabled = true; door2.events.onInputDown.add(this.door2Opened, this);}
		if(convoIndex3 < 4){door3.inputEnabled = true; door3.events.onInputDown.add(this.door3Opened, this);}
		if(convoIndex4 < 4){door4.inputEnabled = true; door4.events.onInputDown.add(this.door4Opened, this);}
		
	},
	
	update: function() {

		
	
	},
	
	door1Opened: function() {
		
		convoIndex1++;
		console.log('1 ' + convoIndex1);
		
		// Load state 1.
		
		game.state.start('Play');
	},
	
	door2Opened: function() {
		
		convoIndex2++;
		console.log('2 ' + convoIndex2);
		
		// Load state 2.
		
		game.state.start('Play');
	},
	
	door3Opened: function() {
		
		convoIndex3++;
		console.log('3 ' + convoIndex3);
		
		// Load state 3.
		
		game.state.start('Play');
	},
	
	door4Opened: function() {
		
		convoIndex4++;
		console.log('4 ' + convoIndex4);
		
		// Load state 4.
		
		game.state.start('Play');
	}

};
