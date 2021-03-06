
function OrbitRock(game, image) {
	
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	this.moon = null;
	
	// Physics
	game.physics.arcade.enable(this);
}

OrbitRock.prototype = Object.create(Phaser.Sprite.prototype);

OrbitRock.prototype.constructor = OrbitRock;

OrbitRock.prototype.die = function(){
	// Play random break sound :)
	breakSounds[Math.round(Math.random()*4)].play('',0,sfxVolume);
	// Create particles
	emitter.x = this.x;
	emitter.y = this.y;
	emitter.start(true, 2000, null, 5);
	if(this.moon != null){
		this.moon.body.acceleration.x = 0;
		this.moon.body.acceleration.y = 0;
	}
	this.moon = null;
	this.kill();
}

OrbitRock.prototype.update = function() {

	if (this.moon != null && this.moon !== player.grabbed) {
		this.moon.body.acceleration.x = this.x - this.moon.body.x;
		this.moon.body.acceleration.y = this.y - this.moon.body.y;
	}
	
}
