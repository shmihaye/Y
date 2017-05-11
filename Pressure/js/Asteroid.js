function Asteroid(game, image){
	// Call to Phaser.sprite
	Phaser.Sprite.call(this, game, 850, 0, image);
	// Add properties
	game.physics.enable(this);
	this.body.gravity.y = 0;
	this.body.velocity.x = -30;
	this.scale.set(2 * Math.random() + 1);
	this.anchor.set(0.5);
	this.primed = false;
}
Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype.update = function(){}