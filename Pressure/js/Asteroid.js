function Asteroid(game, image){	
	// Call to Phaser.Sprite
	Phaser.Sprite.call(this, game, 850, 0, image);	
	// Add properties and set default values
	game.physics.arcade.enable(this);
	this.body.gravity.y = 0;
	this.body.velocity.x = -60;
	this.scale.set(2 * Math.random() + 1);
	this.anchor.set(0.5);
	this.primed = false;
}
Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;

Asteroid.prototype.update = function(){
	
	game.physics.arcade.overlap(this, obstacles, asteroidCollision, null, this);
	
}

function asteroidCollision(object1, object2) {
	
	if (isSpecialRock(object1) || isSpecialRock(object2)) { return; }
	
	if (object1.primed || object2.primed) {
	
		object1.kill();
		object2.kill();
		
	}
	
}
