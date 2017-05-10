function Asteroid(game, image){
	// Call to Phaser.sprite
	Phaser.Sprite.call(this, game, 900, 100 + (400 * Math.random()), image);
	// Add properties
	game.physics.enable(this);
	this.body.gravity.y = 0;
	this.scale.set(2 * Math.random() + 1);
	this.anchor.set(0.5);
	this.body.velocity.x = -150 * Math.random();
	this.body.velocity.y = -25 + (50 * Math.random());
	this.primed = false;
}
Asteroid.prototype = Object.create(Phaser.Sprite.prototype);
Asteroid.prototype.constructor = Asteroid;
Asteroid.prototype.update = function(){}