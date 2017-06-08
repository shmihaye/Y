
// Global variables for intro state
var cutsceneStatus = 0, manta, tween, beacon1, beacon2, beacon3, beacon4, beacon5, beacon6, beacon7, beacon8, beacon9, beacon10, beaconFlash;

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
		
		// Add Manta ship (player)
		manta = game.add.sprite(6000, 6000, 'ship');
		game.physics.arcade.enable(manta);
		manta.enableBody = true;
		manta.anchor.set(0.5);
		manta.scale.x = 0.5; manta.scale.y = 0.5;
		manta.animations.add('fly1', [0,1], 10, true);

		// Add planet earth
		planetEarth = game.add.sprite(80, 300, 'earth');
		planetEarth.anchor.set(0.5);

		// Add Terra Novus (New Earth in Latin)
		terraNovus = game.add.sprite(700, 300, 'terraNovus');
		terraNovus.anchor.set(0.5);

		// Add nebulas
		nebula1 = game.add.sprite(6000, 6000, 'nebula');
		nebula1.anchor.set(0.5);
		nebula1.scale.x = 2.5; nebula1.scale.y = 3;

		nebula2 = game.add.sprite(6000, 6000, 'nebula');
		nebula2.anchor.set(0.5);
		nebula2.scale.x = 2; nebula2.scale.y = 2.3;

		nebula3 = game.add.sprite(6000, 6000, 'nebula');
		nebula3.anchor.set(0.5);
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

		// Adjust beacon sizes
		beacon1.scale.x = 1.7; beacon1.scale.y = 1.7;
		beacon2.scale.x = 1.7; beacon2.scale.y = 1.7;
		beacon3.scale.x = 1.7; beacon3.scale.y = 1.7;
		beacon4.scale.x = 1.7; beacon4.scale.y = 1.7;
		beacon5.scale.x = 1.7; beacon5.scale.y = 1.7;
		beacon6.scale.x = 1.7; beacon6.scale.y = 1.7;
		beacon7.scale.x = 1.7; beacon7.scale.y = 1.7;
		beacon8.scale.x = 1.7; beacon8.scale.y = 1.7;
		beacon9.scale.x = 1.7; beacon9.scale.y = 1.7;
		beacon10.scale.x = 1.7; beacon10.scale.y = 1.7;
		
		// Set beacon anchors to center
		beacon1.anchor.set(0.5);
		beacon2.anchor.set(0.5);
		beacon3.anchor.set(0.5);
		beacon4.anchor.set(0.5);
		beacon5.anchor.set(0.5);
		beacon6.anchor.set(0.5);
		beacon7.anchor.set(0.5);
		beacon8.anchor.set(0.5);
		beacon9.anchor.set(0.5);
		beacon10.anchor.set(0.5);

		// Add physics to beacon8
		game.physics.arcade.enable(beacon8);
		beacon8.enableBody = true;

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

		// Add dotted line sprite
		dotLine1 = game.add.sprite(6000, 6000, 'dotLine');
		dotLine2 = game.add.sprite(6000, 6000, 'dotLine');
		dotLine1.anchor.setTo(0.5,0.5);
		dotLine2.anchor.setTo(0.5,0.5);
		dotLine1.angle = 90;
		dotLine2.angle = 150;
		
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
		
		// Text Variables
		passage1 = 'In the year 2064, the Pioneer 1 starship arrived on Terra Novus, a habitable planet several light years away.'
		passage2 = 'In its wake, it left waypoint beacons in space to serve as a road between the worlds.'
		passage3 = 'They serve as the fastest and safest route to Terra Novus, avoiding dangerous nebulas and storms.'
		passage4 = 'It has been 20 years since Pioneer 1 first landed. You are the captain of the TNST-23 “Manta,” a space transport on a routine medicine delivery to Terra Novus.'
		passage5 = 'While en route to Terra Novus, one beacon was knocked out of place by an asteroid and thrown into the depths of space.'
		passage6 = 'When faced with either braving through a dangerous nebula, or tracking down the beacon and returning it to its place, you and the crew decide to seek out the beacon.'

		passageTemp = passage1;

		// Add text
		openingText = game.add.text(50, 30, passageTemp, { font: "26px Source Sans Pro", fill: textColor , align: "left",  wordWrap: true,wordWrapWidth: 750});
		
		// Fade in from black
		this.camera.flash('#ffffff');
		
		// Add skip text
		var skipText = game.add.text(0, 0, 'Press SPACE to skip', style2);
		skipText.setTextBounds(0, 500, 800, 100);
		skipText.stroke = '#000000';
    	skipText.strokeThickness = 6;
	},
	
	update: function() {
		
		// Part 1 of cutscene
		// Pioneer 1 flies to Terra Novus, then disappears
		if (cutsceneStatus == 0){
			if (pioneer1.x <= 660){
				pioneer1.body.velocity.x = 80;
			} else{
				pioneer1.visible = false;
				pioneer1.body.velocity.x = -60;
				cutsceneStatus = 1;
			}
		}

		// Part 2 of cutscene
		// Add text, add beacons, wait for pioneer 1 to return (invisible)
		if (cutsceneStatus == 1){
			openingText.text = passage1 + ' ' + passage2;
			beacon1.x = 150; beacon1.y = 300;
			beacon2.x = 200; beacon2.y = 350;
			beacon3.x = 250; beacon3.y = 280;
			beacon4.x = 300; beacon4.y = 204;
			beacon5.x = 350; beacon5.y = 230;
			beacon6.x = 400; beacon6.y = 300;
			beacon7.x = 425; beacon7.y = 365;
			beacon8.x = 500; beacon8.y = 430;
			beacon9.x = 650; beacon9.y = 315;
			beacon10.x = 600; beacon10.y = 380;
			
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 60;
				cutsceneStatus = 2;
			}
		}

		// Part 3 of cutscene
		// Change text, add nebulas, reverse pioneer 1
		if (cutsceneStatus == 2){
			openingText.text = passage3;
			nebula3.x = 200; nebula3.y = 250;
			nebula1.x = 530; nebula1.y = 350;
			nebula2.x = 320; nebula2.y = 300;
			if (pioneer1.x >= 660){
				pioneer1.body.velocity.x = -60;
				manta.x = 80; manta.y = 300;
				mantaNavigate();
				cutsceneStatus = 3;
			}
		}

		// Part 4 of cutscene
		// Add text, spawn ship, reverse pioneer 1
		if (cutsceneStatus == 3){
			openingText.text = passage3 + ' ' + passage4;
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 60;
				if(tween != null) tween.pause();
				manta.x = beacon7.x;
				manta.y = beacon7.y;
				beaconFlash = 4;
				manta.angle = 60;
				cutsceneStatus = 4;
			}
		}

		// Part 5 of cutscene
		// Change text, send beacon 8 into deep space, reverse pioneer 1
		if (cutsceneStatus == 4){
			openingText.text = passage5;
			beacon8.body.velocity.x = 7;
			beacon8.body.velocity.y = 12;
			if(beaconFlash == 0){beacon8.visible = !beacon8.visible; beaconFlash = 8;}
			else beaconFlash--;
			if (pioneer1.x >= 660){
				pioneer1.body.velocity.x = -60;
				cutsceneStatus = 5;
			}
		}

		// Part 6 of cutscene
		// Add text, add dotted lines, reverse pioneer 1
		if (cutsceneStatus == 5){
			openingText.text = passage6;
			dotLine1.x = 500; dotLine1.y = 380;
			dotLine2.x = 455; dotLine2.y = 430;
			beacon8.y = 800;
			if (pioneer1.x <= 60){
				pioneer1.body.velocity.x = 60;
				cutsceneStatus = 6;
			}
		}

		// Part 7 of cutscene
		// Send ship into deep space, fade out
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
		
		// Skip forward if spacebar is pressed
		if(game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR)){
			if(pioneer1.body.velocity.x > 0) pioneer1.x = 660;
			else pioneer1.x = 60;
		}
		
	},

};

// Function that sends Manta ship to each beacon, but it doesn't work. 
// Reminder to Ray to delete this before final submission, unless we get it working
function mantaNavigate(){
	tween = null;
	if(manta.x == beacon1.x && manta.y == beacon1.y){manta.angle = 45; tween = game.add.tween(manta).to( {x: beacon2.x, y: beacon2.y}, 900, "Linear", true);}
	else if(manta.x == beacon2.x && manta.y == beacon2.y){manta.angle = -45; tween = game.add.tween(manta).to( {x: beacon3.x, y: beacon3.y}, 900, "Linear", true);}
	else if(manta.x == beacon3.x && manta.y == beacon3.y){manta.angle = -50; tween = game.add.tween(manta).to( {x: beacon4.x, y: beacon4.y}, 900, "Linear", true);}
	else if(manta.x == beacon4.x && manta.y == beacon4.y){manta.angle = 30; tween = game.add.tween(manta).to( {x: beacon5.x, y: beacon5.y}, 900, "Linear", true);}
	else if(manta.x == beacon5.x && manta.y == beacon5.y){manta.angle = 45; tween = game.add.tween(manta).to( {x: beacon6.x, y: beacon6.y}, 900, "Linear", true);}
	else if(manta.x == beacon6.x && manta.y == beacon6.y){manta.angle = 60; tween = game.add.tween(manta).to( {x: beacon7.x, y: beacon7.y}, 900, "Linear", true);}
	else if(manta.x != beacon7.x){manta.angle = 0; tween = game.add.tween(manta).to( {x: beacon1.x, y: beacon1.y}, 900, "Linear", true);}
	if(tween != null) tween.onComplete.add(mantaNavigate);
}

// Go to play state when fade is complete
function playGame(){
	this.state.start('Play'); 
}