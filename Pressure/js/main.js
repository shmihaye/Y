
// Create global game container object
var Game = {};

// Global variables
// energy -- how much "health" the player has in the play state. Recharges over time
var energy = 100;
// convoIndex1-4 -- how many times the player has talked to characters 1-4
var convoIndex1 = 0;
var convoIndex2 = 0;
var convoIndex3 = 0;
var convoIndex4 = 0;

// Boot state
Game.Boot = function(){};
Game.Boot.prototype = {
	init: function(){
		// Don't pause the game if focus is lost
		this.stage.disableVisibilityChange = true;
	},
	preload: function(){
		// Prepare assets for load state
		this.load.path = 'assets/img/';
		this.load.image('bar', 'bar.png');
	},
	create: function(){
		// Enter the load state
		this.state.start('Load');
	}
};

// Load state
Game.Load = function(){};
Game.Load.prototype = {
	preload: function(){
		// Display "Loading..." text
		this.add.text(320, 260, 'Loading...', {fontSize: '32px', fill: 'white'});

		// Add preloader bar and set as preloader sprite (auto-crops sprite)
		this.preloadBar = this.add.sprite(this.world.centerX-100, this.world.centerY,'bar');
		this.load.setPreloadSprite(this.preloadBar);

		// Load game images
		this.load.path = 'assets/img/';
		game.load.image('cheesecake', 'cheesecake.png');
		game.load.image('ship', 'ship.png');
		game.load.image('gravRock', 'gravRock.png');
		game.load.image('spaceBackground', 'spaceBackground.png');
		game.load.image('hallwayDoor', 'hallwayDoor.png');
		game.load.image('hallwayBackground', 'hallwayBackgroundBase.png');
	},
	create: function() {
		// Disable preload bar crop while we wait for mp3 decoding
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		this.state.start('Play');
	}
};

// Create game
var game = new Phaser.Game(800, 600, Phaser.AUTO);
// Add game states
game.state.add('Boot', Game.Boot); // Booting up
game.state.add('Load', Game.Load); // Loading assets
game.state.add('Play', playState); // Playing the game
game.state.add('Hallway', hallwayState); // Navigating the hallway
game.state.add('Narrative', narrativeState); // Talking to a character
// Begin boot state
game.state.start('Boot');

