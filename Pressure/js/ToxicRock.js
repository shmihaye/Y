function ToxicRock(game, image) {
	
	Phaser.Sprite.call(this, game, 850, 0, image);
	
	// Physics
	game.physics.arcade.enable(this);
	
	// Animations
	this.animations.add('default', [0, 1, 2, 3, 4], 10, true);
	this.animations.play('default');
	
}

ToxicRock.prototype = Object.create(Phaser.Sprite.prototype);
ToxicRock.prototype.constructor = ToxicRock;

ToxicRock.prototype.die = function(){
	// Play random break sound :)
	breakSounds[Math.round(Math.random()*4)].play();
	this.kill();
}

ToxicRock.prototype.update = function() {
	
	
	
}
