

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
// hallStart -- The x position where the camera should start in the hallstart
var hallStart = 0;

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
		game.load.spritesheet('ship', 'ship.png', 64, 64);
		game.load.image('arm1', 'arm1.png');
		game.load.image('arm2', 'arm2.png');
		game.load.spritesheet('claw', 'claw.png', 12, 12);
		
		game.load.image('rock', 'rock.png');
		game.load.spritesheet('gravRock', 'gravRock.png', 64, 64);
		game.load.spritesheet('bombRock', 'bombRock.png', 64, 64);
		game.load.spritesheet('toxicRock', 'toxicRock.png', 64, 64);
		game.load.image('fragRock1', 'fragRock1.png');
		game.load.image('fragRock2', 'fragRock2.png');
		game.load.image('fragRock3', 'fragRock3.png');
		game.load.image('fragRock4', 'fragRock4.png');
		
		game.load.image('hallwayDoor', 'hallwayDoor.png');
		game.load.image('spaceBackground', 'spaceBackground.png');
		game.load.image('hallwayBackground', 'hallwayBackground.png');
		game.load.image('room1Background.png', 'room1Background.png');
		//game.load.image('room2Background.png', 'room2Background.png');
		game.load.image('room3Background.png', 'room3Background.png');
		game.load.image('room4Background.png', 'room4Background.png');
		
		game.load.image('patricia1', 'patricia1.png');
		game.load.image('patricia2', 'patricia2.png');
		//game.load.image('patricia3', 'patricia3.png');
		//game.load.image('patricia4', 'patricia4.png');
		//game.load.image('bridget1', 'bridget1.png');
		//game.load.image('bridget2', 'bridget2.png');
		//game.load.image('bridget3', 'bridget3.png');
		//game.load.image('bridget4', 'bridget4.png');
		game.load.image('delson1', 'delson1.png');
		game.load.image('delson2', 'delson2.png');
		//game.load.image('delson3', 'delson3.png');
		//game.load.image('delson4', 'delson4.png');
		//game.load.image('d4v31', 'd4v31.png');
		//game.load.image('d4v32', 'd4v32.png');
		//game.load.image('d4v33', 'd4v33.png');
		//game.load.image('d4v34', 'd4v34.png');
	},
	create: function() {
		// Disable preload bar crop while we wait for mp3 decoding
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		this.state.start('Hallway');
	}
};

// Create game
var game = new Phaser.Game(800, 600, Phaser.AUTO);
// Add game states
game.state.add('Boot', Game.Boot); // Booting up
game.state.add('Load', Game.Load); // Loading assets
game.state.add('Play', playState); // Playing the game
game.state.add('Hallway', hallwayState); // Navigating the hallway
game.state.add('D1', D1); // Delson conversation 1
game.state.add('D2', D2); // Delson conversation 2
game.state.add('D3', D3); // Delson conversation 3
game.state.add('D4', D4); // Delson conversation 4
game.state.add('Narrative', narrativeState); // Talking to a character
// Begin boot state
game.state.start('Boot');
