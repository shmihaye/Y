

// Create global game container object
var Game = {};

// Global variables
// energy -- how much "health" the player has in the play state. Recharges over time
var energy = 100;
var energyRegen = 0.05;
var energyBar;
// convoIndex1-4 -- how many times the player has talked to characters 1-4
var convoIndex1 = 0;
var convoIndex2 = 0;
var convoIndex3 = 0;
var convoIndex4 = 0;
// font colors for the narrative state
var unselected_color = "#7FFFD4"
var selected_color = "#00BFFF"

var patrestclr = "#4e7d48"
var pathoverclr = "#7a9b76"
var delrestclr = "#5e2f23"
var delhoverclr = "#764134"
var bridrestclr = "#2a2247"
var bridhoverclr =  "#565264"
var d4restclr = "#80432f"
var d4hoverclr = "#9e6654"




var done_color = "#0000FF"
var style1 = { font: "32px Source Sans Pro", fill: unselected_color, align: "center", wordWrap: true, wordWrapWidth: 250, boundsAlignH: "center", boundsAlignV: "middle" };
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
		game.load.image('textBackground', 'textBackground.png');
		game.load.image('room1Background', 'room1Background.png');
		game.load.image('room2Background', 'room2Background.png');
		game.load.image('room3Background', 'room3Background.png');
		game.load.image('room4Background', 'room4Background.png');
		
		game.load.image('patricia1', 'patricia1.png');
		game.load.image('patricia2', 'patricia2.png');
		game.load.image('patricia3', 'patricia3.png');
		game.load.image('patricia4', 'patricia4.png');
		game.load.image('bridget1', 'bridget1.png');
		game.load.image('bridget2', 'bridget2.png');
		game.load.image('bridget3', 'bridget3.png');
		game.load.image('bridget4', 'bridget4.png');
		game.load.image('delson1', 'delson1.png');
		game.load.image('delson2', 'delson2.png');
		game.load.image('delson3', 'delson3.png');
		game.load.image('delson4', 'delson4.png');
		game.load.image('d4v31', 'd4v31.png');
		game.load.image('d4v32', 'd4v32.png');
		game.load.image('d4v33', 'd4v33.png');
		game.load.image('d4v34', 'd4v34.png');
		game.load.image('secret', 'secret.png');
		
		game.load.image('abilityBox1', 'abilityBox1.png');
		game.load.image('abilityBox2', 'abilityBox2.png');
		game.load.image('abilityBox3', 'abilityBox3.png');
		game.load.image('abilityBox4', 'abilityBox4.png');
		
		// Load game sounds and music
		this.load.path = 'assets/audio/';
		//game.load.audio('titleMusic', ['title.mp3','title.ogg']);
		game.load.audio('break1', ['break1.mp3']);
		game.load.audio('break2', ['break2.mp3']);
		game.load.audio('break3', ['break3.mp3']);
		game.load.audio('break4', ['break4.mp3']);
		game.load.audio('break5', ['break5.mp3']);
		game.load.audio('grab', ['grab.mp3']);
		game.load.audio('release', ['release.mp3']);
		game.load.audio('door', ['door.mp3']);
		game.load.audio('hurt', ['hurt.mp3']);
		game.load.audio('pilot', ['pilot.mp3']);
		game.load.audio('tooltip', ['tooltip.mp3']);
		game.load.audio('selected', ['selected.mp3']);
	},
	create: function() {
		// Disable preload bar crop while we wait for mp3 decoding
		this.preloadBar.cropEnabled = false;
	},
	update: function() {
		// Wait for music mp3s to properly decode
		//if(this.cache.isSoundDecoded('titleMusic') && this.cache.isSoundDecoded('mainMusic')) {
			// When the music is ready, advance to title screen!
			//this.state.start('Play');
		//}
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
game.state.add('P1', P1); // Patricia conversation 1
game.state.add('P2', P2); // Patricia conversation 2
game.state.add('P3', P3); // Patricia conversation 3
game.state.add('P4', P4); // Patricia conversation 4
game.state.add('B1', B1); // Bridget conversation 1
game.state.add('B2', B2); // Bridget conversation 2
game.state.add('B3', B3); // Bridget conversation 3
game.state.add('B4', B4); // Bridget conversation 4
game.state.add('D1', D1); // Delson conversation 1
game.state.add('D2', D2); // Delson conversation 2
game.state.add('D3', D3); // Delson conversation 3
game.state.add('D4', D4); // Delson conversation 4
game.state.add('R1', R1); // D4V3 conversation 1
game.state.add('R2', R2); // D4V3 conversation 2
game.state.add('R3', R3); // D4V3 conversation 3
game.state.add('R4', R4); // D4V3 conversation 4
// Begin boot state
game.state.start('Boot');
