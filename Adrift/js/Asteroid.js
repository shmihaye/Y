function Asteroid(game, image){
	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);	
	
	// Add properties and set default values
	game.physics.arcade.enable(this);
}
Asteroid.prototype = Object.create(Phaser.Sprite.prototype);

Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.die = function(){
	// Play random break sound :)
	breakSounds[Math.round(Math.random()*4)].play('',0,sfxVolume);
	// Create particles
	emitter.x = this.x;
	emitter.y = this.y;
	emitter.start(true, 2000, null, 5);
	this.kill();
}
