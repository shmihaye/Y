

// Create global game container object
var Game = {};

// Global variables
// energy -- how much "health" the player has in the play state. Recharges over time
var energy = 100;
var energyRegen = 0.05;
var energyBar;
// levelNum and demoNum -- the current level/demo the player is entering
var levelNum = 0, demoNum = 0;
// convoIndex1-4 -- how many times the player has talked to characters 1-4
var convoIndex1 = 0;
var convoIndex2 = 0;
var convoIndex3 = 0;
var convoIndex4 = 0;
// lastConvo -- the last convo state entered
var lastConvo = 0;
// font colors for the narrative state
var unselected_color = "#FFFAF0"
var selected_color = "#00BFFF"
var patrestclr = "#4e7d48"
var pathoverclr = "#7a9b76"
var delrestclr = "#5e2f23"
var delhoverclr = "#764134"
var bridrestclr = "#565264"
var bridhoverclr =  "#706b7f"
var d4restclr = "#2E86C1"
var d4hoverclr = "#5DADE2"
// Sound effect volume
var sfxVolume = 1, volumeSprite;
// The current music track
var music, marker = 0;
// Sound effect variables
var breakSounds = [];
var grabSound, releaseSound, hurtSound, explodeSound, implodeSound, dashSound, punchSound, radarSound, doorSound, pilotSound, tooltipSound, selectedSound;
// Global variables for play state
var player, obstacles, background, timestep, levelData, speedUp, energyReduction, emitter, beacon, wasd;
var abilityIcon1, abilityIcon2, abilityIcon3, abilityIcon4;
var addObstacles = [];
// Global variables for the hallway state
var door1, door2, door3, door4, pilotButton, mouse;
var abilityBox1, abilityBox2, abilityBox3, abilityBox4, textBackground;
var abilityText1, abilityText2, abilityText3, abilityText4;
// Global variables for intro state
var cutsceneStatus = 0, manta, tween, beacon1, beacon2, beacon3, beacon4, beacon5, beacon6, beacon7, beacon8, beacon9, beacon10, beaconFlash, konami = 0;


var done_color = "#0000FF"
var style1 = { font: "32px Source Sans Pro", fill: unselected_color, align: "center", wordWrap: true, wordWrapWidth: 250, boundsAlignH: "center", boundsAlignV: "middle" };
var style2 = { font: "24px Source Sans Pro", fill: unselected_color, align: "center", wordWrap: true, wordWrapWidth: 600, boundsAlignH: "center", boundsAlignV: "middle" };
// hallStart -- The x position where the camera should start in the hallway
var hallStart = 600;

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
		game.load.image('shield', 'shield.png');
		
		game.load.image('rock', 'rock.png');
		game.load.spritesheet('gravRock', 'gravRock.png', 64, 64);
		game.load.spritesheet('bombRock', 'bombRock.png', 64, 64);
		game.load.spritesheet('toxicRock', 'toxicRock.png', 64, 64);
		game.load.image('fragRock1', 'fragRock1.png');
		game.load.image('fragRock2', 'fragRock2.png');
		game.load.image('fragRock3', 'fragRock3.png');
		game.load.image('fragRock4', 'fragRock4.png');
		game.load.spritesheet('orbitRock', 'orbitRock.png', 64, 64);
		game.load.spritesheet('orbitRock2', 'orbitRock2.png', 64, 64);
		game.load.image('particle1', 'particle1.png');
		game.load.image('particle2', 'particle2.png');
		game.load.image('particle3', 'particle3.png');

		game.load.image('earth', 'earth.png');
		game.load.image('terraNovus', 'terraNovus.png');
		game.load.image('nebula', 'nebula.png');
		game.load.spritesheet('pioneer1', 'pioneer1.png', 64, 64);
		game.load.spritesheet('beacon', 'beacon.png', 64, 64);
		game.load.image('dotLine', 'dotLine.png');
		game.load.image('logo', 'logo.png');
		game.load.image('wasd', 'wasd.png');
		game.load.spritesheet('volume', 'volume.png', 64, 64);
		
		game.load.image('selectChair', 'selectChair.png');
		game.load.image('selectD4V3', 'selectD4V3.png');
		game.load.image('selectDelson', 'selectDelson.png');
		game.load.image('selectBridget', 'selectBridget.png');
		game.load.image('selectPatricia', 'selectPatricia.png');
		game.load.image('spaceBackground', 'spaceBackground.png');
		game.load.image('hallwayBackground', 'hallwayBackground.png');
		game.load.image('textBackground', 'textBackground.png');
		game.load.image('room1Background', 'room1Background.png');
		game.load.image('room2Background', 'room2Background.png');
		game.load.image('room3Background', 'room3Background.png');
		game.load.image('room4Background', 'room4Background.png');
		game.load.image('creditsBackground', 'creditsBackground.png');
		
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
		game.load.image('abilityIcon1', 'abilityIcon1.png');
		game.load.image('abilityIcon2', 'abilityIcon2.png');
		game.load.image('abilityIcon3', 'abilityIcon3.png');
		game.load.image('abilityIcon4', 'abilityIcon4.png');
		
		// Load game sounds and music
		this.load.path = 'assets/audio/';
		game.load.audio('playMusic1', ['play1.mp3','play1.ogg']);
		game.load.audio('playMusic2', ['play2.mp3','play2.ogg']);
		game.load.audio('playMusic3', ['play3.mp3','play3.ogg']);
		game.load.audio('hallwayMusic1', ['hallway1.mp3','hallway1.ogg']);
		game.load.audio('hallwayMusic2', ['hallway2.mp3','hallway2.ogg']);
		game.load.audio('hallwayMusic3', ['hallway3.mp3','hallway3.ogg']);
		game.load.audio('hallwayMusic4', ['hallway4.mp3','hallway4.ogg']);
		game.load.audio('hallwayMusic5', ['hallway5.mp3','hallway5.ogg']);
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
		game.load.audio('boom', ['explode.mp3']);
		game.load.audio('implode', ['implode.mp3']);
		game.load.audio('dash', ['dash.mp3']);
		game.load.audio('punch', ['punch.mp3']);
		game.load.audio('shield', ['shield.mp3']);
		game.load.audio('radar', ['radar.mp3']);
		game.load.audio('error', ['error.mp3']);
		
	},
	create: function() {
		// Disable preload bar crop while we wait for mp3 decoding
		this.preloadBar.cropEnabled = false;
		
		// Prepare sound effects
		for(let i = 1; i <= 5; i++){
			var sound = game.add.audio('break' + i.toString());
			breakSounds.push(sound);
		}
		grabSound = game.add.audio('grab');
		releaseSound = game.add.audio('release');
		hurtSound = game.add.audio('hurt');
		explodeSound = game.add.audio('boom');
		implodeSound = game.add.audio('implode');
		dashSound = game.add.audio('dash');
		punchSound = game.add.audio('punch');
		radarSound = game.add.audio('radar');
		shieldSound = game.add.audio('shield');
		errorSound = game.add.audio('error');
		tooltipSound = game.add.audio('tooltip');
		doorSound = game.add.audio('door');
		pilotSound = game.add.audio('pilot');
		selectedSound = game.add.audio('selected');
	},
	update: function() {
		// Wait for music mp3s to properly decode
		if(this.cache.isSoundDecoded('playMusic1') && this.cache.isSoundDecoded('playMusic2')
			&& this.cache.isSoundDecoded('playMusic3') && this.cache.isSoundDecoded('hallwayMusic1')
			&& this.cache.isSoundDecoded('hallwayMusic2') && this.cache.isSoundDecoded('hallwayMusic3')
			&& this.cache.isSoundDecoded('hallwayMusic4') && this.cache.isSoundDecoded('hallwayMusic5')){
			// When the music is ready, advance to title screen!
			this.state.start('Title');
		}
	}
};

// Title state
Game.Title = function(){};
Game.Title.prototype = {
	create: function(){
		// Add background
		this.background = game.add.tileSprite(0, 0, game.width, game.height, 'spaceBackground');
		
		// Add title text
		var startText = game.add.text(0, 0, 'Press SPACE to begin', style2);
		startText.setTextBounds(0, 500, 800, 100);
		startText.stroke = '#000000';
    	startText.strokeThickness = 6;
		
		// Add game logo
		game.add.sprite(336, 100, 'logo');
		
		// Add volume sprite in upper right corner
		volumeSprite = game.add.sprite(726, 10, 'volume');
		volumeSprite.animations.add('max', [0], 10, true);
		volumeSprite.animations.add('mid', [1], 10, true);
		volumeSprite.animations.add('min', [2], 10, true);
		volumeSprite.animations.add('mute', [3], 10, true);
		if(sfxVolume == 1) volumeSprite.animations.play('max');
		else if(sfxVolume == 0.3) volumeSprite.animations.play('mid');
		else if(sfxVolume == 0.1) volumeSprite.animations.play('min');
		else volumeSprite.animations.play('mute');
		volumeSprite.inputEnabled = true;
		volumeSprite.events.onInputDown.add(changeVolume, this);
		
		// Play music
		music = this.add.audio('hallwayMusic1');
		music.play('', 0, sfxVolume, true);
		
		// Fade in from black
		this.camera.flash('#ffffff');
	},
	update: function(){
		// If space is pressed, begin intro
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			this.camera.fade('#ffffff');
			this.camera.onFadeComplete.add(startGame,this);
		}
		
		// It's a secret to everyone
		if(konami != 10){
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)){
			if(konami == 0 || konami == 1) konami++;
			else konami = 0;
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)){
			if(konami == 2 || konami == 3) konami++;
			else konami = 0;
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)){
			if(konami == 4 || konami == 6) konami++;
			else konami = 0;
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT)){
			if(konami == 5 || konami == 7) konami++;
			else konami = 0;
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.A)){
			if(konami == 9){
				selectedSound.play('',0,sfxVolume);
				konami++;
			}
			else konami = 0;
		}
		if(game.input.keyboard.justPressed(Phaser.Keyboard.B)){
			if(konami == 8) konami++;
			else konami = 0;
		}}
		
		if(volumeSprite.input.pointerOver() && volumeSprite.alpha == 0.6){pilotSound.play('',0,sfxVolume); game.add.tween(volumeSprite).to( { alpha: 1 }, 30, "Linear", true);}
		else if(!volumeSprite.input.pointerOver()) game.add.tween(volumeSprite).to( { alpha: 0.6 }, 30, "Linear", true);
		
		// Scroll background
		this.background.tilePosition.x -= 1;
	}
};

// Credits state
Game.Credits = function(){};
Game.Credits.prototype = {
	create: function(){
		game.add.tileSprite(0, 0, game.width, game.height, 'creditsBackground');
		
		// Create credits text
		var credits = game.add.text(0, 0, 'THE END\nYou have retrieved the beacon. Thanks for playing!\nCredits:\nBrody Richards | Programmer, Writer\nFreeman | Programmer, Level Designer\nGiovanni Benedetti | Composer, Ray\'s Cool Cousin\nKaylie Cetera | Character & Environment Artist\nRaymond Reedy | Space Artist, Writer\nShayne Hayes | Programmer, Producer', style2);
		credits.setTextBounds(100, 100, 600, 200);
		credits.stroke = '#000000';
    	credits.strokeThickness = 6;
		
		// Add restart text
		var restartText = game.add.text(0, 0, 'Press SPACE to restart', style2);
		restartText.setTextBounds(0, 500, 800, 100);
		restartText.stroke = '#000000';
    	restartText.strokeThickness = 6;
		
		// Play music
		music = this.add.audio('hallwayMusic5');
		music.play('', 0, sfxVolume, true);
		
		// Fade in from black
		this.camera.flash('#ffffff');
	},
	update: function(){
		// If space is pressed, go to Title
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			music.fadeTo(200,0);
			this.camera.fade('#ffffff');
			this.camera.onFadeComplete.add(restartGame,this);
		}
	}
};

// Create game
var game = new Phaser.Game(800, 600, Phaser.AUTO);
// Add game states
game.state.add('Boot', Game.Boot); // Booting up
game.state.add('Load', Game.Load); // Loading assets
game.state.add('Intro', introState) // Opening cutscene
game.state.add('Title', Game.Title) // Title screen
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
game.state.add('B5', B5); // Nothing
game.state.add('D1', D1); // Delson conversation 1
game.state.add('D2', D2); // Delson conversation 2
game.state.add('D3', D3); // Delson conversation 3
game.state.add('D4', D4); // Delson conversation 4
game.state.add('R1', R1); // D4V3 conversation 1
game.state.add('R2', R2); // D4V3 conversation 2
game.state.add('R3', R3); // D4V3 conversation 3
game.state.add('R4', R4); // D4V3 conversation 4
game.state.add('Credits', Game.Credits) // Ending and credits
// Begin boot state
game.state.start('Boot');

// Go to intro when fade is complete
function startGame(){
	this.camera.onFadeComplete.removeAll(this);
	this.state.start('Intro');
}

// Go to title when fade is complete and reset important variables
function restartGame(){
	convoIndex1 = 0;
	convoIndex2 = 0;
	convoIndex3 = 0;
	convoIndex4 = 0;
	cutsceneStatus = 0;
	energy = 100;
	energyRegen = 0.05;
	lastConvo = 0;
	levelNum = 0;
	hallStart = 600;
	music.stop();
	this.camera.onFadeComplete.removeAll(this);
	this.state.start('Title');
}

// Change volume when speaker button is clicked
function changeVolume(){
	if(sfxVolume == 1){
		sfxVolume = 0.3;
		volumeSprite.animations.play('mid');
	}
	else if(sfxVolume == 0.3){
		sfxVolume = 0.1;
		volumeSprite.animations.play('min');
	}
	else if(sfxVolume == 0.1){
		sfxVolume = 0;
		volumeSprite.animations.play('mute');
	}
	else if(sfxVolume == 0){
		sfxVolume = 1;
		volumeSprite.animations.play('max');
	}
	selectedSound.play('',0,sfxVolume);
	music.volume = sfxVolume;
}
