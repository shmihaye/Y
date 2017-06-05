
// Global variables for intro state
var cutsceneStatus = 0;

// Intro State Container
var introState = {
	
	create: function() {
		
		var textColor = '#F0FFF0'

		// Add background
		BG = game.add.sprite(0, 0, 'spaceBackground');

		// Add spaceship
		pioneer1 = game.add.sprite(62, 280, 'pioneer1');
		game.physics.arcade.enable(pioneer1);
		pioneer1.enableBody = true;
		pioneer1.animations.add('fly', [0,1], 10, true);

		// Add planet earth
		planetEarth = game.add.sprite(60, 280, 'earth');

		// Add Terra Novus (New Earth in Latin)
		terraNovus = game.add.sprite(660, 280, 'terraNovus');

		// Add nebulas
		nebula1 = game.add.sprite(6000, 6000, 'nebula');
		nebula1.anchor.setTo(0.5,0.5);
		nebula1.scale.x = 2.5; nebula1.scale.y = 3;

		nebula2 = game.add.sprite(6000, 6000, 'nebula');
		nebula2.anchor.setTo(0.5,0.5);
		nebula2.scale.x = 2; nebula2.scale.y = 2.3;

		nebula3 = game.add.sprite(6000, 6000, 'nebula');
		nebula3.anchor.setTo(0.5,0.5);
		nebula3.scale.x = 1.5; nebula3.scale.y = 3;

		// Add beacons (offscreen)
		beacon1 = game.add.sprite(6000, 6000, 'beacon');
		beacon2 = game.add.sprite(6000, 6000, 'beacon');
		beacon3 = game.add.sprite(6000, 6000, 'beacon');
		beacon4 = game.add.sprite(6000, 6000, 'beacon');
		beacon5 = game.add.sprite(6000, 6000, 'beacon');
		beacon6 = game.add.sprite(6000, 6000, 'beacon');
		beacon7 = game.add.sprite(6000, 6000, 'beacon');
		beacon8 = game.add.sprite(6000, 6000, 'beacon');
		beacon9 = game.add.sprite(6000, 6000, 'beacon');
		beacon10 = game.add.sprite(6000, 6000, 'beacon');

		// Add physics to beacon7
		game.physics.arcade.enable(beacon7);
		beacon7.enableBody = true;

		// Add beacon animations (yes this is innefficient, but it's a cutscene so it follows a set script)
		beacon1.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon2.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon3.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon4.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon5.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon6.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon7.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon8.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon9.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);
		beacon10.animations.add('pulsate', [0,1,2,3,4,5,6], 12, true);

		// Add Manta ship (player)
		manta = game.add.sprite(6000, 6000, 'ship');
		game.physics.arcade.enable(manta);
		manta.enableBody = true;
		manta.angle = 64;
		manta.scale.x = 0.3; manta.scale.y = 0.3;
		manta.animations.add('fly1', [0,1], 10, true);

		// Add dotted line sprite
		dotLine1 = game.add.sprite(6000, 6000, 'dotLine');
		dotLine2 = game.add.sprite(6000, 6000, 'dotLine');
		dotLine1.anchor.setTo(0.5,0.5);
		dotLine2.anchor.setTo(0.5,0.5);
		dotLine1.angle = 90;
		dotLine2.angle = 150;

		// Text Variables
		passage1 = 'In the year 2064, the Pioneer 1 starship arrived on Terra Novus, a habitable planet several light years away.'
		passage2 = 'In its wake, it left waypoint beacons in space to serve as a road between the worlds.'
		passage3 = 'They serve as the fastest and safest route to Terra Novus, avoiding dangerous nebulas and storms.'
		passage4 = 'It has been 20 years since Pioneer 1 first landed, and you are the captain of the TNST-23 “Manta,” a space transport on a routine medicine delivery to Terra Novus.'
		passage5 = 'While en route to Terra Novus, one beacon was knocked out of place by an asteroid and thrown into the depths of space.'
		passage6 = 'When faced with either braving through a dangerous nebula, or tracking down the beacon and returning it to its place, you and the crew decide to seek out the beacon.'

		passageTemp = passage1;

		// Add text
		openingText = game.add.text(50, 30, passageTemp, { font: "26px Source Sans Pro", fill: textColor , align: "left",  wordWrap: true,wordWrapWidth: 750});
		
		// Fade in from black
		this.camera.flash('#ffffff');
	},
	
	update: function() {
		
		// Pioneer 1 flies to Terra Novus, then disappears
		if (cutsceneStatus == 0){
			if (pioneer1.x <= 660){
				pioneer1.body.velocity.x = 80;
			} else{
				pioneer1.visible = false;
				pioneer1.body.velocity.x = -80;
				cutsceneStatus = 1;
			}
		}

		// Add more text, add beacons
		if (cutsceneStatus == 1){
			openingText.text = passage1 + ' ' + passage2;
			beacon1.x = 150; beacon1.y = 250;
			beacon2.x = 200; beacon2.y = 350;
			beacon3.x = 250; beacon3.y = 260;
			beacon4.x = 300; beacon4.y = 204;
			beacon5.x = 350; beacon5.y = 230;
			beacon6.x = 400; beacon6.y = 300;
			beacon7.x = 500; beacon7.y = 430;
			beacon8.x = 600; beacon8.y = 315;
			beacon9.x = 550; beacon9.y = 380;
			beacon10.x = 425; beacon10.y = 365;
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 80;
				cutsceneStatus = 2;
			}
		}

		if (cutsceneStatus == 2){
			openingText.text = passage3;
			nebula1.x = 520; nebula1.y = 380;
			nebula2.x = 346; nebula2.y = 301;
			nebula3.x = 232; nebula3.y = 289;
			if (pioneer1.x >= 660){
				pioneer1.body.velocity.x = -80;
				cutsceneStatus = 3;
			}
		}

		if (cutsceneStatus == 3){
			openingText.text = passage3 + ' ' + passage4;
			manta.x = 465; manta.y = 410;
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 80;
				cutsceneStatus = 4;
			}
		}

		if (cutsceneStatus == 4){
			openingText.text = passage5;
			beacon7.body.velocity.x = 7;
			beacon7.body.velocity.y = 12;
			if (pioneer1.x >= 660){
				pioneer1.body.velocity.x = -80;
				cutsceneStatus = 5;
			}
		}

		if (cutsceneStatus == 5){
			openingText.text = passage5 + ' ' + passage6;
			dotLine1.x = 520; dotLine1.y = 420;
			dotLine2.x = 485; dotLine2.y = 460;
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 80;
				cutsceneStatus = 6;
			}
		}

		if (cutsceneStatus == 6){
			dotLine1.x = 6000; dotLine1.y = 6000;
			dotLine2.x = 6000; dotLine2.y = 6000;
			manta.body.velocity.x = 14;
			manta.body.velocity.y = 24;
			if (pioneer1.x >= 660){
				this.camera.fade('#ffffff');
				this.camera.onFadeComplete.add(playGame,this);
			}
		}

		// Play animations
		pioneer1.animations.play('fly');
		manta.animations.play('fly1');
		beacon1.animations.play('pulsate');
		beacon2.animations.play('pulsate');
		beacon3.animations.play('pulsate');
		beacon4.animations.play('pulsate');
		beacon5.animations.play('pulsate');
		beacon6.animations.play('pulsate');
		beacon7.animations.play('pulsate');
		beacon8.animations.play('pulsate');
		beacon9.animations.play('pulsate');
		beacon10.animations.play('pulsate');

		
	},

};

// Go to play state when fade is complete
function playGame(){
	this.state.start('Play'); 
}